import express from 'express';
import {
    registerUser,
    loginUser,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    changePassword,
    getUserProfile
} from '../controllers/authcontrollers.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/change-password', protect, changePassword);
router.get('/profile', protect, getUserProfile);

export default router;
