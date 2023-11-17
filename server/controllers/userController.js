import validator from "validator";
import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";


// @desc    Register a new user
// @route   POST /api/user/
// @access  Private   for s_admin and admin only
const registerUser = async ( req, res ) => {
    const { email, password, fullname, department, role } = req.body;
    try {
        
        if ( !email || !password || !fullname || !role ) {
            return res.status(400).json({ error:'Please fill the fields' })
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error:'Email is not valid' })
        }

        if (!validator.isStrongPassword(password, {minLength:7, minSymbols:0})) {
            return res.status(400).json({ error:'Passwords should be at least 7 characters long with at least an uppercase letter, a lowercase letter and a number'})
        }
    
        const exists = await User.findOne({email});
    
        if (exists) {
            return res.status(400).json({ error:'Email already in use' })
        }
    
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt)
    
        const user = await User.create({email, password:hashedPassword, fullname, department, role})

        res.status(201).json({user});

    } catch (error) {
        //console.log(error);
        res.status(500).json({error: error.message})
    }
};


// @desc    Get all users
// @route   GET /api/user/
// @access  Private  for s_admin and admin only
const getAllUsers = async( req, res ) => {
    
    let users;

    try {
        // Only super admins can see other super admins
        if ( req.authData.role === "sysadmin") {
            users = await User.find({},{_id:1, email:1, fullname:1, department:1, role: 1})
        } else {
            users = await User.find({role: {$ne: 'sysadmin'}},{_id:1, email:1, fullname:1, department:1, role: 1})
        }
        
        return res.status(200).json(users);

    } catch (error) {
        //console.log(error);
        res.status(500).json({error: error.message})
    }
}


// @desc    Get own profile excluding password
// @route   GET /api/user/me
// @access  Private
const getOwnProfile = async (req, res) => {
    try {
        const user = await User.findById(req.authData.id).select('-password');

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json(user)
    } catch ( error ) {
        //console.log(error);
        res.status(500).json({error: error.message})  
    }
}


// @desc    Update own profile excluding password
// @route   PUT /api/user/me
// @access  Private
const updateOwnProfile = async (req, res) => {
    try {
        const user = await User.findById(req.authData.id);

        if (!user) {

          return res.status(404).json({ message: 'User not found' });

        } else {
            const { email, fullname, department, role } = req.body;

            if (email) {
                const exists = await User.findOne({ email });
                if (exists && String(exists._id) !== String(user._id)) {
                    return res.status(400).json({ error: 'Email already in use' });
                }
                user.email = email;
            }

            if (fullname) user.fullname = fullname;
            if (department) user.department = department;
            if (role) user.role = role;

            await user.save();

            res.status(200).json(user);
        }
        
    } catch ( error ) {
        //console.error(error);
        res.status(500).json({error: error.message});
    }
}


// @desc    Update own password
// @route   PUT /api/user/mypasswd
// @access  Private
const updateOwnPassword = async (req, res) => {
    try {
        const { oldpassword, newpassword } = req.body;

        if (!oldpassword || !newpassword) {
            return res.status(400).json({ error:'Please fill the fields' })
        }

        if (!validator.isStrongPassword(newpassword, {minLength:7, minSymbols:0})) {
            return res.status(400).json({ error:'Passwords should be at least 7 characters long with an uppercase letter, a lowercase letter and a number'})
        }

        const user = await User.findById(req.authData.id);

        if (user) {
            const isMatch = await bcrypt.compare(oldpassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Old password is incorrect' });
            }

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(newpassword, salt);
            user.password = hashedPassword;

            await user.save();

            res.status(200).json(user);

        } else {
            res.status(404).json({ error:'User not found!' })
        }

    } catch ( error ) {
        //console.error(error);
        res.status(500).json({error: error.message});
    }
}


// @desc    Get user profile
// @route   GET /api/user/u/:id
// @access  Private
const getUserProfile = async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No user found!'})
        }

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(400).json({ error: 'No user found!'})
        }

        res.status(200).json(user);

    } catch ( error ) {
        //console.error(error);
        res.status(500).json({error: error.message});
    }

}


// @desc    Update user profile excluding password
// @route   PUT /api/user/u/:id
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No user found!'})
        }
        const user = await User.findById(id);

        if (!user) {

          return res.status(404).json({ message: 'User not found' });

        } else {
            const { email, fullname, department, role } = req.body;

            if (email) {
                const exists = await User.findOne({ email });
                if (exists && String(exists._id) !== String(user._id)) {
                    return res.status(400).json({ error: 'Email already in use' });
                }
                user.email = email;
            }

            if (fullname) user.fullname = fullname;
            if (department) user.department = department;
            if (role) user.role = role;

            await user.save();

            res.status(200).json(user);
        }
        
    } catch ( error ) {
        //console.log(error);
        res.status(500).json({error: error.message});
    }
}


export {
    registerUser,
    getAllUsers,
    getOwnProfile,
    updateOwnProfile,
    updateOwnPassword,
    getUserProfile,
    updateUserProfile
};