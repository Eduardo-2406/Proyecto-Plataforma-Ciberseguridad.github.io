import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useFirebaseQuery } from '../../hooks/useFirebaseQuery';
import { useProgress } from '../../contexts/ProgressContext';
import { auth, database } from '../../config/firebase';
import { ref, set } from 'firebase/database';
import '../../styles/BaseModule.css';

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
    } else if (videoProgressData || (quizAttemptsData && quizAttemptsData.length > 0)) {
      setModuleStatus('En Proceso');
      setIsModuleCompleted(false);
    } else {
      setModuleStatus('No Iniciado');
      setIsModuleCompleted(false);
    }
  }, [moduleProgress, videoProgressData, quizAttemptsData]);

  useEffect(() => {
    if (quizAttemptsData && quizAttemptsData.length > 0) {
      const latestAttempt = quizAttemptsData[0];
      const score = latestAttempt.score || 0;
      setQuizScore(score);
    }
  }, [quizAttemptsData]);

  useEffect(() => {
    if (bestQuizScore) {
      setQuizScore(bestQuizScore.score);
    }
  }, [bestQuizScore]);

  const handleVideoProgress = async (videoId) => {
    if (!videoProgress[videoId]) {
      try {
        // Usar la nueva función del ProgressContext
        const result = await recordVideoProgress(moduleId, videoId);
        
        if (result.success) {
          const newProgress = { ...videoProgress, [videoId]: true };
          setVideoProgress(newProgress);
          
          // Solo agregar puntos localmente si no se obtuvieron de la función
          if (result.alreadyWatched) {
            console.log('Video ya visto anteriormente');
          } else {
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

      // Actualizar el estado del módulo a "En Proceso"
      if (auth.currentUser) {
        const userProgressRef = ref(database, `users/${auth.currentUser.uid}/progress/${moduleId}`);
        await set(userProgressRef, {
          status: 'in-progress',
          lastUpdated: Date.now()
        });
      }
    }
  };

  const handleModuleComplete = async () => {
    if (!isModuleCompleted) {
      if (allVideosWatched && quizCompleted) {
        completeModule(moduleId);
        addPoints(50); // 50 puntos por completar el módulo
        setIsModuleCompleted(true);

        // Guardar progreso en Firebase
        if (auth.currentUser) {
          // Actualizar el progreso del módulo
          const moduleRef = ref(database, `moduleProgress/${auth.currentUser.uid}/${moduleId}`);
          await set(moduleRef, {
            completed: true,
            completedAt: Date.now(),
            score: bestScore,
            videosWatched: Object.keys(videoProgress).length
          });

          // Actualizar el progreso general del usuario
          const userProgressRef = ref(database, `users/${auth.currentUser.uid}/progress/${moduleId}`);
          await set(userProgressRef, {
            completed: true,
            completedAt: Date.now(),
            score: bestScore,
            status: 'completed'
          });
        }

        // Mostrar mensaje de éxito y redirigir
        alert('¡Felicidades! Has completado este módulo exitosamente.');
        navigate('/modules'); // Redirigir a la página de módulos
      } else {
        let message = 'Para completar el módulo necesitas:';
        if (!allVideosWatched) {
          message += '\n- Ver todos los videos del módulo';
        }
        if (!quizCompleted) {
          message += '\n- Aprobar el quiz con al menos 80%';
        }
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
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
                    <iframe
                      src={video.url}
                      title={video.title}
                      className="video-iframe"
                      allowFullScreen
                      onLoad={() => handleVideoProgress(index)}
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
    </div>
  );
};

export default BaseModule; 