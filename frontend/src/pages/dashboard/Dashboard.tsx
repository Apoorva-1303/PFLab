// Dashboard Page Component
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    INITIAL_VAULTS,
    INITIAL_CREDENTIALS,
    INITIAL_DOCUMENTS,
    MOCK_RECENT_ACTIVITY,
    calculateStats,
    formatRelativeTime
} from '../../mock/mockData';
import type { VaultStats } from '../../mock/types';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<VaultStats | null>(null);

    useEffect(() => {
        // TODO: Replace with API call to fetch real statistics
        const calculatedStats = calculateStats(
            INITIAL_VAULTS,
            INITIAL_CREDENTIALS,
            INITIAL_DOCUMENTS
        );
        setStats(calculatedStats);
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Overview of your secure vault</p>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-vaults">
                    <div className="stat-icon">🗄️</div>
                    <div className="stat-content">
                        <h3>Vaults</h3>
                        <p className="stat-number">{stats?.totalVaults || 0}</p>
                    </div>
                </div>

                <div className="stat-card stat-credentials">
                    <div className="stat-icon">🔑</div>
                    <div className="stat-content">
                        <h3>Credentials</h3>
                        <p className="stat-number">{stats?.totalCredentials || 0}</p>
                    </div>
                </div>

                <div className="stat-card stat-documents">
                    <div className="stat-icon">📁</div>
                    <div className="stat-content">
                        <h3>Documents</h3>
                        <p className="stat-number">{stats?.totalDocuments || 0}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <Link to="/vaults" className="action-btn">
                        <span className="action-icon">➕</span>
                        <span>Create Vault</span>
                    </Link>
                    <Link to="/passwords" className="action-btn">
                        <span className="action-icon">🔑</span>
                        <span>Add Password</span>
                    </Link>
                    <Link to="/documents" className="action-btn">
                        <span className="action-icon">📤</span>
                        <span>Upload Document</span>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    {MOCK_RECENT_ACTIVITY.map((activity) => (
                        <div key={activity.id} className="activity-item">
                            <div className="activity-icon">
                                {activity.type === 'vault' && '🗄️'}
                                {activity.type === 'credential' && '🔑'}
                                {activity.type === 'document' && '📁'}
                            </div>
                            <div className="activity-details">
                                <p className="activity-action">{activity.action}</p>
                                <p className="activity-name">{activity.itemName}</p>
                            </div>
                            <div className="activity-time">
                                {formatRelativeTime(activity.timestamp)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
