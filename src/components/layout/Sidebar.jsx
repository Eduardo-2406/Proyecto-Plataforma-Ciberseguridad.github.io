import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import HamburgerIcon from '../common/HamburgerIcon';
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
    },
    {
      path: '/resources',
      icon: 'fas fa-lightbulb',
      label: 'Recursos',
      public: true
    }
  ];

  const visibleMenuItems = menuItems.filter(item => (item.public || currentUser) && (!item.adminOnly || isAdmin));
  const activeItemIndex = visibleMenuItems.findIndex(item => item.path === location.pathname);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <StyledSidebar className={isOpen ? '' : 'sidebar-closed'} $isOpen={isOpen}>
      {/* HEADER igual que menú central, ícono siempre a la izquierda, label animada */}
      <button
        className="sidebar-item"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 56,
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          justifyContent: 'flex-start',
          boxSizing: 'border-box',
          transition: 'none',
          padding: '0.75rem 1.5rem',
        }}
        type="button"
      >
        <span style={{
          width: 20,
          minWidth: 20,
          maxWidth: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 56,
          flexShrink: 0,
        }}>
          <HamburgerIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </span>
        <span className="label" style={{
          marginLeft: 14,
          fontWeight: 500,
          fontSize: '1rem',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          height: 56,
        }}>Menú</span>
      </button>

      <nav className="sidebar-nav">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              className={`nav-item${isActive ? ' active' : ''}`}
              onClick={() => handleNavigation(item.path)}
              layout="position"
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 56,
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                justifyContent: 'flex-start',
                boxSizing: 'border-box',
                padding: 0,
              }}
              initial={false}
              animate={isActive ? { backgroundColor: 'rgba(255,255,255,0.15)' } : { backgroundColor: 'transparent' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="active-indicator"
                  style={{
                    position: 'absolute',
                    left: isOpen ? 0 : '-4px',
                    top: 8,
                    bottom: 8,
                    width: 4,
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span style={{
                width: 40,
                minWidth: 40,
                maxWidth: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 56,
                flexShrink: 0,
              }}>
                <i className={item.icon} style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }} />
              </span>
              <span
                className="label"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '1rem',
                  display: isOpen ? 'flex' : 'none',
                  alignItems: 'center',
                  height: 56,
                  transition: 'opacity 0.2s, width 0.2s',
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {currentUser && (
        <button
          className="sidebar-item logout-button"
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 56,
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#4a5568',
            cursor: 'pointer',
            textAlign: 'left',
            justifyContent: 'flex-start',
            boxSizing: 'border-box',
            transition: 'none',
            padding: '0.75rem 1.5rem',
          }}
          type="button"
        >
          <span style={{
            width: 20,
            minWidth: 20,
            maxWidth: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 56,
            flexShrink: 0,
          }}>
            <i className="fas fa-sign-out-alt" style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }} />
          </span>
          <span className="label" style={{
            marginLeft: 14,
            fontWeight: 500,
            fontSize: '1rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            height: 56,
          }}>Cerrar Sesión</span>
        </button>
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
  overflow: hidden;

  /* Cuando el sidebar está colapsado */
  &.collapsed {
    .sidebar-item,
    .logout-button,
    .nav-item {
      justify-content: center !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .label {
      display: none !important;
    }
  }

  .sidebar-header {
    padding: 0;
    display: flex;
    align-items: center;
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
    overflow: hidden;
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
        transition: none !important;
        transform: none !important;
        margin-left: 0 !important;
      }

      .label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .sidebar-footer {
    padding: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;

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