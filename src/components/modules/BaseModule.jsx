import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useFirebaseQuery } from '../../hooks/useFirebaseQuery';
import { useProgress } from '../../contexts/ProgressContext';
import { auth, database } from '../../config/firebase';
import { ref, set } from 'firebase/database';
import '../../styles/BaseModule.css';
import OptimizedVideoFrame from '../common/OptimizedVideoFrame';

const MAX_ATTEMPTS = 2; // Máximo de intentos permitidos para el quiz

const BaseModule = ({ 
  title, 
  description, 
  sections, 
  videos, 
  quiz, 
  moduleId,
  nextModuleId,
  prevModuleId,
  id,
  quizAttempts,
  quizCompleted,
  bestScore,
  onRetryQuiz
}) => {
  const navigate = useNavigate();
  const { completeModule, addPoints } = useStore();
  const { recordVideoProgress, recordQuizResult } = useProgress();
  const [quizScore, setQuizScore] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);
  const [moduleStatus, setModuleStatus] = useState('No Iniciado');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [moduleSavedMsg, setModuleSavedMsg] = useState('');
  const [toastClosing, setToastClosing] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const toastTimers = useRef([]);

  // Obtener intentos del quiz
  const { data: quizAttemptsData } = useFirebaseQuery(`quizAttempts/${auth.currentUser?.uid}/${moduleId}`, {
    limitTo: 2,
    orderByField: 'timestamp',
    orderDirection: 'desc'
  });

  // Verificar si se han alcanzado los intentos máximos
  const hasReachedMaxAttempts = quizAttemptsData?.length >= 2;

  // Obtener el progreso del módulo
  const { data: moduleProgress } = useFirebaseQuery(`moduleProgress/${auth.currentUser?.uid}/${moduleId}`);

  // Obtener el progreso de los videos
  const { data: videoProgressData } = useFirebaseQuery(`videoProgress/${auth.currentUser?.uid}/${moduleId}`);

  // Obtener la mejor puntuación del quiz
  const { data: bestQuizScore } = useFirebaseQuery(`bestQuizScores/${auth.currentUser?.uid}/${moduleId}`);

  // Verificar si se han visto todos los videos
  const allVideosWatched = videos?.length > 0 && 
    videoProgressData && 
    Object.values(videoProgressData).filter(video => video.watched).length === videos.length;

  // Verificar si el módulo puede ser completado
  const canCompleteModule = allVideosWatched && quizCompleted;

  // Actualizar el estado del módulo
  useEffect(() => {
    if (moduleProgress?.completed) {
      setModuleStatus('Completado');
      setIsModuleCompleted(true);
      if (moduleProgress.startTime) setStartTime(moduleProgress.startTime);
    } else if (videoProgressData || (quizAttemptsData && quizAttemptsData.length > 0)) {
      setModuleStatus('En Proceso');
      setIsModuleCompleted(false);
      if (!startTime) setStartTime(Date.now());
    } else {
      setModuleStatus('No Iniciado');
      setIsModuleCompleted(false);
      setStartTime(Date.now());
    }
  }, [moduleProgress, videoProgressData, quizAttemptsData]);

  // Ensure page scrolls to top of the app's content area when entering a module
  useEffect(() => {
    // Robust scroll: try to reset the SPA content container, then ensure the main card is visible
    const attemptScroll = (triesLeft = 5) => {
      const content = document.querySelector('.layout-content');
      const container = content || document.scrollingElement || document.documentElement || window;

      // Detect navbar height dynamically: prefer an element fixed at top (common navbar)
      let navbarOffset = 0;
      try {
        const fixedEls = Array.from(document.querySelectorAll('body *'));
        const navbarEl = fixedEls.find(el => {
          const cs = window.getComputedStyle(el);
          if (!cs) return false;
          return cs.position === 'fixed' && Math.round(el.getBoundingClientRect().top) === 0 && el.getBoundingClientRect().height > 0;
        });
        if (navbarEl) {
          navbarOffset = navbarEl.getBoundingClientRect().height || 0;
        } else {
          // Fallback: read layout-container margin-top as approximate navbar height
          const layoutContainer = document.querySelector('.layout-container');
          if (layoutContainer) {
            const cs = window.getComputedStyle(layoutContainer);
            const mt = cs.marginTop || cs.getPropertyValue('margin-top');
            const px = parseFloat(mt.replace('px',''));
            if (!isNaN(px)) navbarOffset = px;
          }
        }
      } catch (err) {
        navbarOffset = 0;
      }

      try {
        if (content && typeof content.scrollTo === 'function') {
          content.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } else if (container && typeof container.scrollTo === 'function') {
          container.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } else {
          window.scrollTo(0, 0);
        }

        // Also ensure the main card is visible (compensate for fixed navbar)
        const card = document.querySelector('.base-module-card');
        if (card && typeof card.getBoundingClientRect === 'function') {
          const rect = card.getBoundingClientRect();
          const absoluteTop = (window.pageYOffset || document.documentElement.scrollTop) + rect.top;
          const target = Math.max(0, absoluteTop - navbarOffset - 8); // small gap
          window.scrollTo({ top: target, left: 0, behavior: 'auto' });
        }
      } catch (err) {
        // if the DOM isn't ready, retry a few times
        if (triesLeft > 0) {
          window.requestAnimationFrame(() => attemptScroll(triesLeft - 1));
        }
      }
    };

    // Run after a tick to let the router render
    setTimeout(() => attemptScroll(), 0);
  }, [moduleId]);

  useEffect(() => {
    if (!quizAttemptsData) return;

    // Support both array and object shapes coming from the RTDB helper
    let latestAttempt = null;

    try {
      if (Array.isArray(quizAttemptsData)) {
        // array may be ordered by timestamp desc via the query, pick first defined
        latestAttempt = quizAttemptsData.find(a => a && typeof a.score !== 'undefined') || quizAttemptsData[0];
      } else if (typeof quizAttemptsData === 'object') {
        const vals = Object.values(quizAttemptsData).filter(Boolean);
        if (vals.length) {
          // prefer ordering by timestamp if present
          vals.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          latestAttempt = vals[0];
        }
      }
    } catch (err) {
      console.warn('Error parsing quizAttemptsData for latest attempt:', err, quizAttemptsData);
      latestAttempt = null;
    }

    const score = latestAttempt && typeof latestAttempt.score !== 'undefined' ? latestAttempt.score : 0;
    setQuizScore(score);
  }, [quizAttemptsData]);

  // Cleanup toast timers if component unmounts
  useEffect(() => () => { toastTimers.current.forEach(t => clearTimeout(t)); }, []);

  useEffect(() => {
    if (bestQuizScore) {
      setQuizScore(bestQuizScore.score);
    }
  }, [bestQuizScore]);

  // Mostrar/ocultar botón scroll-to-top en módulo
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTopButton = () => {
    // Intentar scrollear el contenedor SPA primero, y asegurar fallback a window
    const content = document.querySelector('.layout-content');
    try {
      if (content && typeof content.scrollTo === 'function') {
        content.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        // also set scrollTop as immediate fallback
        content.scrollTop = 0;
      }
    } catch (e) {
      try { content.scrollTop = 0; } catch(_) {}
    }

    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  };

  const handleVideoProgress = async (videoId) => {
    // If module is already completed, don't record video progress that may overwrite completion status
    if (moduleProgress?.completed) {
      return;
    }

    if (!videoProgress[videoId]) {
      try {
        // Usar la nueva función del ProgressContext
        const result = await recordVideoProgress(moduleId, videoId);
        
        if (result.success) {
          const newProgress = { ...videoProgress, [videoId]: true };
          setVideoProgress(newProgress);
          
          // Solo agregar puntos localmente si no se obtuvieron de la función
          if (!result.alreadyWatched) {
            addPoints(result.points);
          }
        }
      } catch (error) {
        console.error('Error al registrar progreso de video:', error);
        // Fallback al método anterior si hay error
        const newProgress = { ...videoProgress, [videoId]: true };
        setVideoProgress(newProgress);
        addPoints(10);
        
        // Guardar en Firebase como respaldo
        if (auth.currentUser) {
          const progressRef = ref(database, `videoProgress/${auth.currentUser.uid}/${moduleId}/${videoId}`);
          await set(progressRef, {
            id: videoId,
            watched: true,
            timestamp: Date.now()
          });
        }
      }

      // Actualizar el estado del módulo a "En Proceso" sin sobrescribir 'completed'
      if (auth.currentUser) {
        const userProgressRef = ref(database, `users/${auth.currentUser.uid}/progress/${moduleId}`);
        try {
          const snap = await get(userProgressRef);
          const existing = snap.exists() ? snap.val() : {};
          if (existing.completed) {
            // preservar completed
            await set(userProgressRef, { ...existing, lastUpdated: Date.now() });
          } else {
            await set(userProgressRef, { ...existing, status: 'in-progress', lastUpdated: Date.now() });
          }
        } catch (err) {
          // Fallback simple
          await set(userProgressRef, {
            status: moduleProgress?.completed ? 'completed' : 'in-progress',
            lastUpdated: Date.now()
          });
        }
      }
    }
  };

  const handleModuleComplete = async () => {
    if (!isModuleCompleted) {
      if (allVideosWatched && quizCompleted) {
        completeModule(moduleId);
        addPoints(50); // 50 puntos por completar el módulo
        setIsModuleCompleted(true);

        const completedAt = Date.now();

        // Guardar progreso en Firebase SOLO para el módulo actual, con startTime y completedAt
        if (auth.currentUser) {
          // Actualizar el progreso del módulo
          const moduleRef = ref(database, `moduleProgress/${auth.currentUser.uid}/${moduleId}`);
          await set(moduleRef, {
            completed: true,
            startTime,
            completedAt,
            score: bestScore,
            videosWatched: Object.keys(videoProgress).length
          });

          // Actualizar el progreso general del usuario SOLO para el módulo actual
          const userProgressRef = ref(database, `users/${auth.currentUser.uid}/progress/${moduleId}`);
          await set(userProgressRef, {
            completed: true,
            startTime,
            completedAt,
            score: bestScore,
            status: 'completed'
          });
        }

        // Mostrar mensaje de éxito mediante toast (mismo estilo que Profile) y redirigir
        toastTimers.current.forEach(t => clearTimeout(t));
        toastTimers.current = [];
        setToastClosing(false);
        setModuleSavedMsg('¡Felicidades! Has completado este módulo exitosamente.');
        toastTimers.current.push(setTimeout(() => setToastClosing(true), 3200)); // start exit
        toastTimers.current.push(setTimeout(() => { setModuleSavedMsg(''); setToastClosing(false); }, 3600));

        setTimeout(() => navigate('/modules'), 900);
      } else {
        let message = 'Para completar el módulo necesitas:';
        if (!allVideosWatched) {
          message += '\n- Ver todos los videos del módulo';
        }
        if (!quizCompleted) {
          message += '\n- Aprobar el quiz con al menos 80%';
        }
  // Mensaje de validación (usar alert corto como fallback)
  alert(message);
      }
    }
  };

  const getModuleStatus = () => {
    if (moduleProgress?.completed) {
      return "completed";
    }
    if (allVideosWatched || (quizAttemptsData && quizAttemptsData.length > 0)) {
      return "in-progress";
    }
    return "not-started";
  };

  const getStatusLabel = () => {
    const status = getModuleStatus();
    switch (status) {
      case "completed":
        return "Completado";
      case "in-progress":
        return "En Progreso";
      default:
        return "No Iniciado";
    }
  };

  return (
    <div className="base-module-container">
      {/* Toast éxito módulo */}
      {moduleSavedMsg && (
        <div className={`profile-toast ${toastClosing ? 'closing' : ''}`} role="status" aria-live="polite">{moduleSavedMsg}</div>
      )}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0 }}
        className="base-module-card"
      >
        <div className="module-header">
          <h1 className="module-title">{title}</h1>
          <span className={`module-status-badge ${
            moduleStatus === 'Completado' ? 'completed' :
            moduleStatus === 'En Proceso' ? 'in-progress' :
            'not-started'
          }`}>
            {moduleStatus}
          </span>
        </div>
        <p className="module-description">{description}</p>

        {/* Secciones del módulo */}
        <div className="module-sections">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0 }}
              className="module-section"
            >
              <h2 className="section-title">
                {section.title}
              </h2>
              <p className="section-content">{section.content}</p>
              
              {section.points && (
                <ul className="section-points">
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {section.image && (
                <div className="section-image-container">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="section-image"
                  />
                </div>
              )}

              {section.link && (
                <a
                  href={section.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="section-link"
                >
                  Leer más
                </a>
              )}
            </motion.section>
          ))}
        </div>

        {/* Videos del módulo */}
        {videos && videos.length > 0 && (
          <div className="videos-section">
            <h2 className="videos-title">
              Videos Educativos
            </h2>
            <div className="videos-grid">
              {videos.map((video, index) => (
                <div key={index} className="video-card">
                  <div className="video-container">
                    <OptimizedVideoFrame
                      src={video.url}
                      title={video.title}
                      onLoad={() => handleVideoProgress(index)}
                      className="video-iframe"
                    />
                    {videoProgress[index] && (
                      <div className="video-completed-badge">
                        Visto
                      </div>
                    )}
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <div className="video-duration">Educativo</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="videos-progress">
              Videos vistos: {Object.values(videoProgressData || {}).filter(video => video.watched).length} de {videos.length}
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{
                    width: `${(Object.values(videoProgressData || {}).filter(video => video.watched).length / videos.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Sección del Quiz */}
        <div className="quiz-section">
          <h2 className="quiz-title">Quiz del Módulo</h2>
          <div className="quiz-info">
            <div className="quiz-stat">
              <span className="quiz-stat-label">Estado del Quiz:</span>
              <span className="quiz-stat-value">
                Intentos realizados: {quizAttempts} de 2
              </span>
            </div>
            
            {bestScore !== null && (
              <div className="quiz-stat">
                <span className="quiz-stat-label">Tu mejor puntuación:</span>
                <span className="quiz-stat-value">
                  {typeof bestScore === 'number' ? bestScore.toFixed(1) : '0.0'}%
                </span>
              </div>
            )}

            {bestScore !== null && bestScore >= 80 && (
              <div className="quiz-success">
                <p className="quiz-success-text">Has ganado 30 puntos por este quiz.</p>
              </div>
            )}

            <div className="quiz-actions">
              <button
                onClick={onRetryQuiz}
                disabled={quizAttempts >= 2 || quizCompleted}
                className={quizAttempts >= 2 || quizCompleted ? 'quiz-btn-disabled' : 'quiz-btn-primary'}
              >
                {quizAttempts === 0 ? 'Comenzar Quiz' : 'Reintentar Quiz'}
              </button>
            </div>
          </div>
        </div>

        {/* Botón Completar Módulo */}
        <div className="module-complete-section">
          <button
            onClick={handleModuleComplete}
            disabled={!canCompleteModule || isModuleCompleted}
            className={canCompleteModule && !isModuleCompleted ? 'complete-btn-active' : 'complete-btn-disabled'}
          >
            {isModuleCompleted ? 'Módulo Completado' : 'Completar Módulo'}
          </button>
        </div>
      </motion.div>
      {/* Scroll to top button */}
      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTopButton}
        aria-label="Volver al inicio"
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </div>
  );
};

export default BaseModule; 