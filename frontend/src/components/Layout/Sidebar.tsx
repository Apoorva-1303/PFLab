// Sidebar Navigation Component
import { NavLink } from 'react-router-dom';
import './Layout.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h1>🔐 SecureVault</h1>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <span className="nav-icon">📊</span>
                    <span className="nav-text">Dashboard</span>
                </NavLink>

                <NavLink
                    to="/vaults"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <span className="nav-icon">🗄️</span>
                    <span className="nav-text">Vaults</span>
                </NavLink>

                <NavLink
                    to="/passwords"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <span className="nav-icon">🔑</span>
                    <span className="nav-text">Passwords</span>
                </NavLink>

                <NavLink
                    to="/documents"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <span className="nav-icon">📁</span>
                    <span className="nav-text">Documents</span>
                </NavLink>

                <NavLink
                    to="/settings/profile"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <span className="nav-icon">⚙️</span>
                    <span className="nav-text">Settings</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
