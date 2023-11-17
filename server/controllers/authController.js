import util from "util";
import dotenv from "dotenv";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
const frontend_url = process.env.FRONTEND_URL;
const admin_email = process.env.ADMIN_EMAIL;
const admin_password = process.env.ADMIN_EMAIL_PASSWORD;
const mail_service = process.env.MAIL_SERVICE;

const jwtVerify = util.promisify(jwt.verify);

// @desc    Authenticate user and set token
// @route   POST /api/auth/signin
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error:'Please fill the fields' })
        }
    
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error:'Email is not valid' })
        } 
        const user = await User.findOne({email})
       
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign({id: user._id, role: user.role}, accessTokenSecret, { expiresIn: accessTokenExpiry })
            const refreshToken = jwt.sign({id: user._id, role: user.role}, refreshTokenSecret, { expiresIn: refreshTokenExpiry})

            res.cookie('jwt', refreshToken, { 
                httpOnly: true, 
                sameSite: 'Lax', 
                secure: process.env.NODE_ENV !== 'development',  
                maxAge: 24 * 60 * 60 * 1000 });

            res.status(200).json( { accessToken, role: user.role })
        } else {
            res.status(400).json({ error:'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}


// @desc    Refresh refresh token
// @route   POST /api/auth/refresh
// @access  Private
const refreshTokens = ( req, res ) => {
    
     // Get the refresh token from the cookie
     const refreshToken = req.cookies.jwt;

     // If there is no token
     if (!refreshToken) {
         return res.status(406).json({ message: 'Unauthorized: Failed to read jwt' });; // Unauthorized
     }
 
     // Verify the refresh token
     jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
        
        if (err) {   
            return res.status(403).json({ message: 'Forbidden: failed in verifying token' });; // Forbidden
         }
 
         // If verification was successful, generate a new access token
         const accessToken = jwt.sign({ id: user.id, role: user.role }, accessTokenSecret, { expiresIn: accessTokenExpiry });
         
         // Send the new access token
         res.json({ accessToken });
     });

}


// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: 'Logout Successfully'})
    } catch ( error ) {
        console.log(error);
        res.status(500).json({error: error.message})  
    }
}


// @desc    Send email for resetting password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async(req, res) => {
    const { email } = req.body;
    
    try {
        
        if ( !email ) {
            return res.status(400).json({ error:'Please enter email' })
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error:'Email is not valid' })
        }
    
        const user = await User.findOne({email});
    
        if (!user) {
            return res.status(400).json({ error:'Email is not registered' })
        }

        const token = jwt.sign({id: user._id }, accessTokenSecret, { expiresIn: accessTokenExpiry })

        var transporter = nodemailer.createTransport({
            service: mail_service,
            auth: {
              user: admin_email,
              pass: admin_password
            }
          });
          
          var mailOptions = {
            from: admin_email,
            to: email,
            subject: 'FMB - FDRS Reset Password Link',
            text: `Hello,\nPlease go to this link to reset your password:\n ${frontend_url}/reset-password/${user._id}/${token} \nIf you did not request this, please ignore this email.\nThanks!`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        res.status(200).json(user);

    } catch ( error ) {
        //console.log(error);
        res.status(500).json({error: error.message});
    }

}

// @desc    Send email for resetting password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async(req, res) => {
    const { id, token, password} = req.body;

    try {

        if (!validator.isStrongPassword(password, {minLength:7, minSymbols:0})) {
            return res.status(400).json({ error:'Passwords should be at least 7 characters long with an uppercase letter, a lowercase letter and a number'})
        }

        // Check id is valid Mongoose ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'User not found!'})
        }

        let authData;

        // Check if token is valid
        try {
            authData = await jwtVerify(token, accessTokenSecret);
        } catch (error) {
            return res.status(401).json({ error: 'Reset password link validity expired! Please request again'})
        }

        req.authData = authData;

        // Check if ID from token is same with ID from POST
        if ( id !== req.authData.id) {
            return res.status(400).json({ error: 'User not found!'})
        }
        
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' }); 
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: "Password reset successfully"})
        

        
    } catch (error) {
        //console.log(error);
        res.status(500).json({error: error.message});
    }
}


export {
    authUser,
    logoutUser,
    refreshTokens,
    forgotPassword,
    resetPassword
}