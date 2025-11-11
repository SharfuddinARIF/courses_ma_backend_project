import multer from 'multer';
import path from 'path';


const courseImageStorage = multer.diskStorage({
 
    destination: (req, file, cb) => {
        cb(null, 'uploads/courses');
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Accept file
    } else {
        // Reject file with an error message
        cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'), false);
    }
};


const uploadCourseImage = multer({
    storage: courseImageStorage,
    limits: { 
        fileSize: 1024 * 1024 * 5 // Limit files to 5MB
    },
    fileFilter: fileFilter
});


export const courseImageUploader = uploadCourseImage.single('image');