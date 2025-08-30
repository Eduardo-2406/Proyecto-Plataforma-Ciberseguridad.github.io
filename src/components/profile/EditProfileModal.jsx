import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { updateProfile } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { database } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../services/firestore';
import { 
  FaUserAstronaut, FaUserNinja, FaUserSecret, FaUserTie,
  FaUserGraduate, FaUserShield, FaUserCog, FaUserAlt,
  FaUserCircle, FaUserCheck, FaTimes
} from 'react-icons/fa';
import '../../styles/EditProfileModal.css';

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

const EditProfileModal = ({ isOpen, onClose, initialData, onSaved }) => {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ displayName: '', avatarId: 'circle' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const reduce = useReducedMotion();
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        displayName: initialData.displayName || '',
        avatarId: initialData.avatarId || 'circle'
      });
      setError('');
      setSuccess('');
      // Solo hacer focus en desktop (pantallas grandes)
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) {
        setTimeout(() => { firstFieldRef.current && firstFieldRef.current.focus(); }, 10);
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAvatarSelect = (id) => setForm(f => ({ ...f, avatarId: id }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile(currentUser, { displayName: form.displayName });
      const userRef = ref(database, `users/${currentUser.uid}`);
      await update(userRef, { displayName: form.displayName, avatarId: form.avatarId });
      // Also update Firestore users document so ranking (which reads from Firestore) gets the new name
      try {
        await updateUserProfile(currentUser.uid, { displayName: form.displayName, avatarId: form.avatarId });
      } catch (fireErr) {
        console.warn('No se pudo actualizar Firestore user profile:', fireErr);
      }
      setSuccess('Guardado correctamente');
      onSaved && onSaved(form);
      onClose();
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar.');
    } finally {
      setLoading(false);
    }
  };

  const escListener = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => { if (isOpen) { window.addEventListener('keydown', escListener); return () => window.removeEventListener('keydown', escListener); } }, [isOpen, escListener]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay edit-profile-overlay fast-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.12, ease: 'linear' }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="modal-content edit-profile-modal fast-modal"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.15, ease: 'linear' }}
          >
            <button className="close-button" onClick={onClose} aria-label="Cerrar"><FaTimes /></button>
            <h2 className="single-title">Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="edit-profile-form single-mode">
              <div className="form-row">
                <label>Nombre</label>
                <input
                  ref={firstFieldRef}
                  name="displayName"
                  type="text"
                  value={form.displayName}
                  onChange={handleChange}
                  required
                  maxLength={40}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="avatar-block">
                <div className="avatar-grid-modal single-scroll">
                  {AVATAR_OPTIONS.map(({ id, icon: Icon, name }) => (
                    <div
                      key={id}
                      className={`avatar-choice ${form.avatarId === id ? 'selected' : ''}`}
                      onClick={() => handleAvatarSelect(id)}
                      role="button"
                      aria-label={`Seleccionar avatar ${name}`}
                      tabIndex={0}
                      onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); handleAvatarSelect(id);} }}
                    >
                      <Icon className="avatar-icon" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-feedback">
                {error && <div className="error-message" style={{marginTop:'0.25rem'}}>{error}</div>}
                {success && <div className="success-message" style={{marginTop:'0.25rem'}}>{success}</div>}
              </div>
              <div className="edit-modal-actions sticky-actions">
                <button type="button" className="secondary-btn" onClick={onClose}>Cancelar</button>
                <button type="submit" className="primary-btn" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
