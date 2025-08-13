import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../config/firebase';
import { ref, update, onValue } from 'firebase/database';
import UserProgress from './gamification/UserProgress';
import Achievements from './gamification/Achievements';
import { 
  FaUser, FaComments, FaCommentDots, FaHeart,
  FaUserAstronaut, FaUserNinja, FaUserSecret, FaUserTie,
  FaUserGraduate, FaUserShield, FaUserCog, FaUserAlt,
  FaUserCircle, FaUserCheck, FaArrowUp, FaEdit
} from 'react-icons/fa';
import '../styles/Profile.css';
import EditProfileModal from './profile/EditProfileModal';

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
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    avatarId: 'circle',
    bio: ''
  });
  const [stats, setStats] = useState({ posts: 0, comments: 0, likes: 0, badges: [] });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState('');
  const [toastClosing, setToastClosing] = useState(false);
  const toastTimers = useRef([]);

  useEffect(() => {
    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserData(prev => ({ ...prev, ...data, email: data.email || currentUser.email }));
        } else {
          setUserData(prev => ({ ...prev, email: currentUser.email }));
        }
      });
      const statsRef = ref(database, `users/${currentUser.uid}/stats`);
      onValue(statsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) setStats(data);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.pageYOffset > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getAvatarIcon = (avatarId) => {
    const avatar = AVATAR_OPTIONS.find(opt => opt.id === avatarId);
    return avatar ? avatar.icon : FaUserCircle;
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="error-message">Debes iniciar sesión para ver tu perfil</div>
      </div>
    );
  }

  const CurrentAvatar = getAvatarIcon(userData.avatarId);

  const handleSaved = (data) => {
    setUserData(prev => ({ ...prev, ...data }));
    // Limpiar timers previos
    toastTimers.current.forEach(t => clearTimeout(t));
    toastTimers.current = [];
    setToastClosing(false);
    setProfileSavedMsg('Perfil actualizado exitosamente');
    // Programar cierre animado
    toastTimers.current.push(setTimeout(() => setToastClosing(true), 3200)); // start exit
    toastTimers.current.push(setTimeout(() => { setProfileSavedMsg(''); setToastClosing(false); }, 3600));
  };

  useEffect(() => () => { toastTimers.current.forEach(t => clearTimeout(t)); }, []);

  return (
    <div className="profile-container">
      {/* Toast éxito */}
      {profileSavedMsg && (
        <div className={`profile-toast ${toastClosing ? 'closing' : ''}`} role="status" aria-live="polite">{profileSavedMsg}</div>
      )}
      <div className="profile-sidebar">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <div className="profile-avatar" onClick={() => setEditOpen(true)}>
              <CurrentAvatar className="avatar-icon" />
              <div className="avatar-overlay">
                <FaUser />
                <span>Editar perfil</span>
              </div>
            </div>
          </div>
          <div className="profile-info">
            <h1>{userData.displayName || 'Usuario'}</h1>
            <p className="profile-email">{userData.email}</p>
          </div>
          <button className="edit-profile-trigger" onClick={() => setEditOpen(true)} aria-label="Editar perfil">
            <FaEdit />
            <span>Editar</span>
          </button>
        </div>
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

      {showScrollTop && (
        <button className="profile-scroll-to-top" onClick={scrollToTop} aria-label="Volver arriba">
          <FaArrowUp />
        </button>
      )}

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={userData}
        onSaved={handleSaved}
      />
    </div>
  );
};

export default Profile;