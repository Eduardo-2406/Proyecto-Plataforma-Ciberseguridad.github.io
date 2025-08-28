import React, { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { modulesData } from '../data/modules';
import AnimatedText from './animations/AnimatedText';
import { useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaKey, 
  FaUserShield, 
  FaDatabase, 
  FaExclamationTriangle, 
  FaLaptopCode 
} from 'react-icons/fa';
import '../styles/Modules.css';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState({});
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
          const progressRef = ref(database, `users/${currentUser.uid}/progress`);
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
    if (!currentUser) {
      return 'not-started';
    }
    const progress = userProgress[moduleId];
    if (!progress) {
      return 'not-started';
    }
    
    // Verificar si el módulo está completado
    if (progress.completed || (progress.quizCompleted && progress.quizScore >= 80)) {
      return 'completed';
    }
    
    // Verificar si hay algún progreso (videos vistos o intentos de quiz)
    if (progress.status === 'in-progress' || progress.quizAttempts > 0) {
      return 'in-progress';
    }
    
    return 'not-started';
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

  const imageNames = {
    "1": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/introduccion.avif?format=webp&w=600",
    "2": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/passwords.avif?format=webp&w=600",
    "3": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/phishing.avif?format=webp&w=600",
    "4": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/datos.avif?format=webp&w=600",
    "5": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/incidentes.avif?format=webp&w=600",
    "6": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/simulaciones.avif?format=webp&w=600"
  };

  // Helper para saber si todas las imágenes están cargadas
  const allImagesLoaded = modules.length > 0 && modules.every(m => imgLoaded[m.id]);

  useEffect(() => {
    if (loading || !allImagesLoaded) {
      const timer = setTimeout(() => setTimeoutReached(true), 8000);
      return () => clearTimeout(timer);
    } else {
      setTimeoutReached(false);
    }
  }, [loading, allImagesLoaded]);

  // Efecto para manejar el scroll y mostrar/ocultar el botón
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para hacer scroll hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="modules-container">
      {loading ? (
        <div className="loading">Cargando módulos...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : modules.length === 0 ? (
        <div className="error-message">No hay módulos disponibles.</div>
      ) : (
        <>
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

          <div className="modules-grid">
            {modules.map((module) => {
              const status = getModuleStatus(module.id);
              return (
                <div key={module.id} className="module-card">
                  <div className="module-header">
                    <div className="module-image-wrapper">
                      {!imgLoaded[module.id] && <div className="module-skeleton" />}
                      <img
                        src={imageNames[module.id]}
                        alt={module.title}
                        className={`module-image${imgLoaded[module.id] ? ' loaded' : ''}`}
                        onLoad={() => setImgLoaded(prev => ({ ...prev, [module.id]: true }))}
                        loading="lazy"
                        width="600"
                        height="400"
                      />
                    </div>
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
        </>
      )}
      
      {/* Botón de scroll hacia arriba */}
      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Volver al inicio"
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </div>
  );
};

export default Modules;