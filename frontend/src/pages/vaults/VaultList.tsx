// Vault List Page Component
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_VAULTS } from '../../mock/mockData';
import type { Vault } from '../../mock/types';
import './Vaults.css';

const VaultList = () => {
    // TODO: Replace with API call to fetch vaults from backend
    const [vaults, setVaults] = useState<Vault[]>(INITIAL_VAULTS);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newVaultName, setNewVaultName] = useState('');
    const [newVaultDescription, setNewVaultDescription] = useState('');

    const handleCreateVault = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Replace with API call to create vault on backend
        const newVault: Vault = {
            id: Math.random().toString(36).substr(2, 9),
            name: newVaultName,
            description: newVaultDescription,
            createdAt: new Date().toISOString(),
            credentialCount: 0,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        };

        setVaults([...vaults, newVault]);
        setNewVaultName('');
        setNewVaultDescription('');
        setShowCreateForm(false);
    };

    const handleDeleteVault = (id: string) => {
        // TODO: Replace with API call to delete vault from backend
        if (confirm('Are you sure you want to delete this vault?')) {
            setVaults(vaults.filter(v => v.id !== id));
        }
    };

    return (
        <div className="vaults-page">
            <div className="page-header">
                <div>
                    <h1>Vaults</h1>
                    <p>Organize your credentials in secure vaults</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Cancel' : '+ Create Vault'}
                </button>
            </div>

            {showCreateForm && (
                <div className="create-vault-form">
                    <h3>Create New Vault</h3>
                    <form onSubmit={handleCreateVault}>
                        <div className="form-group">
                            <label htmlFor="vaultName">Vault Name</label>
                            <input
                                id="vaultName"
                                type="text"
                                value={newVaultName}
                                onChange={(e) => setNewVaultName(e.target.value)}
                                placeholder="e.g., Personal, Work, Finance"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="vaultDescription">Description</label>
                            <textarea
                                id="vaultDescription"
                                value={newVaultDescription}
                                onChange={(e) => setNewVaultDescription(e.target.value)}
                                placeholder="Brief description of what this vault contains"
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="btn-primary">Create Vault</button>
                    </form>
                </div>
            )}

            <div className="vaults-grid">
                {vaults.map((vault) => (
                    <div key={vault.id} className="vault-card">
                        <div
                            className="vault-header"
                            style={{ backgroundColor: vault.color }}
                        >
                            <h3>{vault.name}</h3>
                        </div>
                        <div className="vault-body">
                            <p className="vault-description">{vault.description}</p>
                            <div className="vault-stats">
                                <span className="vault-stat">
                                    🔑 {vault.credentialCount} credentials
                                </span>
                                <span className="vault-stat">
                                    📅 {new Date(vault.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="vault-actions">
                            <Link to={`/vaults/${vault.id}`} className="btn-view">
                                View Details
                            </Link>
                            <button
                                onClick={() => handleDeleteVault(vault.id)}
                                className="btn-delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {vaults.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🗄️</div>
                    <h3>No vaults yet</h3>
                    <p>Create your first vault to start organizing your credentials</p>
                </div>
            )}
        </div>
    );
};

export default VaultList;
