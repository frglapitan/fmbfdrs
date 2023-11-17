import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./server/models/userModel.js";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();

const passwd = 'Abc12345'  // Change this

async function createSysAdmin() {

    if (!validator.isStrongPassword(passwd, {minLength:7, minSymbols:0})) {
        console.log("Password is not strong enough. Minimum of 7 characters, and at least 1 uppercase letter, 1 lowercase letter and 1 number")
        process.exit(1);
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(passwd, salt)
    
    const adminUser = new User({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        fullname: 'FDRS System Admin',
        department: 'FDRS System',
        role: 'sysadmin'
    });

    await adminUser.save().then(() => {
        console.log("Successfully created account!")
        mongoose.connection.close();
        console.log('Mongoose connection disconnected');
        process.exit(0);
    });
}


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected…')
    createSysAdmin();
  })
  .catch(err => console.log(err));