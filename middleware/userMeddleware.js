import bcrypt from 'bcryptjs';


export function applyUserMiddleware(schema) {
    
    // ---Password Hashing ---
    schema.pre('save', async function(next) {
        if (!this.isModified('password')) {
            return next();
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
        
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error); 
        }
    });

//match passwordv---
    schema.methods.comparePassword = function(plainPassword) {
        return bcrypt.compare(plainPassword, this.password);
    };
}