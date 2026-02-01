// Authentication Context
// TODO: Replace with real JWT-based authentication and secure token storage

import { createContext, useState, type ReactNode, useEffect } from 'react';
import type { User } from '../mock/types';
import { MOCK_USER, MOCK_CREDENTIALS } from '../mock/mockData';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        // TODO: Replace with token validation against backend
        const storedUser = localStorage.getItem('mockUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('mockUser');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // TODO: Replace with real API call to backend authentication endpoint
        // Example: const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock authentication - check against hardcoded credentials
        if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
            setUser(MOCK_USER);
            // TODO: Store JWT token instead of user object
            localStorage.setItem('mockUser', JSON.stringify(MOCK_USER));
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        // TODO: Replace with real API call to backend registration endpoint
        // Example: const response = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock registration - just simulate success (no actual persistence)
        console.log('Mock registration:', { name, email, password });

        // Auto-login after registration (in real app, this would happen after email verification)
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            createdAt: new Date().toISOString(),
        };

        setUser(newUser);
        localStorage.setItem('mockUser', JSON.stringify(newUser));
        setIsLoading(false);
        return true;
    };

    const logout = () => {
        // TODO: Invalidate JWT token on backend
        // Example: await fetch('/api/auth/logout', { method: 'POST' });

        setUser(null);
        localStorage.removeItem('mockUser');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
