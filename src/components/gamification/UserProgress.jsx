import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/UserProgress.css';

const UserProgress = () => {
  const { stats, moduleProgress, loading } = useProgress();
  const { userProfile } = useAuth();

  const calculateLevel = (points) => {
    return Math.floor(points / 1000) + 1;
  };

  const calculateProgressToNextLevel = (points) => {
    const currentLevel = calculateLevel(points);
    const pointsForNextLevel = currentLevel * 1000;
    const pointsInCurrentLevel = points - ((currentLevel - 1) * 1000);
    return (pointsInCurrentLevel / 1000) * 100;
  };

  const level = calculateLevel(stats?.totalPoints || 0);
  const progressToNextLevel = calculateProgressToNextLevel(stats?.totalPoints || 0);

  const MODULE_TITLES = [
    'Introducción a la Ciberseguridad',
    'Gestión de Contraseñas y MFA',
    'Phishing e Ingeniería Social',
    'Protección y Privacidad de Datos',
    'Respuesta a Incidentes',
    'Simulaciones de Ciberataques'
  ];

  // Construir datos por módulo de forma robusta: preferir detailedModuleProgress si existe
  const buildModuleList = () => {
    const total = MODULE_TITLES.length;
    const detailed = stats?.detailedModuleProgress || null;

    const list = Array.from({ length: total }, (_, idx) => {
      // buscar en detailed (array de objetos) por moduleId usando solo 1-based
      let entry = null;
      const oneBased = idx + 1;
      if (Array.isArray(detailed)) {
        entry = detailed.find(m => Number(m.moduleId) === oneBased);
      }

      // si no hay entry, buscar en moduleProgress (objeto con keys 1..6)
      let prog = entry || null;
      const oneBasedKey = String(oneBased);
      if (!prog && moduleProgress) {
        prog = moduleProgress[oneBasedKey] || null;
      }

      // derivar estado
      const bestQuizScore = prog?.bestQuizScore ?? prog?.score ?? 0;
      const completed = Boolean(prog?.completed);
      const started = Boolean(prog && !completed && (prog.videosWatched || prog.quizAttempts || prog.started));
      const score = Number.isFinite(bestQuizScore) ? bestQuizScore : (prog?.score ?? 0);

      return {
        moduleId: oneBased,
        title: MODULE_TITLES[idx],
        completed,
        started,
        score
      };
    });

    return list;
  };

  const modulesList = buildModuleList();

  return (
    <div className="user-progress-container">
      <h2 className="modules-title">Progreso por Módulo</h2>
      <div className="modules-grid">
        {loading ? (
          <div className="loading-placeholder">Cargando progreso...</div>
        ) : (
          modulesList.map(m => (
            <div key={m.moduleId} className="module-card">
              <h4>{`Módulo ${m.moduleId}: ${m.title}`}</h4>
              <div className="module-status">
                {m.completed ? (
                  <span className="status completed">Completado</span>
                ) : m.started ? (
                  <span className="status in-progress">En Progreso</span>
                ) : (
                  <span className="status not-started">No Iniciado</span>
                )}
              </div>
              {m.score > 0 && (
                <div className="module-score">
                  Puntuación: {Number(m.score || 0).toFixed(2)}%
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProgress;