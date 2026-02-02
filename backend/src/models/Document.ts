import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
    userId: mongoose.Types.ObjectId;
    vaultId: mongoose.Types.ObjectId;  // Required - documents must be in a vault
    name: string;              // Display name
    originalName: string;      // Original filename
    mimeType: string;          // File type (image/jpeg, application/pdf, etc.)
    size: number;              // File size in bytes
    filePath: string;          // Path to stored file
    uploadDate: Date;
}

const DocumentSchema = new Schema<IDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vaultId: {
        type: Schema.Types.ObjectId,
        ref: 'Vault',
        required: true  // Documents must belong to a vault for organization
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    originalName: {
        type: String,
        required: true,
        trim: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

// Log when saving
DocumentSchema.pre('save', function () {
    console.log('backend / Document / pre-save / Saving document:', this.name, 'to vault:', this.vaultId);
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
