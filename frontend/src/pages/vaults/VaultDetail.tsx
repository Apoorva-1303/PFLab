// Vault Detail Page Component
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { INITIAL_VAULTS, INITIAL_CREDENTIALS } from '../../mock/mockData';
import type { Vault, Credential } from '../../mock/types';
import './Vaults.css';

const VaultDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [vault, setVault] = useState<Vault | null>(null);
    const [credentials, setCredentials] = useState<Credential[]>([]);

    useEffect(() => {
        // TODO: Replace with API call to fetch vault details from backend
        const foundVault = INITIAL_VAULTS.find(v => v.id === id);
        setVault(foundVault || null);

        // TODO: Replace with API call to fetch credentials for this vault
        const vaultCredentials = INITIAL_CREDENTIALS.filter(c => c.vaultId === id);
        setCredentials(vaultCredentials);
    }, [id]);

    if (!vault) {
        return (
            <div className="vault-detail">
                <div className="empty-state">
                    <h3>Vault not found</h3>
                    <Link to="/vaults" className="btn-primary">Back to Vaults</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="vault-detail">
            <div className="page-header">
                <div>
                    <Link to="/vaults" className="breadcrumb">← Back to Vaults</Link>
                    <h1>{vault.name}</h1>
                    <p>{vault.description}</p>
                </div>
            </div>

            <div className="vault-info-card">
                <div className="info-item">
                    <span className="info-label">Created</span>
                    <span className="info-value">
                        {new Date(vault.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div className="info-item">
                    <span className="info-label">Total Credentials</span>
                    <span className="info-value">{credentials.length}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Vault ID</span>
                    <span className="info-value">{vault.id}</span>
                </div>
            </div>

            <div className="credentials-section">
                <div className="section-header">
                    <h2>Credentials in this Vault</h2>
                    <Link to="/passwords" className="btn-primary">+ Add Credential</Link>
                </div>

                {credentials.length > 0 ? (
                    <div className="credentials-list">
                        {credentials.map((credential) => (
                            <div key={credential.id} className="credential-item">
                                <div className="credential-icon">🔑</div>
                                <div className="credential-info">
                                    <h4>{credential.title}</h4>
                                    <p>{credential.username}</p>
                                    {credential.url && (
                                        <a href={credential.url} target="_blank" rel="noopener noreferrer" className="credential-url">
                                            {credential.url}
                                        </a>
                                    )}
                                </div>
                                <div className="credential-actions">
                                    <Link to="/passwords" className="btn-small">Edit</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state small">
                        <p>No credentials in this vault yet</p>
                        <Link to="/passwords" className="btn-primary">Add First Credential</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VaultDetail;
