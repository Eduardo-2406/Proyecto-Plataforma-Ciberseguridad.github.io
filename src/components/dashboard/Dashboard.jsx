import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';
import ModuleProgress from './ModuleProgress';
import WeeklyChallenge from './WeeklyChallenge';
import UserRanking from './UserRanking';
import NextSteps from './NextSteps';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const { userStats } = useProgress();
  const { currentUser } = useAuth();

  const getUserLevel = (points) => {
    if (points < 1000) return { name: 'Novato', icon: '🌱' };
    if (points < 5000) return { name: 'Defensor', icon: '🛡️' };
    return { name: 'Protector', icon: '👑' };
  };

  const userLevel = getUserLevel(userStats.totalPoints);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-welcome">
          <h1>Bienvenido, {currentUser.displayName || 'Usuario'}</h1>
          <div className="user-level">
            <span className="level-icon">{userLevel.icon}</span>
            <span className="level-name">{userLevel.name}</span>
          </div>
        </div>
        <div className="quick-stats">
          <div className="stat-card">
            <h3>Puntos Totales</h3>
            <p>{userStats.totalPoints}</p>
          </div>
          <div className="stat-card">
            <h3>Módulos Completados</h3>
            <p>{userStats.completedModules}</p>
          </div>
          <div className="stat-card">
            <h3>Logros Desbloqueados</h3>
            <p>{userStats.achievements}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-content">
          <ModuleProgress />
          <WeeklyChallenge />
        </div>
        <div className="sidebar">
          <UserRanking />
          <NextSteps />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 