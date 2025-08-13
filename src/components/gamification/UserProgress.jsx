import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/UserProgress.css';

const UserProgress = () => {
  const { stats, moduleProgress } = useProgress();
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

  return (
    <div className="user-progress-container">
      <div className="user-stats">
        <div className="stat-card">
          <h3>Nivel</h3>
          <div className="stat-value">{level}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressToNextLevel}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {Math.round(progressToNextLevel)}% al siguiente nivel
          </div>
        </div>

        <div className="stat-card">
          <h3>Puntos Totales</h3>
          <div className="stat-value">{stats?.totalPoints || 0}</div>
        </div>

        <div className="stat-card">
          <h3>Módulos Completados</h3>
          <div className="stat-value">{stats?.modulesCompleted || 0}/6</div>
        </div>

        <div className="stat-card">
          <h3>Logros Desbloqueados</h3>
          <div className="stat-value">{stats?.achievementsUnlocked || 0}</div>
        </div>
      </div>

      <h2 className="modules-title">Progreso por Módulo</h2>
      <div className="modules-grid">
        {Object.entries(moduleProgress).map(([moduleId, progress]) => (
          <div key={moduleId} className="module-card">
            <h4>Módulo {parseInt(moduleId) + 1}</h4>
            <div className="module-status">
              {progress?.completed ? (
                <span className="status completed">Completado</span>
              ) : progress?.started ? (
                <span className="status in-progress">En Progreso</span>
              ) : (
                <span className="status not-started">No Iniciado</span>
              )}
            </div>
            {progress?.score && (
              <div className="module-score">
                Puntuación: {progress.score}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProgress;