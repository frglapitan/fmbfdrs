import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String
    },
    role: {
        type: String,
        enum: ['sysadmin','admin','user'],
        default: 'user',
        require: true
    }
}, {timestamps: true});

export const User = mongoose.model('User', userSchema);