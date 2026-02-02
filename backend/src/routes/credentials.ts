import { Router } from 'express';
import type { Response } from 'express';
import Credential from '../models/Credential.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/credentials - Get all credentials for current user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / credentials / GET / Fetching all credentials for user:', req.user?.id);
    try {
        if (!req.user?.id) {
            console.log('backend / credentials / GET / Unauthorized - no user ID');
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const credentials = await Credential.find({ userId: req.user.id }).sort({ createdAt: -1 });
        console.log('backend / credentials / GET / Found', credentials.length, 'credentials');

        const credentialsList = credentials.map(cred => ({
            id: cred._id,
            vaultId: cred.vaultId || null,
            title: cred.title,
            username: cred.username,
            password: cred.password,
            url: cred.url,
            notes: cred.notes,
            createdAt: cred.createdAt,
            updatedAt: cred.updatedAt
        }));

        res.json({ credentials: credentialsList });
    } catch (error) {
        console.error('backend / credentials / GET / Error:', error);
        res.status(500).json({ message: 'Error fetching credentials' });
    }
});

// GET /api/credentials/:id - Get a specific credential
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / credentials / GET/:id / Fetching credential:', req.params.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const credId = req.params.id;
        if (!credId) {
            res.status(400).json({ message: 'Credential ID required' });
            return;
        }

        const credential = await Credential.findOne({ _id: credId, userId: req.user.id });

        if (!credential) {
            console.log('backend / credentials / GET/:id / Credential not found');
            res.status(404).json({ message: 'Credential not found' });
            return;
        }

        console.log('backend / credentials / GET/:id / Found credential:', credential.title);
        res.json({
            credential: {
                id: credential._id,
                vaultId: credential.vaultId || null,
                title: credential.title,
                username: credential.username,
                password: credential.password,
                url: credential.url,
                notes: credential.notes,
                createdAt: credential.createdAt,
                updatedAt: credential.updatedAt
            }
        });
    } catch (error) {
        console.error('backend / credentials / GET/:id / Error:', error);
        res.status(500).json({ message: 'Error fetching credential' });
    }
});

// POST /api/credentials - Create a new credential
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / credentials / POST / Creating credential for user:', req.user?.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { title, username, password, url, notes, vaultId } = req.body;
        console.log('backend / credentials / POST / Data:', { title, username, url: url || 'N/A' });

        if (!title || !username || !password) {
            console.log('backend / credentials / POST / Missing required fields');
            res.status(400).json({ message: 'Title, username, and password are required' });
            return;
        }

        const credential = new Credential({
            userId: req.user.id,
            vaultId: vaultId || undefined,  // Optional - can be null
            title,
            username,
            password,  // NOTE: Should be encrypted in production
            url: url || '',
            notes: notes || ''
        });

        await credential.save();
        console.log('backend / credentials / POST / Credential created:', credential._id);

        res.status(201).json({
            message: 'Credential created successfully',
            credential: {
                id: credential._id,
                vaultId: credential.vaultId || null,
                title: credential.title,
                username: credential.username,
                password: credential.password,
                url: credential.url,
                notes: credential.notes,
                createdAt: credential.createdAt,
                updatedAt: credential.updatedAt
            }
        });
    } catch (error) {
        console.error('backend / credentials / POST / Error:', error);
        res.status(500).json({ message: 'Error creating credential' });
    }
});

// PUT /api/credentials/:id - Update a credential
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / credentials / PUT / Updating credential:', req.params.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const credId = req.params.id;
        if (!credId) {
            res.status(400).json({ message: 'Credential ID required' });
            return;
        }

        const { title, username, password, url, notes, vaultId } = req.body;
        console.log('backend / credentials / PUT / Data:', { title, username });

        const updateData: Record<string, unknown> = { title, username, password, url, notes };
        if (vaultId !== undefined) {
            updateData.vaultId = vaultId || null;
        }

        const credential = await Credential.findOneAndUpdate(
            { _id: credId, userId: req.user.id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!credential) {
            console.log('backend / credentials / PUT / Credential not found');
            res.status(404).json({ message: 'Credential not found' });
            return;
        }

        console.log('backend / credentials / PUT / Credential updated:', credential.title);
        res.json({
            message: 'Credential updated successfully',
            credential: {
                id: credential._id,
                vaultId: credential.vaultId || null,
                title: credential.title,
                username: credential.username,
                password: credential.password,
                url: credential.url,
                notes: credential.notes,
                createdAt: credential.createdAt,
                updatedAt: credential.updatedAt
            }
        });
    } catch (error) {
        console.error('backend / credentials / PUT / Error:', error);
        res.status(500).json({ message: 'Error updating credential' });
    }
});

// DELETE /api/credentials/:id - Delete a credential
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / credentials / DELETE / Deleting credential:', req.params.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const credId = req.params.id;
        if (!credId) {
            res.status(400).json({ message: 'Credential ID required' });
            return;
        }

        const credential = await Credential.findOneAndDelete({ _id: credId, userId: req.user.id });

        if (!credential) {
            console.log('backend / credentials / DELETE / Credential not found');
            res.status(404).json({ message: 'Credential not found' });
            return;
        }

        console.log('backend / credentials / DELETE / Credential deleted:', credential.title);
        res.json({ message: 'Credential deleted successfully' });
    } catch (error) {
        console.error('backend / credentials / DELETE / Error:', error);
        res.status(500).json({ message: 'Error deleting credential' });
    }
});

export default router;
