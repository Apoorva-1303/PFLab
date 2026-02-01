// Document Detail Page Component
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { INITIAL_DOCUMENTS, formatFileSize, formatDate } from '../../mock/mockData';
import type { Document } from '../../mock/types';
import './Documents.css';

const DocumentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [document, setDocument] = useState<Document | null>(null);

    useEffect(() => {
        // TODO: Replace with API call to fetch document details from backend
        const foundDoc = INITIAL_DOCUMENTS.find(d => d.id === id);
        setDocument(foundDoc || null);
    }, [id]);

    const handleDelete = () => {
        // TODO: Replace with API call to delete document from backend
        if (confirm('Are you sure you want to delete this document?')) {
            navigate('/documents');
        }
    };

    const handleDownload = () => {
        // TODO: Implement real download logic
        alert('Download functionality not implemented (mock)');
    };

    if (!document) {
        return (
            <div className="document-detail-page">
                <div className="empty-state">
                    <h3>Document not found</h3>
                    <Link to="/documents" className="btn-primary">Back to Documents</Link>
                </div>
            </div>
        );
    }

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return '📄';
        if (type.includes('image')) return '🖼️';
        if (type.includes('video')) return '🎥';
        if (type.includes('audio')) return '🎵';
        return '📁';
    };

    return (
        <div className="document-detail-page">
            <div className="page-header">
                <div>
                    <Link to="/documents" className="breadcrumb">← Back to Documents</Link>
                    <h1>{document.name}</h1>
                </div>
                <div className="header-actions-group">
                    <button onClick={handleDownload} className="btn-primary">
                        ⬇️ Download
                    </button>
                    <button onClick={handleDelete} className="btn-delete-large">
                        🗑️ Delete
                    </button>
                </div>
            </div>

            <div className="document-detail-card">
                <div className="document-preview">
                    <div className="preview-placeholder">
                        <div className="preview-icon">{getFileIcon(document.type)}</div>
                        <p className="preview-text">Preview not available</p>
                        <p className="preview-subtext">
                            TODO: Implement real document preview/viewer
                        </p>
                    </div>
                </div>

                <div className="document-metadata">
                    <h3>Document Information</h3>

                    <div className="metadata-grid">
                        <div className="metadata-item">
                            <span className="metadata-label">File Name</span>
                            <span className="metadata-value">{document.name}</span>
                        </div>

                        <div className="metadata-item">
                            <span className="metadata-label">File Type</span>
                            <span className="metadata-value">{document.type}</span>
                        </div>

                        <div className="metadata-item">
                            <span className="metadata-label">File Size</span>
                            <span className="metadata-value">{formatFileSize(document.size)}</span>
                        </div>

                        <div className="metadata-item">
                            <span className="metadata-label">Upload Date</span>
                            <span className="metadata-value">{formatDate(document.uploadDate)}</span>
                        </div>

                        <div className="metadata-item">
                            <span className="metadata-label">Document ID</span>
                            <span className="metadata-value">{document.id}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail;
