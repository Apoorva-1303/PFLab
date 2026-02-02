import mongoose, { Document, Schema } from 'mongoose';

export interface ICredential extends Document {
    userId: mongoose.Types.ObjectId;
    vaultId?: mongoose.Types.ObjectId;  // Optional - for organization only
    title: string;
    username: string;
    password: string;  // NOTE: Should be encrypted in production
    url?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CredentialSchema = new Schema<ICredential>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vaultId: {
        type: Schema.Types.ObjectId,
        ref: 'Vault',
        required: false  // Optional - credentials can exist without a vault
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
        // NOTE: In production, this should be encrypted before storage
    },
    url: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Log when saving
CredentialSchema.pre('save', function () {
    console.log('backend / Credential / pre-save / Saving credential:', this.title);
});

export default mongoose.model<ICredential>('Credential', CredentialSchema);
