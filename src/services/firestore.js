import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Perfil de Usuario
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      points: 0,
      level: 1,
      modulesCompleted: [],
      achievements: [],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al crear perfil de usuario:', error);
    throw new Error(`Error al crear perfil: ${error.message}`);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    throw new Error(`Error al obtener perfil: ${error.message}`);
  }
};

export const updateUserProfile = async (userId, data) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    lastUpdated: new Date().toISOString()
  });
};

// Progreso de Módulos
export const updateModuleProgress = async (userId, moduleId, progress) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  
  const moduleProgress = userData.moduleProgress || {};
  moduleProgress[moduleId] = {
    ...moduleProgress[moduleId],
    ...progress,
    lastUpdated: new Date().toISOString()
  };

  await updateDoc(userRef, { moduleProgress });
};

export const getModuleProgress = async (userId, moduleId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  
  return userData?.moduleProgress?.[moduleId] || null;
};

// Evaluaciones
export const saveEvaluationResult = async (userId, evaluationId, result) => {
  try {
    // Primero actualizamos los puntos del usuario
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const userData = userSnap.data();
    const newPoints = (userData?.points || 0) + (result.points || 0);

    // Actualizamos el documento del usuario
    await updateDoc(userRef, {
      points: newPoints,
      lastUpdated: new Date().toISOString()
    });

    // Preparamos los datos de la evaluación
    const evaluationData = {
      userId,
      evaluationId,
      score: result.score || 0,
      points: result.points || 0,
      completed: true,
      correctAnswers: result.correctAnswers || 0,
      incorrectAnswers: result.incorrectAnswers || 0,
      answers: result.answers || [],
      completedAt: new Date().toISOString()
    };

    // Guardamos la evaluación en la colección principal
    const evaluationRef = doc(db, 'evaluations', evaluationId);
    await setDoc(evaluationRef, evaluationData);

    // Guardamos la evaluación en el subdocumento del usuario
    const userEvaluationRef = doc(db, 'users', userId, 'evaluations', evaluationId);
    await setDoc(userEvaluationRef, evaluationData);

    return true;
  } catch (error) {
    console.error('Error al guardar evaluación:', error);
    throw new Error(`Error al guardar evaluación: ${error.message}`);
  }
};

export const getEvaluationResults = async (userId) => {
  try {
    const evaluationsRef = collection(db, 'evaluations');
    const q = query(
      evaluationsRef,
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      orderBy('__name__', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener resultados de evaluación:', error);
    throw error;
  }
};

// Logros
export const unlockAchievement = async (userId, achievement) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  
  const achievements = userData.achievements || [];
  if (!achievements.includes(achievement.id)) {
    achievements.push(achievement.id);
    await updateDoc(userRef, {
      achievements,
      points: (userData.points || 0) + achievement.points,
      lastUpdated: new Date().toISOString()
    });
  }
};

// Ranking
export const getTopUsers = async (limitCount = 10) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('points', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener ranking:', error);
    throw error;
  }
};

// Estadísticas
export const getUserStats = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  
  return {
    totalPoints: userData.points || 0,
    level: userData.level || 1,
    modulesCompleted: userData.modulesCompleted?.length || 0,
    achievementsUnlocked: userData.achievements?.length || 0,
    lastLogin: userData.lastLogin
  };
}; 