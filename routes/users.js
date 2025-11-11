import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getMe, getAllUsers, updateMe } from '../controllers/userController.js';

const router = express.Router();

/**
 * @route /api/users
 */

// --- Authenticated User Routes ---

router.route('/me')
    .get(protect, getMe)    // GET /api/users/me (Get own profile)
    .put(protect, updateMe); // PUT /api/users/me (Update own profile)

// --- Admin Routes ---
router.route('/')
    .get(protect, authorize('admin'), getAllUsers); // GET /api/users (Get all users)

export default router;