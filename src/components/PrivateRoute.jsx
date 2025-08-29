import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Evitar side-effects durante render: usar un componente que dispare el evento en useEffect
    const OpenLoginModal = () => {
      React.useEffect(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('openLoginModal'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return <Navigate to="/" state={{ from: location }} replace />;
    };

    return <OpenLoginModal />;
  }

  if (requireAdmin && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;