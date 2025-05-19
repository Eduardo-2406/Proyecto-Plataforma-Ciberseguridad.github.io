import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { createUserProfile, getUserProfile, updateUserProfile } from '../services/firestore';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function validateInvitationCode(code) {
    try {
      const invitationRef = doc(db, 'invitations', code);
      const invitationSnap = await getDoc(invitationRef);
      
      if (!invitationSnap.exists()) {
        throw new Error('auth/invalid-invitation-code');
      }

      const invitationData = invitationSnap.data();
      if (invitationData.used) {
        throw new Error('auth/invitation-code-used');
      }

      return invitationData;
    } catch (error) {
      throw error;
    }
  }

  async function register(email, password, displayName, invitationCode) {
    try {
      // Validar el código de invitación
      await validateInvitationCode(invitationCode);

      // Crear el usuario
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });

      // Crear el perfil del usuario
      await createUserProfile(result.user.uid, {
        email: result.user.email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        invitationCode: invitationCode // Guardar el código de invitación usado
      });

      // Marcar el código de invitación como usado
      const invitationRef = doc(db, 'invitations', invitationCode);
      await updateDoc(invitationRef, {
        used: true,
        usedBy: result.user.uid,
        usedAt: new Date().toISOString()
      });

      return result;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(result.user.uid);
      
      if (!profile) {
        await createUserProfile(result.user.uid, {
          email: result.user.email,
          displayName: result.user.displayName || email.split('@')[0]
        });
      } else {
        await updateUserProfile(result.user.uid, {
          lastLogin: new Date().toISOString()
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error(getErrorMessage(error.code));
    }
  }

  function logout() {
    return signOut(auth);
  }

  function getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido';
      case 'auth/operation-not-allowed':
        return 'El registro no está habilitado';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo electrónico';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/invalid-invitation-code':
        return 'Código de invitación inválido';
      case 'auth/invitation-code-used':
        return 'Este código de invitación ya ha sido utilizado';
      default:
        return 'Error al crear la cuenta. Intenta nuevamente.';
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 