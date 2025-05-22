import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { createUserProfile } from '../../services/firestore';
import '../../styles/Admin.css';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Crear el usuario en Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Actualizar el perfil con el nombre
      await updateProfile(result.user, { displayName: formData.displayName });

      // Crear el perfil del usuario en Firestore
      await createUserProfile(result.user.uid, {
        email: formData.email,
        displayName: formData.displayName,
        role: formData.role,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid
      });

      setSuccess('Usuario creado exitosamente');
      setFormData({
        email: '',
        password: '',
        displayName: '',
        role: 'employee'
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setError('Error al crear el usuario. Verifica los datos e intenta nuevamente.');
    }
    setLoading(false);
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2>Crear Nuevo Usuario</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="displayName">Nombre completo</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico corporativo</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña temporal</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="employee">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            className="admin-button"
            disabled={loading}
          >
            {loading ? 'Creando usuario...' : 'Crear Usuario'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser; 