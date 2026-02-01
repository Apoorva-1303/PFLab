// Password List Page Component
import { useState } from 'react';
import { INITIAL_CREDENTIALS, INITIAL_VAULTS } from '../../mock/mockData';
import type { Credential } from '../../mock/types';
import './Passwords.css';

const PasswordList = () => {
    // TODO: Replace with API call to fetch credentials from backend
    const [credentials, setCredentials] = useState<Credential[]>(INITIAL_CREDENTIALS);
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        vaultId: '',
        title: '',
        username: '',
        password: '',
        url: '',
        notes: '',
    });

    const handleTogglePassword = (id: string) => {
        setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDelete = (id: string) => {
        // TODO: Replace with API call to delete credential from backend
        if (confirm('Are you sure you want to delete this credential?')) {
            setCredentials(credentials.filter(c => c.id !== id));
        }
    };

    const handleEdit = (credential: Credential) => {
        setEditingId(credential.id);
        setFormData({
            vaultId: credential.vaultId,
            title: credential.title,
            username: credential.username,
            password: credential.password,
            url: credential.url || '',
            notes: credential.notes || '',
        });
        setShowAddForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            // TODO: Replace with API call to update credential on backend
            setCredentials(credentials.map(c =>
                c.id === editingId
                    ? { ...c, ...formData, updatedAt: new Date().toISOString() }
                    : c
            ));
            setEditingId(null);
        } else {
            // TODO: Replace with API call to create credential on backend
            // NOTE: Password should be encrypted before sending to backend
            const newCredential: Credential = {
                id: Math.random().toString(36).substr(2, 9),
                ...formData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setCredentials([...credentials, newCredential]);
        }

        setFormData({
            vaultId: '',
            title: '',
            username: '',
            password: '',
            url: '',
            notes: '',
        });
        setShowAddForm(false);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingId(null);
        setFormData({
            vaultId: '',
            title: '',
            username: '',
            password: '',
            url: '',
            notes: '',
        });
    };

    const getVaultName = (vaultId: string) => {
        const vault = INITIAL_VAULTS.find(v => v.id === vaultId);
        return vault?.name || 'Unknown Vault';
    };

    return (
        <div className="passwords-page">
            <div className="page-header">
                <div>
                    <h1>Password Vault</h1>
                    <p>Manage your credentials securely</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? 'Cancel' : '+ Add Credential'}
                </button>
            </div>

            {showAddForm && (
                <div className="credential-form">
                    <h3>{editingId ? 'Edit Credential' : 'Add New Credential'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="title">Title *</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Gmail, Facebook"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="vaultId">Vault *</label>
                                <select
                                    id="vaultId"
                                    value={formData.vaultId}
                                    onChange={(e) => setFormData({ ...formData, vaultId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a vault</option>
                                    {INITIAL_VAULTS.map(vault => (
                                        <option key={vault.id} value={vault.id}>{vault.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="username">Username *</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="username@example.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password *</label>
                                <input
                                    id="password"
                                    type="text"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="url">URL</label>
                            <input
                                id="url"
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Notes</label>
                            <textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Additional notes..."
                                rows={3}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update' : 'Add'} Credential
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-secondary">
                                Cancel
                            </button>
                        </div>

                        <p className="helper-text">
                            TODO: Passwords should be encrypted before storage in production
                        </p>
                    </form>
                </div>
            )}

            <div className="credentials-table">
                {credentials.map((credential) => (
                    <div key={credential.id} className="credential-row">
                        <div className="credential-main">
                            <div className="credential-icon">🔑</div>
                            <div className="credential-details">
                                <h4>{credential.title}</h4>
                                <p className="credential-username">{credential.username}</p>
                                <span className="credential-vault">{getVaultName(credential.vaultId)}</span>
                            </div>
                        </div>

                        <div className="credential-password">
                            <span className="password-value">
                                {showPassword[credential.id] ? credential.password : '••••••••'}
                            </span>
                            <button
                                onClick={() => handleTogglePassword(credential.id)}
                                className="btn-icon"
                                title={showPassword[credential.id] ? 'Hide' : 'Show'}
                            >
                                {showPassword[credential.id] ? '🙈' : '👁️'}
                            </button>
                        </div>

                        <div className="credential-row-actions">
                            {credential.url && (
                                <a
                                    href={credential.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-icon"
                                    title="Open URL"
                                >
                                    🔗
                                </a>
                            )}
                            <button
                                onClick={() => handleEdit(credential)}
                                className="btn-icon"
                                title="Edit"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => handleDelete(credential.id)}
                                className="btn-icon delete"
                                title="Delete"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {credentials.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🔑</div>
                    <h3>No credentials yet</h3>
                    <p>Add your first credential to get started</p>
                </div>
            )}
        </div>
    );
};

export default PasswordList;
