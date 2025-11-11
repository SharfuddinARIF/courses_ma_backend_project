import Course from '../models/Course.js';
import mongoose from 'mongoose'; 

/**===============================
 * @desc Get all published courses with filtering, search, pagination, and sorting
 * @route GET /api/courses
 * @access Public
 =================================*/
export const getCourses = async (req, res) => {
    
    const { q, category, instructor, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const filter = { published: true };
    let query = Course.find(filter);

    if (q) {
        query = query.find({ $text: { $search: q } });
    }

    if (category) filter.category = category;
    if (instructor) filter.instructor = instructor;

    query = query.find(filter);

    try {
        // 3. Pagination & Sorting
        const pageSize = parseInt(limit, 10);
        const skip = (parseInt(page, 10) - 1) * pageSize;

        // Count total documents for pagination metadata
        const totalCourses = await Course.countDocuments(filter);
        
        // Apply sorting, skipping, limiting, and population
        const courses = await query
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .populate('instructor', 'name email');

        res.json({
            success: true,
            count: courses.length,
            total: totalCourses,
            pagination: { page: parseInt(page, 10), limit: pageSize },
            data: courses
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error retrieving courses.', error: err.message });
    }
};

/**================================
 * @desc Get a single course by ID
 * @route GET /api/courses/:id
 * @access Public
 ==================================*/

export const getCourse = async (req, res) => {
    try {
        // Validate ID format before querying
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid Course ID format.' });
        }
        
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        
        res.json({ success: true, data: course });
        
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error retrieving course.', error: err.message });
    }
};

/**=======================================================
 * @desc Create a new course
 * @route POST /api/courses
 * @access Private (Instructor/Admin)
========================================================= */
export const createCourse = async (req, res) => {
    try {
        const course = await Course.create({ ...req.body, instructor: req.user._id });

        res.status(201).json({ success: true, data: course });
        
    } catch (err) {
        //error hand
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Validation failed.', errors: err.errors });
        }
        res.status(500).json({ success: false, message: 'Server error creating course.', error: err.message });
    }
};

/**=========================================
 * @desc Update course details
 * @route PUT /api/courses/:id
 * @access Private (Instructor/Admin)
============================================= */
export const updateCourse = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid Course ID format.' });
        }
        
        let course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        
        const isAuthorized = req.user.role === 'admin' || course.instructor.equals(req.user._id);
        if (!isAuthorized) {
            return res.status(403).json({ success: false, message: 'Forbidden: You are not authorized to update this course.' });
        }
        
       
        course = await Course.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true, // Return the updated document
                runValidators: true // Run schema validators on the update
            }
        );

        res.json({ success: true, data: course });
        
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Validation failed during update.', errors: err.errors });
        }
        res.status(500).json({ success: false, message: 'Server error updating course.', error: err.message });
    }
};

/**=====================================
 * @desc Delete a course
 * @route DELETE /api/courses/:id
 * @accss (Instructor/Admin)
 ============================================*/
export const deleteCourse = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid Course ID format.' });
        }
        
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        
     
        const isAuthorized = req.user.role === 'admin' || course.instructor.equals(req.user._id);
        if (!isAuthorized) {
            return res.status(403).json({ success: false, message: 'Forbidden: You are not authorized to delete this course.' });
        }
        
       
        await course.deleteOne(); 
        
        res.json({ success: true, message: 'Course deleted successfully.' });
        
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error deleting course.', error: err.message });
    }
};

/**======================================================================
 * @desc Enroll the authenticated user into a course
 * @route POST /api/courses/:id/enroll
 ==========================================================================*/
export const enrollCourse = async (req, res) => {
    
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid Course ID format.' });
        }

        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        
        // if already enrolled
        if (course.studentsEnrolled.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: 'You are already enrolled in this course.' });
        }
        
        //  Update Course
        course.studentsEnrolled.push(req.user._id);
        await course.save();

        // 2. Update User 
        req.user.enrolledCourses.push(course._id);
        await req.user.save();
        
        res.json({ success: true, message: 'Enrolled successfully.' });
        
    } catch (err) {
   
        res.status(500).json({ success: false, message: 'Server error during enrollment.', error: err.message });
    }
};