import express from 'express';
import {
    registerUser,
    loginUser,
    verifyOTP,
    resendOTP,
    getUserProfile
} from '../controllers/authcontrollers.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/profile', protect, getUserProfile);

export default router;
