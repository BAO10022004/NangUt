import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Auth } from './Auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = new Auth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const authenticated = auth.isAuthenticated();
      console.log('ProtectedRoute: Checking authentication', { 
        authenticated, 
        currentPath: location.pathname,
        username: auth.getUsername()
      });
      
      setIsAuthenticated(authenticated);
      setIsChecking(false);
    };

    checkAuth();
  }, [location.pathname]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #001414 0%, #002828 100%)',
        color: '#00ffff',
        fontSize: '18px',
        fontWeight: 600
      }}>
        Đang kiểm tra xác thực...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  console.log('ProtectedRoute: User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;