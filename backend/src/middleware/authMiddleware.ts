import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

interface JwtPayloadCustom {
    id: string;
    email: string;
    name: string;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    console.log('backend / authMiddleware / Checking authorization');
    try {
        const authHeader = req.headers.authorization;
        console.log('backend / authMiddleware / Auth header:', authHeader ? 'Present' : 'Missing');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('backend / authMiddleware / No valid token format');
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        console.log('backend / authMiddleware / Token extracted, verifying...');
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.log('backend / authMiddleware / JWT_SECRET not configured');
            res.status(500).json({ message: 'Server configuration error' });
            return;
        }

        const decoded = jwt.verify(token, jwtSecret) as unknown as JwtPayloadCustom;
        console.log('backend / authMiddleware / Token verified, user:', decoded.email);

        // Verify user still exists
        console.log('backend / authMiddleware / Checking user exists in database');
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            console.log('backend / authMiddleware / User no longer exists');
            res.status(401).json({ message: 'User no longer exists' });
            return;
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name
        };
        console.log('backend / authMiddleware / Auth successful, proceeding');

        next();
    } catch {
        console.log('backend / authMiddleware / Token verification failed');
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
