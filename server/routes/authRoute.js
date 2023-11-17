import express from "express";
import {
    authUser,
    logoutUser,
    refreshTokens,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js"


const router = express.Router();

router.post('/signin', authUser);
router.post('/refresh', refreshTokens);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);              // Send forgot password email
router.post('/reset-password', resetPassword);              // Send forgot password email

export default router;