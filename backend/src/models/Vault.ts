import mongoose, { Document, Schema } from 'mongoose';

export interface IVault extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    color: string;
    createdAt: Date;
}

const vaultSchema = new Schema<IVault>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    name: {
        type: String,
        required: [true, 'Vault name is required'],
        trim: true,
        minlength: [1, 'Vault name cannot be empty'],
        maxlength: [100, 'Vault name cannot exceed 100 characters']
    },
    description: {
        type: String,
        default: '',
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    color: {
        type: String,
        default: '#4F46E5'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries by userId
vaultSchema.index({ userId: 1 });

const Vault = mongoose.model<IVault>('Vault', vaultSchema);

export default Vault;
