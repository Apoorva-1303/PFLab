import { Router } from 'express';
import type { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Document from '../models/Document.js';
import Vault from '../models/Vault.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    console.log('backend / documents / init / Creating uploads directory:', uploadsDir);
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('backend / documents / multer / Setting destination:', uploadsDir);
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename: timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        console.log('backend / documents / multer / Generated filename:', filename);
        cb(null, filename);
    }
});

// File filter - allow images and PDFs
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    console.log('backend / documents / multer / Checking file type:', file.mimetype);

    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'application/pdf'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        console.log('backend / documents / multer / File type allowed:', file.mimetype);
        cb(null, true);
    } else {
        console.log('backend / documents / multer / File type rejected:', file.mimetype);
        cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// All routes require authentication
router.use(authMiddleware);

// GET /api/documents - Get all documents for current user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / documents / GET / Fetching all documents for user:', req.user?.id);
    try {
        if (!req.user?.id) {
            console.log('backend / documents / GET / Unauthorized - no user ID');
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const documents = await Document.find({ userId: req.user.id })
            .populate('vaultId', 'name color')
            .sort({ uploadDate: -1 });
        console.log('backend / documents / GET / Found', documents.length, 'documents');

        const documentsList = documents.map(doc => ({
            id: doc._id,
            vaultId: doc.vaultId,
            name: doc.name,
            originalName: doc.originalName,
            type: doc.mimeType,
            size: doc.size,
            uploadDate: doc.uploadDate
        }));

        res.json({ documents: documentsList });
    } catch (error) {
        console.error('backend / documents / GET / Error:', error);
        res.status(500).json({ message: 'Error fetching documents' });
    }
});

// GET /api/documents/vault/:vaultId - Get documents for a specific vault
router.get('/vault/:vaultId', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / documents / GET/vault / Fetching documents for vault:', req.params.vaultId);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const vaultId = req.params.vaultId;
        if (!vaultId) {
            res.status(400).json({ message: 'Vault ID required' });
            return;
        }

        // Verify the vault belongs to the user
        const vault = await Vault.findOne({ _id: vaultId, userId: req.user.id });
        if (!vault) {
            console.log('backend / documents / GET/vault / Vault not found');
            res.status(404).json({ message: 'Vault not found' });
            return;
        }

        const documents = await Document.find({ userId: req.user.id, vaultId: vaultId })
            .sort({ uploadDate: -1 });
        console.log('backend / documents / GET/vault / Found', documents.length, 'documents');

        const documentsList = documents.map(doc => ({
            id: doc._id,
            vaultId: doc.vaultId,
            name: doc.name,
            originalName: doc.originalName,
            type: doc.mimeType,
            size: doc.size,
            uploadDate: doc.uploadDate
        }));

        res.json({ documents: documentsList });
    } catch (error) {
        console.error('backend / documents / GET/vault / Error:', error);
        res.status(500).json({ message: 'Error fetching documents' });
    }
});

// GET /api/documents/:id - Get a specific document metadata
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / documents / GET/:id / Fetching document:', req.params.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const docId = req.params.id;
        if (!docId) {
            res.status(400).json({ message: 'Document ID required' });
            return;
        }

        const document = await Document.findOne({ _id: docId, userId: req.user.id })
            .populate('vaultId', 'name color');

        if (!document) {
            console.log('backend / documents / GET/:id / Document not found');
            res.status(404).json({ message: 'Document not found' });
            return;
        }

        console.log('backend / documents / GET/:id / Found document:', document.name);
        res.json({
            document: {
                id: document._id,
                vaultId: document.vaultId,
                name: document.name,
                originalName: document.originalName,
                type: document.mimeType,
                size: document.size,
                uploadDate: document.uploadDate
            }
        });
    } catch (error) {
        console.error('backend / documents / GET/:id / Error:', error);
        res.status(500).json({ message: 'Error fetching document' });
    }
});

// GET /api/documents/:id/download - Download a document
router.get('/:id/download', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / documents / GET/:id/download / Downloading document:', req.params.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const docId = req.params.id;
        if (!docId) {
            res.status(400).json({ message: 'Document ID required' });
            return;
        }

        const document = await Document.findOne({ _id: docId, userId: req.user.id });

        if (!document) {
            console.log('backend / documents / GET/:id/download / Document not found');
            res.status(404).json({ message: 'Document not found' });
            return;
        }

        const filePath = document.filePath;

        if (!fs.existsSync(filePath)) {
            console.log('backend / documents / GET/:id/download / File not found on disk:', filePath);
            res.status(404).json({ message: 'File not found on server' });
            return;
        }

        console.log('backend / documents / GET/:id/download / Sending file:', document.originalName);

        // Use res.download for proper file download with original filename
        res.download(filePath, document.originalName, (err) => {
            if (err) {
                console.error('backend / documents / GET/:id/download / Download error:', err);
            }
        });
    } catch (error) {
        console.error('backend / documents / GET/:id/download / Error:', error);
        res.status(500).json({ message: 'Error downloading document' });
    }
});

// GET /api/documents/:id/preview - Preview a document (inline view)
router.get('/:id/preview', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / documents / GET/:id/preview / Previewing document:', req.params.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const docId = req.params.id;
        if (!docId) {
            res.status(400).json({ message: 'Document ID required' });
            return;
        }

        const document = await Document.findOne({ _id: docId, userId: req.user.id });

        if (!document) {
            console.log('backend / documents / GET/:id/preview / Document not found');
            res.status(404).json({ message: 'Document not found' });
            return;
        }

        const filePath = document.filePath;

        if (!fs.existsSync(filePath)) {
            console.log('backend / documents / GET/:id/preview / File not found on disk:', filePath);
            res.status(404).json({ message: 'File not found on server' });
            return;
        }

        console.log('backend / documents / GET/:id/preview / Sending file for preview:', filePath);

        // Set content type for proper rendering in browser
        res.setHeader('Content-Type', document.mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('backend / documents / GET/:id/preview / Error:', error);
        res.status(500).json({ message: 'Error previewing document' });
    }
});

// POST /api/documents - Upload a new document
router.post('/', upload.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / documents / POST / Uploading document for user:', req.user?.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!req.file) {
            console.log('backend / documents / POST / No file provided');
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const vaultId = req.body.vaultId;
        if (!vaultId) {
            console.log('backend / documents / POST / No vault specified');
            // Clean up uploaded file
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(400).json({ message: 'Please select a vault to organize your document' });
            return;
        }

        // Verify vault belongs to user
        const vault = await Vault.findOne({ _id: vaultId, userId: req.user.id });
        if (!vault) {
            console.log('backend / documents / POST / Vault not found or not owned by user');
            // Clean up uploaded file
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(404).json({ message: 'Vault not found' });
            return;
        }

        console.log('backend / documents / POST / File received:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            vaultId: vaultId
        });

        const document = new Document({
            userId: req.user.id,
            vaultId: vaultId,
            name: req.body.name || req.file.originalname,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            filePath: req.file.path
        });

        await document.save();
        console.log('backend / documents / POST / Document saved:', document._id);

        res.status(201).json({
            message: 'Document uploaded successfully',
            document: {
                id: document._id,
                vaultId: document.vaultId,
                name: document.name,
                originalName: document.originalName,
                type: document.mimeType,
                size: document.size,
                uploadDate: document.uploadDate
            }
        });
    } catch (error) {
        console.error('backend / documents / POST / Error:', error);
        res.status(500).json({ message: 'Error uploading document' });
    }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('backend / documents / DELETE / Deleting document:', req.params.id);
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const docId = req.params.id;
        if (!docId) {
            res.status(400).json({ message: 'Document ID required' });
            return;
        }

        const document = await Document.findOneAndDelete({ _id: docId, userId: req.user.id });

        if (!document) {
            console.log('backend / documents / DELETE / Document not found');
            res.status(404).json({ message: 'Document not found' });
            return;
        }

        // Delete the actual file
        if (fs.existsSync(document.filePath)) {
            console.log('backend / documents / DELETE / Deleting file:', document.filePath);
            fs.unlinkSync(document.filePath);
        }

        console.log('backend / documents / DELETE / Document deleted:', document.name);
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('backend / documents / DELETE / Error:', error);
        res.status(500).json({ message: 'Error deleting document' });
    }
});

export default router;
