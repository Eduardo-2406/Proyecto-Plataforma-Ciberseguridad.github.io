import React, { useState, useEffect } from 'react';
import { auth, rtdb } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/Gamification.css';

const Gamification = () => {
  const [userData, setUserData] = useState({
    points: 0,
    level: 'Novato',
    badges: [],
    weeklyChallenges: []
  });
  const [showNotification, setShowNotification] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUserData(user.uid);
        loadTopUsers();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = (userId) => {
    const userRef = ref(rtdb, `users/${userId}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val() || {};
      const points = data.points || 0;
      const level = getLevel(points);
      const badges = data.badges || [];
      
      setUserData({
        points,
        level,
        badges,
        weeklyChallenges: data.weeklyChallenges || []
      });
    });

    return () => unsubscribe();
  };

  const loadTopUsers = () => {
    const usersRef = ref(rtdb, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const users = snapshot.val() || {};
      const topUsersArray = Object.entries(users)
        .map(([id, user]) => ({
          id,
          name: user.name,
          points: user.points || 0,
          level: getLevel(user.points || 0)
        }))
        .sort((a, b) => b.points - a.points)
        .slice(0, 5);

      setTopUsers(topUsersArray);
    });

    return () => unsubscribe();
  };

  const getLevel = (points) => {
    if (points >= 500) return 'Protector';
    if (points >= 200) return 'Defensor';
    return 'Novato';
  };

  const getBadges = (points) => {
    const badges = [];
    if (points >= 100) badges.push('Cazador de Phish');
    if (points >= 300) badges.push('Guardián Digital');
    if (points >= 500) badges.push('Maestro de la Ciberseguridad');
    return badges;
  };

  const showBadgeNotification = (badge) => {
    setNewBadge(badge);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNewBadge(null);
    }, 3000);
  };

  const calculateProgress = () => {
    const pointsForNextLevel = userData.level === 'Novato' ? 200 :
                              userData.level === 'Defensor' ? 500 : 1000;
    const pointsInCurrentLevel = userData.points % pointsForNextLevel;
    return (pointsInCurrentLevel / pointsForNextLevel) * 100;
  };

  return (
    <div className="gamification-container">
      <div className="dashboard-section">
        <h2>Tu Progreso</h2>
        <div className="level-info">
          <h3>Nivel: {userData.level}</h3>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <p>{userData.points} puntos</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Tus Insignias</h2>
        <div className="badges-container">
          {userData.badges.map((badge, index) => (
            <div key={index} className="badge">
              <i className="fas fa-medal" />
              <span className="badge-name">{badge}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Top 5 Mensual</h2>
        <div className="top-users">
          {topUsers.map((user, index) => (
            <div key={user.id} className="top-user">
              <span className="rank">#{index + 1}</span>
              <span className="name">{user.name}</span>
              <span className="level">{user.level}</span>
              <span className="points">{user.points} pts</span>
            </div>
          ))}
        </div>
      </div>

      {showNotification && newBadge && (
        <div className="badge-notification">
          <i className="fas fa-medal" />
          <p>¡Nueva insignia desbloqueada: {newBadge}!</p>
        </div>
      )}
    </div>
  );
};

export default Gamification; 