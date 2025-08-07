import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
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
          {/* Home/Inicio - Siempre visible */}
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
            <i className="fas fa-home" />
            Inicio
          </Link>
          
          {/* Enlaces que requieren autenticación - Solo visibles si hay usuario */}
          {currentUser && (
            <>
              <Link 
                to="/modules" 
                className={isActive('/modules') ? 'active' : ''}
              >
                <i className="fas fa-book" />
                Módulos
              </Link>
              <Link 
                to="/evaluations" 
                className={isActive('/evaluations') ? 'active' : ''}
              >
                <i className="fas fa-clipboard-check" />
                Evaluaciones
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
          )}

          {/* Botón de Login - Solo visible si NO hay usuario */}
          {!currentUser && (
            <button 
              onClick={() => {
                // Aquí deberías abrir el LoginModal en lugar de navegar
                // Necesitamos conectar esto con el MainLayout
                window.dispatchEvent(new CustomEvent('openLoginModal'));
              }}
              className="nav-login-button"
            >
              <i className="fas fa-sign-in-alt" />
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 