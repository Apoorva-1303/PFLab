// Header Component
import { useAuth } from '../../hooks/useAuth';
import './Layout.css';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-content">
                <h2 className="page-title">Welcome back, {user?.name || 'User'}!</h2>

                <div className="header-actions">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-email">{user?.email}</span>
                        </div>
                    </div>

                    <button onClick={logout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
