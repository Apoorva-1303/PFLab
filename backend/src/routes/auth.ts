import { Router } from 'express';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Generate JWT token
const generateToken = (user: { _id: string; email: string; name: string }): string => {
    console.log('backend / auth / generateToken / Generating token for:', user.email);
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        jwtSecret,
        { expiresIn: jwtExpiresIn as jwt.SignOptions['expiresIn'] }
    );
    console.log('backend / auth / generateToken / Token generated successfully');
    return token;
};

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    console.log('backend / auth / register / Request received');
    try {
        const { name, email, password } = req.body;
        console.log('backend / auth / register / Data:', { name, email, password: '***' });

        // Validate input
        if (!name || !email || !password) {
            console.log('backend / auth / register / Validation failed: missing fields');
            res.status(400).json({ message: 'Name, email, and password are required' });
            return;
        }

        // Check if user already exists
        console.log('backend / auth / register / Checking if user exists');
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log('backend / auth / register / User already exists');
            res.status(400).json({ message: 'Email already registered' });
            return;
        }

        // Create new user
        console.log('backend / auth / register / Creating new user');
        const user = new User({ name, email, password });
        await user.save();
        console.log('backend / auth / register / User saved to database');

        // Generate token
        const token = generateToken({
            _id: user._id.toString(),
            email: user.email,
            name: user.name
        });

        console.log('backend / auth / register / Success, returning response');
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('backend / auth / register / Error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    console.log('backend / auth / login / Request received');
    try {
        const { email, password } = req.body;
        console.log('backend / auth / login / Email:', email);

        // Validate input
        if (!email || !password) {
            console.log('backend / auth / login / Validation failed: missing fields');
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        // Find user by email
        console.log('backend / auth / login / Finding user in database');
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('backend / auth / login / User not found');
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        console.log('backend / auth / login / User found:', user.email);

        // Check password
        console.log('backend / auth / login / Comparing password');
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('backend / auth / login / Password mismatch');
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        console.log('backend / auth / login / Password match');

        // Generate token
        const token = generateToken({
            _id: user._id.toString(),
            email: user.email,
            name: user.name
        });

        console.log('backend / auth / login / Success, returning response');
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('backend / auth / login / Error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// GET /api/auth/me - Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / auth / me / Request received');
    console.log('backend / auth / me / User from token:', req.user);
    try {
        const user = await User.findById(req.user?.id).select('-password');

        if (!user) {
            console.log('backend / auth / me / User not found in database');
            res.status(404).json({ message: 'User not found' });
            return;
        }

        console.log('backend / auth / me / User found, returning data');
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('backend / auth / me / Error:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

// POST /api/auth/logout (client-side token removal, server just acknowledges)
router.post('/logout', (_req: Request, res: Response): void => {
    console.log('backend / auth / logout / Request received');
    res.json({ message: 'Logged out successfully' });
});

export default router;
