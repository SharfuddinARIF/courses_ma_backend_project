
import User from '../models/User.js';

/**============================================================
 * @desc Get the profile of the currently authenticated user
 * @route GET /api/users/me
 * @access Private (Uses req.user set by 'protect' middleware)
 ===============================================================*/
export const getMe = (req, res) => {
    try {
        res.json({ 
            success: true, 
            data: req.user ,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error retrieving user profile.', error: err.message });
    }
};

/**==================================
 * @desc Get all users (Admin only)
 * @route GET /api/users
 * @access Private (Admin)
 ========================================*/
export const getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select('-password');
        
        res.json({ 
            success: true, 
            count: users.length, 
            data: users 
        });
        
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error retrieving all users.', error: err.message });
    }
};

/**============================================================
 * @desc Update the profile of the currently authenticated user
 * @route PUT /api/users/me
 * @access Private
 =============================================================*/

export const updateMe = async (req, res) => {
    const allowedUpdates = ['name']; 
    const updates = {};

    Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updates[key] = req.body[key];
        }
    });
    
  
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
    }

    try {
        Object.assign(req.user, updates); 
        await req.user.save();

       
        res.json({ 
            success: true, 
            message: 'Profile updated successfully.', 
            data: req.user 
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Validation failed during profile update.', errors: err.errors });
        }
        res.status(500).json({ success: false, message: 'Server error updating profile.', error: err.message });
    }
};