import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
// Make sure this import matches the file name in your middleware folder!
import { courseImageUploader } from '../middleware/imgUpload.js'; 
import { 
    getCourses, 
    getCourse, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    enrollCourse 
} from '../controllers/courseController.js';

const router = express.Router();

/**====================
 * @route /api/courses
 =======================*/

// Base routes
router.route('/')
    .get(getCourses) 

    .post(protect, authorize('instructor', 'admin'), courseImageUploader, createCourse); 

// Routes specific to a single course ID
router.route('/:id')
    .get(getCourse)
    .put(protect, courseImageUploader, updateCourse)

// Route for student enrollment
router.route('/:id/enroll')

    .post(protect, authorize('student', 'admin'), enrollCourse);

export default router;