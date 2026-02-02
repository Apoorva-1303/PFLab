import { Router } from 'express';
import type { Response } from 'express';
import Vault from '../models/Vault.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/vaults - Get all vaults for current user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / vaults / GET / Fetching vaults for user:', req.user?.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const vaults = await Vault.find({ userId: req.user.id }).sort({ createdAt: -1 });
        console.log('backend / vaults / GET / Found', vaults.length, 'vaults');

        const vaultsWithCount = vaults.map(vault => ({
            id: vault._id,
            name: vault.name,
            description: vault.description,
            color: vault.color,
            createdAt: vault.createdAt,
            credentialCount: 0
        }));

        res.json({ vaults: vaultsWithCount });
    } catch (error) {
        console.error('backend / vaults / GET / Error:', error);
        res.status(500).json({ message: 'Error fetching vaults' });
    }
});

// GET /api/vaults/:id - Get a specific vault
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / vaults / GET/:id / Fetching vault:', req.params.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const vault = await Vault.findOne({ _id: req.params.id, userId: req.user.id });

        if (!vault) {
            console.log('backend / vaults / GET/:id / Vault not found');
            res.status(404).json({ message: 'Vault not found' });
            return;
        }

        console.log('backend / vaults / GET/:id / Found vault:', vault.name);
        res.json({
            vault: {
                id: vault._id,
                name: vault.name,
                description: vault.description,
                color: vault.color,
                createdAt: vault.createdAt,
                credentialCount: 0
            }
        });
    } catch (error) {
        console.error('backend / vaults / GET/:id / Error:', error);
        res.status(500).json({ message: 'Error fetching vault' });
    }
});

// POST /api/vaults - Create a new vault
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / vaults / POST / Creating vault for user:', req.user?.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { name, description, color } = req.body;
        console.log('backend / vaults / POST / Data:', { name, description, color });

        if (!name) {
            res.status(400).json({ message: 'Vault name is required' });
            return;
        }

        const vault = new Vault({
            userId: req.user.id,
            name,
            description: description || '',
            color: color || `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
        });

        await vault.save();
        console.log('backend / vaults / POST / Vault created:', vault._id);

        res.status(201).json({
            message: 'Vault created successfully',
            vault: {
                id: vault._id,
                name: vault.name,
                description: vault.description,
                color: vault.color,
                createdAt: vault.createdAt,
                credentialCount: 0
            }
        });
    } catch (error) {
        console.error('backend / vaults / POST / Error:', error);
        res.status(500).json({ message: 'Error creating vault' });
    }
});

// PUT /api/vaults/:id - Update a vault
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / vaults / PUT / Updating vault:', req.params.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { name, description, color } = req.body;

        const vault = await Vault.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { name, description, color },
            { new: true, runValidators: true }
        );

        if (!vault) {
            res.status(404).json({ message: 'Vault not found' });
            return;
        }

        console.log('backend / vaults / PUT / Vault updated:', vault.name);
        res.json({
            message: 'Vault updated successfully',
            vault: {
                id: vault._id,
                name: vault.name,
                description: vault.description,
                color: vault.color,
                createdAt: vault.createdAt,
                credentialCount: 0
            }
        });
    } catch (error) {
        console.error('backend / vaults / PUT / Error:', error);
        res.status(500).json({ message: 'Error updating vault' });
    }
});

// DELETE /api/vaults/:id - Delete a vault
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / vaults / DELETE / Deleting vault:', req.params.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const vault = await Vault.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!vault) {
            res.status(404).json({ message: 'Vault not found' });
            return;
        }

        console.log('backend / vaults / DELETE / Vault deleted:', vault.name);
        res.json({ message: 'Vault deleted successfully' });
    } catch (error) {
        console.error('backend / vaults / DELETE / Error:', error);
        res.status(500).json({ message: 'Error deleting vault' });
    }
});

export default router;
