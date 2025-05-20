import React, { useState, useEffect } from 'react';
import { rtdb } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { modulesData } from '../data/modules';
import AnimatedText from './animations/AnimatedText';
import { useNavigate } from 'react-router-dom';
import '../styles/Modules.css';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadModules = async () => {
      try {
        // Usar datos locales temporalmente
        const modulesArray = Object.entries(modulesData).map(([id, module]) => ({
          id,
          ...module
        }));
        setModules(modulesArray);
        setLoading(false);

        // Cargar progreso del usuario si está autenticado
        if (currentUser) {
          const progressRef = ref(rtdb, `users/${currentUser.uid}/progress`);
          onValue(progressRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setUserProgress(data);
            }
          });
        }
      } catch (error) {
        setError('Error al cargar los módulos');
        setLoading(false);
      }
    };

    loadModules();
  }, [currentUser]);

  const getModuleStatus = (moduleId) => {
    if (!currentUser) return 'not-started';
    const progress = userProgress[moduleId];
    if (!progress) return 'not-started';
    if (progress.completed) return 'completed';
    return 'in-progress';
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En progreso';
      default:
        return 'No iniciado';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#16a34a';
      case 'in-progress':
        return '#2563eb';
      default:
        return '#718096';
    }
  };

  if (loading) {
    return (
      <div className="modules-container">
        <div className="loading">Cargando módulos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modules-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="modules-container">
      <AnimatedText 
        text="Módulos de Aprendizaje" 
        className="animated-title"
        type="h1"
      />
      <AnimatedText 
        text="Explora nuestros módulos de aprendizaje y comienza tu camino hacia la excelencia en ciberseguridad."
        className="animated-subtitle"
        type="h2"
      />

      <div className="modules-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {modules.map((module) => {
          const status = getModuleStatus(module.id);
          return (
            <div key={module.id} className="module-card">
              <div className="module-header">
                <img
                  src={module.image}
                  alt={module.title}
                  className="module-image"
                />
                <div className="module-badge">
                  <i className="fas fa-book" />
                </div>
              </div>

              <div className="module-content">
                <h3>{module.title}</h3>
                <p className="module-description">{module.description}</p>

                <div className="module-details">
                  <div className="detail-item">
                    <i className="fas fa-clock" />
                    <span>{module.duration} horas</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-signal" />
                    <span>{module.level}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-tasks" />
                    <span>{module.lessons} lecciones</span>
                  </div>
                </div>

                <div className="module-tags">
                  {module.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="module-status">
                  <span
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(status) }}
                  />
                  <span className="status-label">{getStatusLabel(status)}</span>
                </div>

                <button
                  className="start-button"
                  onClick={() => {
                    if (!currentUser) {
                      navigate('/login');
                    } else {
                      navigate(`/module/${module.id}`);
                    }
                  }}
                >
                  {status === 'completed'
                    ? 'Repasar'
                    : status === 'in-progress'
                    ? 'Continuar'
                    : 'Comenzar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!currentUser && (
        <div className="login-prompt">
          <h2>¿Listo para aprender?</h2>
          <p>
            Inicia sesión o crea una cuenta para comenzar tu aprendizaje en
            ciberseguridad.
          </p>
          <div className="prompt-buttons">
            <button
              className="login-button"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
            <button
              className="register-button"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules; 