import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

export const protect = async (req, res, next) => {
    let token;
    
  
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
  
        token = authHeader.split(' ')[1]; 
    }
    if (!token) {              //if token is missing
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied: No token provided.' 
        });
    }

    try {
        //  Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
         
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied: User not found.' 
            });
        }
        
        req.user = user;
        next();
        
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
             return res.status(401).json({ 
                success: false, 
                message: 'Invalid token: Authentication failed.' 
            });
        }
        if (err.name === 'TokenExpiredError') {
             return res.status(401).json({ 
                success: false, 
                message: 'Token expired: Please log in again.' 
            });
        }
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during authentication.' 
        });
    }
};

export const authorize = (...roles) => (req, res, next) => {
  
    if (!req.user) {
        return res.status(401).json({ 
            success: false,
            message: 'Not authenticated. Run protect middleware first.' 
        });
    }

    // Check user's role is included in the allowed list
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
            success: false,
            message: `Forbidden: User role (${req.user.role}) is not authorized to access this resource.` 
        });
    }
    
    next();
}