import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/common/LoadingScreen';

/**
 * ProtectedRoute Component
 * 
 * Wraps protected routes to ensure only authenticated users can access them.
 * Shows loading screen while checking auth status.
 * Redirects to /auth if not authenticated.
 */
export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading screen while checking authentication
    if (isLoading) {
        return <LoadingScreen />;
    }

    // Redirect to home page if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Render children if authenticated
    return children;
}
