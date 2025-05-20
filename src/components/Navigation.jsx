import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/Navigation.css';

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo">
          <i className="fas fa-shield-alt" />
          <span>Plataforma Ciberseguridad</span>
        </Link>

        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
        >
          <i className={`fas fa-${showMobileMenu ? 'times' : 'bars'}`} />
        </button>

        <div className={`nav-links ${showMobileMenu ? 'show' : ''}`}>
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
            <i className="fas fa-home" />
            Inicio
          </Link>
          <Link 
            to="/modules" 
            className={isActive('/modules') ? 'active' : ''}
          >
            <i className="fas fa-book" />
            Módulos
          </Link>
          <Link 
            to="/progress" 
            className={isActive('/progress') ? 'active' : ''}
          >
            <i className="fas fa-chart-line" />
            Progreso
          </Link>
          <Link 
            to="/certificates" 
            className={isActive('/certificates') ? 'active' : ''}
          >
            <i className="fas fa-certificate" />
            Certificados
          </Link>

          {user ? (
            <>
              <Link 
                to="/profile" 
                className={isActive('/profile') ? 'active' : ''}
              >
                <i className="fas fa-user" />
                Perfil
              </Link>
              <button 
                className="logout-button"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className={isActive('/login') ? 'active' : ''}
            >
              <i className="fas fa-sign-in-alt" />
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 