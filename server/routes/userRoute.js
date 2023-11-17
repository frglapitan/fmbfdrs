import express from "express";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
import {
    registerUser,
    getAllUsers,
    getOwnProfile,
    updateOwnProfile,
    updateOwnPassword,
    getUserProfile,
    updateUserProfile
} from "../controllers/userController.js";


const router = express.Router();

router.route('/').post(verifyToken, checkRole(['sysadmin','admin']), registerUser)       // Create new User
                .get(verifyToken, checkRole(['sysadmin','admin']), getAllUsers);         // See all registered users

router.route('/me').get(verifyToken, getOwnProfile)                                     // See own profile
                .put(verifyToken, updateOwnProfile);                                    // Update own profile

router.route('/mypasswd').put(verifyToken, updateOwnPassword);                                   // update password

router.route('/u/:id').get(verifyToken, checkRole(['sysadmin','admin']), getUserProfile)     // Get user profile by id
                .put(verifyToken, checkRole(['sysadmin','admin']), updateUserProfile);       // Update user profile


export default router;