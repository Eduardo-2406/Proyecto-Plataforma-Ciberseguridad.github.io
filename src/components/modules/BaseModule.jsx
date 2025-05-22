import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useFirebaseQuery } from '../../hooks/useFirebaseQuery';
import { auth, rtdb } from '../../config/firebase';
import { ref, set } from 'firebase/database';

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
    } else if (videoProgressData || quizAttempts > 0) {
      setModuleStatus('En Proceso');
    } else {
      setModuleStatus('No Iniciado');
    }
  }, [moduleProgress, videoProgressData, quizAttempts]);

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
      const newProgress = { ...videoProgress, [videoId]: true };
      setVideoProgress(newProgress);
      
      // Sumar puntos por ver video
      addPoints(10); // 10 puntos por video

      // Guardar progreso en Firebase
      if (auth.currentUser) {
        // Actualizar progreso del video
        const progressRef = ref(rtdb, `videoProgress/${auth.currentUser.uid}/${moduleId}/${videoId}`);
        await set(progressRef, {
          id: videoId,
          watched: true,
          timestamp: Date.now()
        });

        // Actualizar el estado del módulo a "En Proceso"
        const userProgressRef = ref(rtdb, `users/${auth.currentUser.uid}/progress/${moduleId}`);
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
          const moduleRef = ref(rtdb, `moduleProgress/${auth.currentUser.uid}/${moduleId}`);
          await set(moduleRef, {
            completed: true,
            completedAt: Date.now(),
            score: bestScore,
            videosWatched: Object.keys(videoProgress).length
          });

          // Actualizar el progreso general del usuario
          const userProgressRef = ref(rtdb, `users/${auth.currentUser.uid}/progress/${moduleId}`);
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
    if (quizCompleted && bestScore >= 80) {
      return "completed";
    }
    if (allVideosWatched || quizAttempts > 0) {
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
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            moduleStatus === 'Completado' ? 'bg-green-100 text-green-800' :
            moduleStatus === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {moduleStatus}
          </span>
        </div>
        <p className="text-gray-600 mb-8">{description}</p>

        {/* Secciones del módulo */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 mb-4">{section.content}</p>
              
              {section.points && (
                <ul className="list-disc list-inside mb-4 text-gray-600">
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {section.image && (
                <div className="relative w-full h-64 mb-4">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}

              {section.link && (
                <a
                  href={section.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Leer más
                </a>
              )}
            </motion.section>
          ))}
        </div>

        {/* Videos del módulo */}
        {videos && videos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Videos Educativos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((video, index) => (
                <div key={index} className="aspect-video relative">
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    onLoad={() => handleVideoProgress(index)}
                  />
                  {videoProgress[index] && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                      ✓ Visto
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Videos vistos: {Object.values(videoProgressData || {}).filter(video => video.watched).length} de {videos.length}
            </div>
          </div>
        )}

        {/* Sección del Quiz */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz del Módulo</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estado del Quiz:</span>
              <span className="font-medium">
                Intentos realizados: {quizAttempts} de 2
              </span>
            </div>
            
            {bestScore !== null && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tu mejor puntuación:</span>
                <span className="font-medium">
                  {typeof bestScore === 'number' ? bestScore.toFixed(1) : '0.0'}%
                </span>
              </div>
            )}

            {bestScore !== null && bestScore >= 80 && (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg">
                <p className="font-medium">Has ganado 30 puntos por este quiz.</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={onRetryQuiz}
                disabled={quizAttempts >= 2 || quizCompleted}
                className={`px-6 py-2 rounded-lg ${
                  quizAttempts >= 2 || quizCompleted
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {quizAttempts === 0 ? 'Comenzar Quiz' : 'Reintentar Quiz'}
              </button>
            </div>
          </div>
        </div>

        {/* Botón Completar Módulo */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleModuleComplete}
            disabled={!canCompleteModule || isModuleCompleted}
            className={`px-6 py-3 rounded-lg text-white font-medium ${
              canCompleteModule && !isModuleCompleted
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isModuleCompleted ? 'Módulo Completado' : 'Completar Módulo'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BaseModule; 