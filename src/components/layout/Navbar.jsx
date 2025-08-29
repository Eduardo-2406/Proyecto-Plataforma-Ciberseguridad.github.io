import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from '../../config/firebase';
import { ref, onValue } from 'firebase/database';
import { 
  FaUserAstronaut, FaUserNinja, FaUserSecret, FaUserTie,
  FaUserGraduate, FaUserShield, FaUserCog, FaUserAlt,
  FaUserCircle, FaUserCheck
} from 'react-icons/fa';
// Usar Statically CDN para el logo
const logo = 'https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/src/assets/images/Logo.png?format=webp&w=200';
import HamburgerIcon from '../common/HamburgerIcon';

const AVATAR_OPTIONS = [
  { id: 'astronaut', icon: FaUserAstronaut, name: 'Astronauta' },
  { id: 'ninja', icon: FaUserNinja, name: 'Ninja' },
  { id: 'secret', icon: FaUserSecret, name: 'Agente Secreto' },
  { id: 'tie', icon: FaUserTie, name: 'Ejecutivo' },
  { id: 'graduate', icon: FaUserGraduate, name: 'Graduado' },
  { id: 'shield', icon: FaUserShield, name: 'Guardián' },
  { id: 'cog', icon: FaUserCog, name: 'Ingeniero' },
  { id: 'alt', icon: FaUserAlt, name: 'Alternativo' },
  { id: 'circle', icon: FaUserCircle, name: 'Círculo' },
  { id: 'check', icon: FaUserCheck, name: 'Verificado' }
];

const Navbar = ({ onOpenLoginModal, onToggleSidebar, isSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [AvatarComponent, setAvatarComponent] = useState(() => FaUserCircle);
  const [userDisplayName, setUserDisplayName] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadUserData = async () => {
      if (currentUser) {
        setIsLoading(true);
        const userRef = ref(database, `users/${currentUser.uid}`);
        
        const unsubscribe = onValue(userRef, (snapshot) => {
          if (!mounted) return;
          
          const data = snapshot.val();
          if (data) {
            setUserData(data);
            const avatarId = data.avatarId || 'circle';
            setAvatarComponent(() => getAvatarIcon(avatarId));
            setUserDisplayName(data.displayName || currentUser.displayName || '');
          }
          setIsLoading(false);
        });

        return unsubscribe;
      } else {
        setIsLoading(false);
        setUserData(null);
        setAvatarComponent(() => FaUserCircle);
        setUserDisplayName('');
      }
    };

    loadUserData();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      // Navegar a home tras logout
      if (typeof window !== 'undefined' && window.location) {
        window.location.hash = '#/';
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleHamburgerClick = () => {
    if (window.innerWidth <= 1023 && onToggleSidebar) {
      onToggleSidebar();
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const getAvatarIcon = (avatarId) => {
    const avatar = AVATAR_OPTIONS.find(opt => opt.id === avatarId);
    return avatar ? avatar.icon : FaUserCircle;
  };

  return (
    <StyledNavbar>
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <span className="navbar-title">Plataforma de Ciberseguridad</span>
        </Link>
      </div>
      <div className="navbar-right">
        {/* Intercambiado: primero el perfil, luego el menú hamburguesa */}
        {currentUser ? (
          <Link to="/profile" className="profile-link">
            <div className="avatar-container">
              <AvatarComponent className="avatar-icon" />
            </div>
            <span>{userDisplayName}</span>
          </Link>
        ) : (
          <button onClick={onOpenLoginModal} className="login-link">
            <i className="fas fa-user" />
            <span>Iniciar sesión</span>
          </button>
        )}
        <div className="navbar-hamburger">
          <HamburgerIcon isOpen={isSidebarOpen} onClick={onToggleSidebar} />
        </div>
      </div>

      {/* Elimina el menú móvil propio, solo sidebar drawer */}
    </StyledNavbar>
  );
};

const StyledNavbar = styled.nav`
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 4rem;

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 1rem;

    a {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      color: #333;
    }

    img {
      height: 2.5rem;
      width: auto;
    }

    span {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .navbar-hamburger {
    display: none;
    cursor: pointer;
    z-index: 1001;
  }

  /* Mostrar hamburguesa solo en tablet/móvil */
  @media (max-width: 1023px) {
    .navbar-hamburger {
      display: block !important;
    }
  }

  /* Ocultar hamburguesa en desktop/laptop */
  @media (min-width: 1024px) {
    .navbar-hamburger {
      display: none !important;
    }
  }

  .profile-link, .login-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #333;
    text-decoration: none;
    font-size: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;

    .avatar-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: #f0f2f5;
      overflow: hidden;
    }

    .avatar-icon {
      font-size: 1.25rem;
      color: #95b9e6;
      width: 1.25rem;
      height: 1.25rem;
    }

    &:hover {
      color: #2563eb;
      background: #f0f2f5;
    }
  }

  /* Tablet */
  @media (max-width: 1024px) {
    .navbar-brand span {
      font-size: 1.1rem;
    }
  }

  /* Móvil */
  @media (max-width: 768px) {
    padding: 1rem;

    .navbar-brand span {
      font-size: 1rem;
    }

    .navbar-hamburger {
      display: block;
    }

    .profile-link span, .login-link span {
      display: none;
    }

    .profile-link {
      padding: 0.25rem;
    }

    .avatar-container {
      width: 1.75rem !important;
      height: 1.75rem !important;
    }

    .avatar-icon {
      font-size: 1rem !important;
      width: 1rem !important;
      height: 1rem !important;
    }
  }

  @media (max-width: 600px) {
    .navbar-title {
      display: none !important;
    }
  }
`;
 
export default Navbar;