import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving (async functions don't need next())
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        console.log('backend / User / pre-save / Password not modified, skipping hash');
        return;
    }

    console.log('backend / User / pre-save / Hashing password');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('backend / User / pre-save / Password hashed successfully');
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    console.log('backend / User / comparePassword / Comparing passwords');
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('backend / User / comparePassword / Result:', result ? 'MATCH' : 'NO MATCH');
    return result;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
