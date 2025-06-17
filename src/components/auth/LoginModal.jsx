import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/Logo.png';
import '../../styles/LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempted(true);
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      onClose();
    } catch (error) {
      setError('Credenciales inválidas. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar error y estado de intento al abrir/cerrar modal
  React.useEffect(() => {
    if (isOpen) {
      setError('');
      setAttempted(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button className="close-button" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-container">
              <div className="login-section">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="email">Correo Electrónico</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="password">Contraseña</label>
                  </div>
                  {attempted && error && (
                    <label className="login-error-label" aria-live="polite" style={{color:'#c53030',fontWeight:500,marginBottom:'0.7rem',fontSize:'1.05rem',display:'block',textAlign:'center'}}>
                      Correo o contraseña incorrectos.
                    </label>
                  )}
                  <button 
                    type="submit" 
                    className="login-button"
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </button>
                </form>
              </div>
              <div className="logo-section">
                <img 
                  src={logo} 
                  alt="Logo de la Empresa" 
                  className="company-logo"
                />
                <h3>Plataforma de Ciberseguridad</h3>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;