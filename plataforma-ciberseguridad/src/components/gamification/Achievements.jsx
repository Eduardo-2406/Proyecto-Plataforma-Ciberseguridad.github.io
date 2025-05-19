import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Achievements.css';

const Achievements = () => {
  const { stats } = useProgress();
  const { userProfile } = useAuth();

  const achievements = [
    {
      id: 'first_module',
      title: 'Primer Módulo',
      description: 'Completaste tu primer módulo',
      icon: '🎯',
      points: 100
    },
    {
      id: 'perfect_score',
      title: 'Puntuación Perfecta',
      description: 'Obtuviste 100% en una evaluación',
      icon: '⭐',
      points: 200
    },
    {
      id: 'fast_learner',
      title: 'Aprendiz Rápido',
      description: 'Completaste un módulo en menos de 30 minutos',
      icon: '⚡',
      points: 150
    },
    {
      id: 'module_master',
      title: 'Maestro de Módulos',
      description: 'Completaste todos los módulos',
      icon: '👑',
      points: 500
    },
    {
      id: 'evaluation_expert',
      title: 'Experto en Evaluaciones',
      description: 'Completaste todas las evaluaciones',
      icon: '🎓',
      points: 300
    },
    {
      id: 'consistent_learner',
      title: 'Aprendiz Consistente',
      description: 'Accediste a la plataforma durante 7 días seguidos',
      icon: '📅',
      points: 250
    }
  ];

  const userAchievements = userProfile?.achievements || [];

  return (
    <div className="achievements-container">
      <h2>Logros</h2>
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card ${
              userAchievements.includes(achievement.id) ? 'unlocked' : 'locked'
            }`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
            <div className="achievement-points">+{achievement.points} puntos</div>
            {userAchievements.includes(achievement.id) && (
              <div className="achievement-badge">Desbloqueado</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements; 