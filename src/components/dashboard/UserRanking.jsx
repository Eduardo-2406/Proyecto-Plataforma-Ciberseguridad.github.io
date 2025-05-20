import React, { useState, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/UserRanking.css';

const UserRanking = () => {
  const { topUsers } = useProgress();
  const { currentUser } = useAuth();
  const [timeFrame, setTimeFrame] = useState('monthly');

  const getUserLevel = (points) => {
    if (points < 1000) return { name: 'Novato', icon: '🌱' };
    if (points < 3000) return { name: 'Defensor', icon: '🛡️' };
    return { name: 'Protector', icon: '⚔️' };
  };

  return (
    <div className="user-ranking">
      <div className="ranking-header">
        <h2>Ranking Mensual</h2>
        <div className="ranking-filters">
          <button
            className={`filter-button ${timeFrame === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeFrame('monthly')}
          >
            Mensual
          </button>
          <button
            className={`filter-button ${timeFrame === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeFrame('weekly')}
          >
            Semanal
          </button>
        </div>
      </div>

      <div className="ranking-list">
        {topUsers.map((user, index) => {
          const level = getUserLevel(user.points);
          const isCurrentUser = user.id === currentUser?.uid;

          return (
            <div
              key={user.id}
              className={`ranking-item ${isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="rank-position">{index + 1}</div>
              <div className="user-info">
                <div className="user-name">
                  {user.displayName || 'Usuario'}
                  {isCurrentUser && <span className="you-badge">Tú</span>}
                </div>
                <div className="user-level">
                  <span className="level-icon">{level.icon}</span>
                  <span className="level-name">{level.name}</span>
                </div>
              </div>
              <div className="user-points">{user.points} pts</div>
            </div>
          );
        })}
      </div>

      {!topUsers.some(user => user.id === currentUser?.uid) && (
        <div className="current-user-rank">
          <p>Tu posición actual no está en el top 10</p>
          <button className="view-full-ranking">Ver ranking completo</button>
        </div>
      )}
    </div>
  );
};

export default UserRanking; 