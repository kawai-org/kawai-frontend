import { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Parse JWT token
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    };

    // Check if token is expired - using useCallback to prevent re-renders
    const isTokenExpired = useCallback((token) => {
        const payload = parseJwt(token);
        if (!payload) return true;
        if (!payload.exp) return false; // Token without exp is considered valid
        return payload.exp * 1000 < Date.now();
    }, []);

    // Clear auth state (helper function)
    const clearAuth = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    // Load user from localStorage on mount
    const loadUser = useCallback(() => {
        try {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (userStr && token) {
                const parsedUser = JSON.parse(userStr);

                // Validate token not expired
                if (!isTokenExpired(token) && parsedUser && parsedUser.phone_number) {
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                } else {
                    // Token expired, clear storage
                    clearAuth();
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Auth load error:', error);
            clearAuth();
        } finally {
            setIsLoading(false);
        }
    }, [clearAuth, isTokenExpired]);

    // Initial load
    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Listen for storage changes (for multi-tab support)
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'user' || event.key === 'token') {
                loadUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadUser]);

    // Login function
    const login = useCallback((userData, token) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error:', error);
        }
    }, []);

    // Logout function
    const logout = useCallback(() => {
        clearAuth();
    }, [clearAuth]);

    // Update user data
    const updateUser = useCallback((updates) => {
        try {
            const updatedUser = { ...user, ...updates };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error) {
            console.error('Update user error:', error);
        }
    }, [user]);

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
