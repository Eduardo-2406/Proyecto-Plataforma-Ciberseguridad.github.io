import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../config/firebase';
import { ref, update, onValue } from 'firebase/database';
import { updateProfile } from 'firebase/auth';
import UserProgress from './gamification/UserProgress';
import Achievements from './gamification/Achievements';
import { 
  FaUser, FaComments, FaCommentDots, FaHeart,
  FaUserAstronaut, FaUserNinja, FaUserSecret, FaUserTie,
  FaUserGraduate, FaUserShield, FaUserCog, FaUserAlt,
  FaUserCircle, FaUserCheck
} from 'react-icons/fa';
import '../styles/Profile.css';

const AVATAR_OPTIONS = [
  { id: 'astronaut', icon: FaUserAstronaut, name: 'Astronauta' },
  { id: 'ninja', icon: FaUserNinja, name: 'Ninja' },
  { id: 'secret', icon: FaUserSecret, name: 'Agente Secreto' },
  { id: 'tie', icon: FaUserTie, name: 'Ejecutivo' },
  { id: 'graduate', icon: FaUserGraduate, name: 'Graduado' },
  { id: 'shield', icon: FaUserShield, name: 'Guardián' },
  { id: 'cog', icon: FaUserCog, name: 'Ingeniero' },
  { id: 'alt', icon: FaUserAlt, name: 'Alternativo' },
  { id: 'circle', icon: FaUserCircle, name: 'Círculo' },
  { id: 'check', icon: FaUserCheck, name: 'Verificado' }
];

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    avatarId: 'circle', // Avatar por defecto
    bio: ''
  });
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    likes: 0,
    badges: []
  });

  useEffect(() => {
    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserData(prev => ({
            ...prev,
            ...data
          }));
        }
      });

      const statsRef = ref(database, `users/${currentUser.uid}/stats`);
      onValue(statsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setStats(data);
        }
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarSelect = (avatarId) => {
    setUserData(prev => ({
      ...prev,
      avatarId
    }));
    setShowAvatarSelector(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Actualizar el perfil en Firebase Auth
      await updateProfile(currentUser, {
        displayName: userData.displayName
      });

      // Actualizar en Realtime Database
      const userRef = ref(database, `users/${currentUser.uid}`);
      await update(userRef, {
        displayName: userData.displayName,
        bio: userData.bio,
        avatarId: userData.avatarId
      });

      setSuccess('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al actualizar el perfil');
    }

    setLoading(false);
  };

  const getAvatarIcon = (avatarId) => {
    const avatar = AVATAR_OPTIONS.find(opt => opt.id === avatarId);
    return avatar ? avatar.icon : FaUserCircle;
  };

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="error-message">
          Debes iniciar sesión para ver tu perfil
        </div>
      </div>
    );
  }

  const CurrentAvatar = getAvatarIcon(userData.avatarId);

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <div 
              className="profile-avatar" 
              onClick={() => setShowAvatarSelector(true)}
            >
              <CurrentAvatar className="avatar-icon" />
              <div className="avatar-overlay">
                <FaUser />
                <span>Cambiar avatar</span>
              </div>
            </div>
          </div>
          <div className="profile-info">
            <h1>{userData.displayName || 'Usuario'}</h1>
            <p className="profile-email">{userData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="displayName">Nombre</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={userData.displayName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biografía</label>
            <textarea
              id="bio"
              name="bio"
              value={userData.bio}
              onChange={handleInputChange}
              rows="4"
              placeholder="Cuéntanos un poco sobre ti..."
            />
          </div>

          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

        <div className="profile-stats">
          <div className="stat-card">
            <FaComments className="stat-icon" />
            <span className="stat-value">{stats.posts}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-card">
            <FaCommentDots className="stat-icon" />
            <span className="stat-value">{stats.comments}</span>
            <span className="stat-label">Comentarios</span>
          </div>
          <div className="stat-card">
            <FaHeart className="stat-icon" />
            <span className="stat-value">{stats.likes}</span>
            <span className="stat-label">Likes</span>
          </div>
        </div>

      </div>

      <div className="profile-main-content">
        {showAvatarSelector && (
          <div className="avatar-selector">
            <h3>Selecciona tu avatar</h3>
            <div className="avatar-grid">
              {AVATAR_OPTIONS.map(({ id, icon: Icon, name }) => (
                <div
                  key={id}
                  className={`avatar-option ${userData.avatarId === id ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(id)}
                >
                  <Icon className="avatar-icon" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="profile-content">
          <UserProgress />
          <Achievements />
        </div>

        {stats.badges.length > 0 && (
          <div className="badges-section">
            <h2>Insignias</h2>
            <div className="badges-grid">
              {stats.badges.map((badge, index) => (
                <div key={index} className="badge-card">
                  <i className={`fas ${badge.icon}`} />
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 