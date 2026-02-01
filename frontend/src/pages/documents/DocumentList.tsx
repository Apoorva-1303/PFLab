// Document List Page Component
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_DOCUMENTS, formatFileSize, formatDate } from '../../mock/mockData';
import type { Document } from '../../mock/types';
import './Documents.css';

const DocumentList = () => {
    // TODO: Replace with API call to fetch documents from backend
    const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const handleUpload = () => {
        // TODO: Replace with real file upload logic
        // This is just a placeholder UI - no actual file handling
        setUploadStatus('Uploading...');

        setTimeout(() => {
            const mockDocument: Document = {
                id: Math.random().toString(36).substr(2, 9),
                name: `document-${Date.now()}.pdf`,
                type: 'application/pdf',
                size: Math.floor(Math.random() * 5000000),
                uploadDate: new Date().toISOString(),
            };

            setDocuments([mockDocument, ...documents]);
            setUploadStatus('Upload successful!');

            setTimeout(() => setUploadStatus(''), 2000);
        }, 1500);
    };

    const handleDelete = (id: string) => {
        // TODO: Replace with API call to delete document from backend
        if (confirm('Are you sure you want to delete this document?')) {
            setDocuments(documents.filter(d => d.id !== id));
        }
    };

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return '📄';
        if (type.includes('image')) return '🖼️';
        if (type.includes('video')) return '🎥';
        if (type.includes('audio')) return '🎵';
        return '📁';
    };

    return (
        <div className="documents-page">
            <div className="page-header">
                <div>
                    <h1>Document Storage</h1>
                    <p>Securely store and manage your important files</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleUpload}
                    disabled={uploadStatus === 'Uploading...'}
                >
                    {uploadStatus === 'Uploading...' ? '⏳ Uploading...' : '📤 Upload Document'}
                </button>
            </div>

            {uploadStatus && uploadStatus !== 'Uploading...' && (
                <div className="upload-status success">
                    ✓ {uploadStatus}
                </div>
            )}

            <div className="upload-info">
                <p>
                    <strong>Note:</strong> This is a mock upload. No real file handling is implemented.
                    Click "Upload Document" to simulate adding a document.
                </p>
            </div>

            <div className="documents-grid">
                {documents.map((doc) => (
                    <div key={doc.id} className="document-card">
                        <div className="document-icon">
                            {getFileIcon(doc.type)}
                        </div>
                        <div className="document-info">
                            <h4 className="document-name">{doc.name}</h4>
                            <div className="document-meta">
                                <span className="document-size">{formatFileSize(doc.size)}</span>
                                <span className="document-date">{formatDate(doc.uploadDate)}</span>
                            </div>
                        </div>
                        <div className="document-actions">
                            <Link to={`/documents/${doc.id}`} className="btn-icon" title="View">
                                👁️
                            </Link>
                            <button
                                className="btn-icon"
                                title="Download"
                                onClick={() => alert('Download functionality not implemented (mock)')}
                            >
                                ⬇️
                            </button>
                            <button
                                onClick={() => handleDelete(doc.id)}
                                className="btn-icon delete"
                                title="Delete"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {documents.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📁</div>
                    <h3>No documents yet</h3>
                    <p>Upload your first document to get started</p>
                </div>
            )}
        </div>
    );
};

export default DocumentList;
