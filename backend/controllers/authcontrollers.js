import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendOTPEmail } from '../utils/sendEmail.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_\-])[A-Za-z\d@$!%*?&#^_\-]{8,}$/;

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user & Send OTP (Valid for 60 seconds)
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&#^_).'
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 60 SECONDS VALIDITY
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 60 * 1000);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            otp,
            otpExpires,
        });

        await sendOTPEmail(email, otp);

        res.status(201).json({
            requireVerification: true,
            email: user.email,
            message: 'Verification code sent (valid for 60 seconds).',
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Verify 6-Digit OTP
// @route   POST /api/auth/verify-otp
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP code are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 60-Second Check
        if (user.otpExpires && user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'Verification code expired (60s limit). Please request a new code.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid verification code. Please check and try again.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            message: 'Account successfully verified!',
        });
    } catch (error) {
        console.error('OTP Verification error:', error);
        res.status(500).json({ message: 'Server error verifying OTP' });
    }
};

// @desc    Resend OTP (60 Seconds)
// @route   POST /api/auth/resend-otp
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 60 * 1000); // 60 seconds
        await user.save();

        await sendOTPEmail(email, otp);
        res.json({ message: 'New verification code sent! Valid for 60 seconds.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resending OTP' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter both email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            const otp = generateOTP();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 60 * 1000); // 60 seconds
            await user.save();
            await sendOTPEmail(email, otp);

            return res.status(200).json({
                requireVerification: true,
                email: user.email,
                message: 'Account pending verification. A code has been sent (valid for 60 seconds).',
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};
