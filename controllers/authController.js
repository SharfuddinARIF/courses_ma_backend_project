import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js'; 


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
    });
};

/**=================
 * @desc Register new user
 * @route POST /api/auth/register
 * @access Public
 ==================*/

export const register = async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        // user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already registered.' });
        }
        const user = await User.create({ name, email, password, role });
        
        // response
        res.status(201).json({ 
            success: true,
            token: generateToken(user._id), 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });

    } catch (err) {
        // errors
        res.status(500).json({ success: false, message: 'Server error during registration.', error: err.message });
    }
};

/**===================================
 * @desc Authenticate user & get token
 * @route POST /api/auth/login
 * @access Public
 ======================================*/

export const login = async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            // User not found
            return res.status(400).json({ success: false, message: 'Invalid credentials.' });
        }

        const match = await user.comparePassword(password);
        
        if (!match) {
            // Password mismatch
            return res.status(400).json({ success: false, message: 'Invalid credentials.' });
        }

        //  response
        res.json({ 
            success: true,
            token: generateToken(user._id), 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });
        
    } catch (err) {
      //error
        res.status(500).json({ success: false, message: 'Server error during login.', error: err.message });
    }
};