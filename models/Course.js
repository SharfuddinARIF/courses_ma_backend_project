import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const COURSE_CATEGORIES = [
    'Development', 
    'Design', 
    'Marketing', 
    'Business', 
    'IT & Software', 
    'Personal Development'
];

// --- Lesson ---
const lessonSchema = new Schema({
    title: { 
        type: String,  
        trim: true,
        maxlength: [100, 'Lesson title cannot be more than 100 characters.'] 
    },
    content: { 
        type: String, 
      
    },
    durationMinutes: { 
        type: Number, 
        required: true, 
        min: [1, 'Duration must be at least 1 minute.'] 
    }
}, { _id: false });

// -------- Main Course Schema --------------------//
const courseSchema = new Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true,
        unique: true, 
        maxlength: [150, 'Course title cannot be more than 150 characters.']
    },
    description: {
        type: String,
        required: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters.']
    },
    instructor: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    price: { 
        type: Number, 
        default: 0,
        min: [0, 'Price cannot be negative.']
    },
    category: { 
        type: String,
        required: true,
        enum: COURSE_CATEGORIES 
    },

    imageUrl: { 
        type: String, 
    },

    lessons: [lessonSchema],
    studentsEnrolled: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    published: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

courseSchema.index({ 
    title: 'text', 
    description: 'text', 
    category: 'text' 
});

export default model('Course', courseSchema);