import mongoose from 'mongoose';
import { applyUserMiddleware } from '../middleware/userMeddleware.js'; 
 


const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { 
        type: String, 
        required: true, 
        trim: true,
        maxlength: 100 
    },
  email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
  password: { 
        type: String, 
        required: true,
        select: false, 
        minlength: [6, 'Password must be at least 6 characters long.'] 
    },
  role: { 
        type: String, 
        enum: ['student','instructor',], 
        default: 'student',
        trim: true 
    },
  enrolledCourses: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Course' 
    }]
}, { timestamps: true });

applyUserMiddleware(userSchema);//

export default model('User', userSchema);