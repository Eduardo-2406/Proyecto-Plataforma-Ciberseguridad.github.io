import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import HamburgerIcon from '../common/HamburgerIcon';
import { gsap } from 'gsap';
import '../../styles/Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (onToggle) {
      onToggle(isOpen);
    }
  }, [isOpen, onToggle]);

  const menuItems = [
    {
      path: '/',
      icon: 'fas fa-home',
      label: 'Inicio',
      public: true
    },
    {
      path: '/modules',
      icon: 'fas fa-book',
      label: 'Módulos',
      public: true
    },
    {
      path: '/evaluations',
      icon: 'fas fa-tasks',
      label: 'Evaluaciones',
      public: true
    },
    {
      path: '/forum',
      icon: 'fas fa-comments',
      label: 'Foro',
      public: true
    },
    {
      path: '/certificates',
      icon: 'fas fa-certificate',
      label: 'Certificados',
      public: false
    },
    {
      path: '/progress',
      icon: 'fas fa-chart-line',
      label: 'Progreso',
      public: false
    },
    {
      path: '/admin/create-user',
      icon: 'fas fa-user-plus',
      label: 'Crear Usuario',
      public: false,
      adminOnly: true
    }
  ];

  const visibleMenuItems = menuItems.filter(item => (item.public || currentUser) && (!item.adminOnly || isAdmin));
  const activeItemIndex = visibleMenuItems.findIndex(item => item.path === location.pathname);

  const handleNavigation = (path) => {
    const content = document.querySelector('.page-content');
    if (content) {
      gsap.to(content, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          navigate(path);
          gsap.to(content, {
            opacity: 1,
            duration: 0.2
          });
        }
      });
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <StyledSidebar $isOpen={isOpen}>
      <div className="sidebar-header">
        <HamburgerIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        {isOpen && <h2>Menú</h2>}
      </div>
      
      <nav className="sidebar-nav">
        {visibleMenuItems.map((item) => (
          <motion.button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={item.icon} />
            {isOpen && <span className="label">{item.label}</span>}
          </motion.button>
        ))}
      </nav>

      {currentUser && (
        <div className="sidebar-footer">
          <motion.button
            className="logout-button"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-sign-out-alt" />
            {isOpen && <span className="label">Cerrar Sesión</span>}
          </motion.button>
        </div>
      )}
    </StyledSidebar>
  );
};

const StyledSidebar = styled.aside`
  background: linear-gradient(180deg, rgb(98, 191, 233) 0%, rgb(98, 191, 233) 100%);
  color: white;
  height: calc(100vh - 64px);
  width: ${props => props.$isOpen ? '250px' : '80px'};
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 64px;
  left: 0;
  z-index: 100;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;

  .sidebar-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: ${props => props.$isOpen ? 'flex-start' : 'center'};
    gap: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    h2 {
      margin: 0;
      font-size: 1.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;

    .nav-item {
      background: none;
      border: none;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: ${props => props.$isOpen ? 'flex-start' : 'center'};
      gap: 1rem;
      transition: background-color 0.2s;
      width: 100%;
      text-align: left;
      position: relative;
      z-index: 2;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      &.active {
        color: white;
      }

      i {
        font-size: 1.2rem;
        width: 1.5rem;
        text-align: center;
      }

      .label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .logout-button {
      background: none;
      border: none;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: ${props => props.$isOpen ? 'flex-start' : 'center'};
      gap: 1rem;
      transition: background-color 0.2s;
      width: 100%;
      text-align: left;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      i {
        font-size: 1.2rem;
        width: 1.5rem;
        text-align: center;
      }

      .label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

export default Sidebar; 