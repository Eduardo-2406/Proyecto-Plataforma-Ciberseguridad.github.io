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
  limit,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { ref, set, get, update } from 'firebase/database';
import { database } from '../config/firebase';
import { evaluationsData } from '../data/evaluations';

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

// Progreso de Módulos - Mejorado
export const updateModuleProgress = async (userId, moduleId, progress) => {
  try {
    // Actualizar en Firestore
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() || {};
    
    const moduleProgress = userData.moduleProgress || {};
    moduleProgress[moduleId] = {
      ...moduleProgress[moduleId],
      ...progress,
      lastUpdated: new Date().toISOString()
    };

    // Calcular puntos totales desde todos los módulos
    let totalPoints = userData.points || 0;
    
    // Actualizar documento del usuario
    await updateDoc(userRef, { 
      moduleProgress,
      lastUpdated: new Date().toISOString()
    });

    // También actualizar en Realtime Database para compatibilidad
    const moduleProgressRef = ref(database, `moduleProgress/${userId}/${moduleId}`);
    const userProgressRef = ref(database, `users/${userId}/progress/${moduleId}`);
    
    await Promise.all([
      set(moduleProgressRef, {
        ...progress,
        lastUpdated: Date.now()
      }),
      set(userProgressRef, {
        ...progress,
        lastUpdated: Date.now()
      })
    ]);

    return true;
  } catch (error) {
    console.error('Error updating module progress:', error);
    throw error;
  }
};

export const getModuleProgress = async (userId, moduleId) => {
  try {
    // Intentar desde Firestore primero
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    
    let firestoreProgress = userData?.moduleProgress?.[moduleId] || null;
    
    // Si no hay datos en Firestore, buscar en Realtime Database
    if (!firestoreProgress) {
      const moduleProgressRef = ref(database, `moduleProgress/${userId}/${moduleId}`);
      const snapshot = await get(moduleProgressRef);
      
      if (snapshot.exists()) {
        firestoreProgress = snapshot.val();
      }
    }
    
    // También obtener datos de quizzes y videos desde Realtime Database
    const [quizAttemptsRef, bestScoreRef, videoProgressRef] = [
      ref(database, `quizAttempts/${userId}/${moduleId}`),
      ref(database, `bestQuizScores/${userId}/${moduleId}`),
      ref(database, `videoProgress/${userId}/${moduleId}`)
    ];
    
    const [quizSnapshot, bestScoreSnapshot, videoSnapshot] = await Promise.all([
      get(quizAttemptsRef),
      get(bestScoreRef),
      get(videoProgressRef)
    ]);
    
    const combinedProgress = {
      ...firestoreProgress,
      quizAttempts: quizSnapshot.exists() ? Object.keys(quizSnapshot.val()).length : 0,
      bestQuizScore: bestScoreSnapshot.exists() ? bestScoreSnapshot.val().score : 0,
      videosWatched: videoSnapshot.exists() ? Object.keys(videoSnapshot.val()).length : 0,
      videoProgress: videoSnapshot.exists() ? videoSnapshot.val() : {}
    };
    
    return combinedProgress;
  } catch (error) {
    console.error('Error getting module progress:', error);
    return null;
  }
};

// Evaluaciones - Mejorado
export const saveEvaluationResult = async (userId, evaluationId, result) => {
  try {
    const batch = writeBatch(db);
    
    // Obtener datos actuales del usuario
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const userData = userSnap.data();
    const currentPoints = userData?.points || 0;
    const evaluationPoints = result.points || Math.floor((result.score / 100) * 50);
    
    // Preparar datos completos de la evaluación
    const evaluationData = {
      userId,
      evaluationId,
      score: result.score || 0,
      points: evaluationPoints,
      completed: true,
      correctAnswers: result.correctAnswers || 0,
      incorrectAnswers: result.incorrectAnswers || 0,
      totalQuestions: result.totalQuestions || 0,
      answers: result.answers || [],
      timeSpent: result.timeSpent || 0,
      completedAt: new Date().toISOString(),
      passingScore: result.passingScore || 80,
      passed: (result.score || 0) >= (result.passingScore || 80),
      attempts: result.attempts || 1
    };

    // Actualizar puntos del usuario
    const newTotalPoints = currentPoints + evaluationPoints;
    
    // Actualizar evaluaciones del usuario
    const userEvaluations = userData.evaluations || {};
    userEvaluations[evaluationId] = evaluationData;
    
    // Actualizar usuario en Firestore
    batch.update(userRef, {
      points: newTotalPoints,
      evaluations: userEvaluations,
      lastUpdated: new Date().toISOString()
    });

    // Guardar en colección principal de evaluaciones
    const evaluationRef = doc(db, 'evaluations', `${userId}_${evaluationId}_${Date.now()}`);
    batch.set(evaluationRef, evaluationData);

    // Guardar en subdocumento del usuario
    const userEvaluationRef = doc(db, 'users', userId, 'evaluations', evaluationId);
    batch.set(userEvaluationRef, evaluationData);

    await batch.commit();

    // Actualizar Realtime Database
    const updates = {};
    updates[`users/${userId}/evaluationProgress/${evaluationId}`] = {
      completed: true,
      score: result.score || 0,
      points: evaluationPoints,
      passed: evaluationData.passed,
      timeSpent: result.timeSpent || 0,
      lastUpdated: Date.now()
    };
    updates[`users/${userId}/points`] = newTotalPoints;
    updates[`users/${userId}/lastUpdated`] = Date.now();
    
    await update(ref(database), updates);

    return { success: true, points: evaluationPoints, totalPoints: newTotalPoints };
  } catch (error) {
    console.error('Error al guardar evaluación:', error);
    throw new Error(`Error al guardar evaluación: ${error.message}`);
  }
};

export const getEvaluationResults = async (userId) => {
  try {
    // Obtener desde subdocumentos del usuario primero
    const userEvaluationsRef = collection(db, 'users', userId, 'evaluations');
    const userEvaluationsQuery = query(
      userEvaluationsRef,
      orderBy('completedAt', 'desc')
    );
    
    const userQuerySnapshot = await getDocs(userEvaluationsQuery);
    let userEvaluations = userQuerySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Si no hay datos, buscar en colección principal
    if (userEvaluations.length === 0) {
      const evaluationsRef = collection(db, 'evaluations');
      const mainQuery = query(
        evaluationsRef,
        where('userId', '==', userId),
        orderBy('completedAt', 'desc')
      );
      
      const mainQuerySnapshot = await getDocs(mainQuery);
      userEvaluations = mainQuerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    // También obtener desde Realtime Database como respaldo
    const realtimeEvaluationsRef = ref(database, `users/${userId}/evaluationProgress`);
    const realtimeSnapshot = await get(realtimeEvaluationsRef);
    
    if (realtimeSnapshot.exists()) {
      const realtimeData = realtimeSnapshot.val();
      const realtimeEvaluations = Object.entries(realtimeData).map(([evalId, data]) => ({
        id: evalId,
        evaluationId: evalId,
        ...data,
        completedAt: data.lastUpdated ? new Date(data.lastUpdated).toISOString() : new Date().toISOString()
      }));

      // Combinar y eliminar duplicados
      const combinedEvaluations = [...userEvaluations];
      realtimeEvaluations.forEach(realtimeEval => {
        const exists = combinedEvaluations.find(evaluation => evaluation.evaluationId === realtimeEval.evaluationId);
        if (!exists) {
          combinedEvaluations.push(realtimeEval);
        }
      });

      return combinedEvaluations.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    }

    return userEvaluations;
  } catch (error) {
    console.error('Error al obtener resultados de evaluación:', error);
    return [];
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

// Estadísticas mejoradas
export const getUserStats = async (userId) => {
  try {
    // Obtener datos del usuario desde Firestore
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() || {};
    
    // Obtener evaluaciones completadas
    const evaluationResults = await getEvaluationResults(userId);
    
    // Obtener datos desde Realtime Database
    const [userProgressRef, moduleProgressRef, quizAttemptsRef, videoProgressRef] = [
      ref(database, `users/${userId}`),
      ref(database, `moduleProgress/${userId}`),
      ref(database, `quizAttempts/${userId}`),
      ref(database, `videoProgress/${userId}`)
    ];
    
    const [userSnapshot, moduleSnapshot, quizSnapshot, videoSnapshot] = await Promise.all([
      get(userProgressRef),
      get(moduleProgressRef), 
      get(quizAttemptsRef),
      get(videoProgressRef)
    ]);
    
    const realtimeUserData = userSnapshot.exists() ? userSnapshot.val() : {};
    const moduleProgressData = moduleSnapshot.exists() ? moduleSnapshot.val() : {};
    const quizAttemptsData = quizSnapshot.exists() ? quizSnapshot.val() : {};
    const videoProgressData = videoSnapshot.exists() ? videoSnapshot.val() : {};
    
    // Combinar progreso de módulos
    const combinedModuleProgress = { 
      ...moduleProgressData, 
      ...(userData.moduleProgress || {}) 
    };
    
    // Calcular estadísticas
    const modulesCompleted = Object.values(combinedModuleProgress).filter(module => module?.completed).length;
    const totalModules = 6;
    
    const evaluationsCompleted = evaluationResults.filter(evaluation => evaluation.completed).length;
    const averageScore = evaluationResults.length > 0 
      ? evaluationResults.reduce((sum, evaluation) => sum + (evaluation.score || 0), 0) / evaluationResults.length 
      : 0;
    
    // Calcular videos vistos por módulo
    let totalVideosWatched = 0;
    Object.keys(videoProgressData).forEach(moduleId => {
      const moduleVideos = videoProgressData[moduleId];
      if (moduleVideos) {
        totalVideosWatched += Object.keys(moduleVideos).length;
      }
    });
    
    // Calcular quizzes pasados
    const quizzesPassed = Object.keys(quizAttemptsData).filter(moduleId => {
      const moduleAttempts = quizAttemptsData[moduleId];
      if (moduleAttempts) {
        const attempts = Object.values(moduleAttempts);
        return attempts.some(attempt => attempt.score >= 80);
      }
      return false;
    }).length;
    
    // Calcular puntos totales
    const firestorePoints = userData.points || 0;
    const realtimePoints = realtimeUserData.points || 0;
    const calculatedPoints = 
      (modulesCompleted * 50) + // Puntos por módulos completados
      (totalVideosWatched * 10) + // Puntos por videos
      (quizzesPassed * 30) + // Puntos por quizzes aprobados
      evaluationResults.reduce((sum, evaluation) => sum + (evaluation.points || 0), 0); // Puntos de evaluaciones
    
    const totalPoints = Math.max(firestorePoints, realtimePoints, calculatedPoints);
    
    // Calcular nivel
    const level = Math.floor(totalPoints / 1000) + 1;
    
    const stats = {
      totalPoints,
      level,
  totalAvailableEvals: evaluationsData ? Object.keys(evaluationsData).length : 0,
      modulesCompleted,
      totalModules,
      moduleCompletionPercentage: (modulesCompleted / totalModules) * 100,
      evaluationsCompleted,
      averageScore: Math.round(averageScore * 100) / 100,
      achievementsUnlocked: userData.achievements?.length || 0,
      lastLogin: userData.lastLogin || userData.lastUpdated,
      moduleProgress: combinedModuleProgress,
      evaluationResults,
      // Estadísticas adicionales detalladas
      videosWatched: totalVideosWatched,
      quizzesPassed,
      totalQuizAttempts: Object.values(quizAttemptsData).reduce((sum, moduleAttempts) => {
        return sum + (moduleAttempts ? Object.keys(moduleAttempts).length : 0);
      }, 0),
      perfectScores: evaluationResults.filter(evaluation => evaluation.score === 100).length,
      passedEvaluations: evaluationResults.filter(evaluation => evaluation.passed).length,
      // Progreso detallado por módulo
      detailedModuleProgress: Object.keys(combinedModuleProgress).map(moduleId => {
        const module = combinedModuleProgress[moduleId];
        const moduleVideos = videoProgressData[moduleId] ? Object.keys(videoProgressData[moduleId]).length : 0;
        const moduleQuizAttempts = quizAttemptsData[moduleId] ? Object.keys(quizAttemptsData[moduleId]).length : 0;
        const bestQuizScore = quizAttemptsData[moduleId] ? 
          Math.max(...Object.values(quizAttemptsData[moduleId]).map(attempt => attempt.score || 0)) : 0;
        
        return {
          moduleId: parseInt(moduleId),
          completed: module?.completed || false,
          videosWatched: moduleVideos,
          quizAttempts: moduleQuizAttempts,
          bestQuizScore,
          quizPassed: bestQuizScore >= 80,
          lastUpdated: module?.lastUpdated
        };

    // Incluir racha/consecutiveDays si existe en Realtime o Firestore
    const consecutiveDays = realtimeUserData?.consecutiveDays ?? userData?.consecutiveDays ?? 0;
    stats.consecutiveDays = consecutiveDays;
      }).sort((a, b) => a.moduleId - b.moduleId)
    };
    
    // Actualizar datos si hay diferencias significativas
    if (Math.abs((userData.points || 0) - totalPoints) > 10) {
      await updateDoc(userRef, {
        points: totalPoints,
        level,
        lastCalculated: new Date().toISOString()
      });
    }
    
    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      totalPoints: 0,
      level: 1,
      modulesCompleted: 0,
      totalModules: 6,
      moduleCompletionPercentage: 0,
      evaluationsCompleted: 0,
      averageScore: 0,
      achievementsUnlocked: 0,
      moduleProgress: {},
      evaluationResults: [],
      videosWatched: 0,
      quizzesPassed: 0,
      totalQuizAttempts: 0,
      perfectScores: 0,
      passedEvaluations: 0,
      detailedModuleProgress: []
    };
  }
}; 

// Función para registrar progreso de video
export const saveVideoProgress = async (userId, moduleId, videoId) => {
  try {
    const videoPoints = 10; // Puntos por ver un video
    
    // Verificar si ya se vio este video para evitar puntos duplicados
    const videoProgressRef = ref(database, `videoProgress/${userId}/${moduleId}/${videoId}`);
    const existingVideo = await get(videoProgressRef);
    
    if (existingVideo.exists()) {
      return { success: true, points: 0, alreadyWatched: true };
    }
    
    // Registrar video como visto
    await set(videoProgressRef, {
      id: videoId,
      watched: true,
      timestamp: Date.now()
    });

    // Actualizar puntos del usuario en Realtime Database
    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.exists() ? userSnapshot.val() : {};
    const newPoints = (userData.points || 0) + videoPoints;
    
    await update(userRef, {
      points: newPoints,
      lastUpdated: Date.now()
    });

    // También actualizar en Firestore
    const firestoreUserRef = doc(db, 'users', userId);
    const firestoreUserSnap = await getDoc(firestoreUserRef);
    
    if (firestoreUserSnap.exists()) {
      const firestoreUserData = firestoreUserSnap.data();
      await updateDoc(firestoreUserRef, {
        points: newPoints,
        lastUpdated: new Date().toISOString()
      });
    }

    return { success: true, points: videoPoints, totalPoints: newPoints };
  } catch (error) {
    console.error('Error saving video progress:', error);
    throw error;
  }
};

// Función para registrar resultado de quiz
export const saveQuizResult = async (userId, moduleId, score, attemptNumber = 1) => {
  try {
    // Ensure we use the authenticated user's UID at write time to comply with Realtime DB rules
    const currentUid = auth?.currentUser?.uid;
    if (!currentUid) {
      console.error('saveQuizResult: No authenticated user available. Aborting save.', { userId, moduleId, score, attemptNumber });
      throw new Error('User not authenticated');
    }

    if (currentUid !== userId) {
      console.warn('saveQuizResult: userId parameter does not match auth.currentUser.uid. Using authenticated uid to write.', { paramUserId: userId, authUid: currentUid });
    }

    const targetUid = currentUid;

    const quizPoints = Math.round((score / 100) * 30); // Máximo 30 puntos por quiz
    const timestamp = Date.now();

    // Use attemptNumber as key when provided so repeated writes for the same attempt overwrite
    const attemptKey = attemptNumber ? String(attemptNumber) : String(timestamp);

    // Guardar intento en Realtime Database usando el uid autenticado
    const attemptRef = ref(database, `quizAttempts/${targetUid}/${moduleId}/${attemptKey}`);
    await set(attemptRef, {
      score,
      points: quizPoints,
      timestamp,
      attemptNumber
    });

    // Verificar si es la mejor puntuación
    const bestScoreRef = ref(database, `bestQuizScores/${targetUid}/${moduleId}`);
    const bestScoreSnapshot = await get(bestScoreRef);
    const currentBestScore = bestScoreSnapshot.exists() ? bestScoreSnapshot.val().score : 0;
    
    let pointsAdded = 0;
    
    if (score > currentBestScore) {
      // Actualizar mejor puntuación
      await set(bestScoreRef, {
        score,
        timestamp
      });
      
      // Calcular puntos a agregar (diferencia entre nueva y anterior mejor puntuación)
      const previousPoints = Math.round((currentBestScore / 100) * 30);
      pointsAdded = quizPoints - previousPoints;
      
      // Actualizar puntos del usuario
      const userRef = ref(database, `users/${targetUid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.exists() ? userSnapshot.val() : {};
      const newPoints = (userData.points || 0) + pointsAdded;
      
      await update(userRef, {
        points: newPoints,
        lastUpdated: timestamp
      });

      // También actualizar en Firestore
      const firestoreUserRef = doc(db, 'users', targetUid);
      const firestoreUserSnap = await getDoc(firestoreUserRef);
      
      if (firestoreUserSnap.exists()) {
        await updateDoc(firestoreUserRef, {
          points: newPoints,
          lastUpdated: new Date().toISOString()
        });
      }
      
      return { success: true, points: pointsAdded, totalPoints: newPoints, improved: true, bestScore: score };
    }

    return { success: true, points: 0, improved: false, bestScore: currentBestScore };
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
};

// Función para sincronizar datos entre bases de datos
export const syncUserData = async (userId) => {
  try {
    // Obtener estadísticas completas
    const stats = await getUserStats(userId);
    
    // Actualizar ambas bases de datos con los datos más actuales
    const userRef = doc(db, 'users', userId);
    const realtimeUserRef = ref(database, `users/${userId}`);
    
    const updateData = {
      points: stats.totalPoints,
      level: stats.level,
      lastSynced: new Date().toISOString()
    };
    
    const realtimeUpdateData = {
      points: stats.totalPoints,
      level: stats.level,
      lastSynced: Date.now()
    };
    
    await Promise.all([
      updateDoc(userRef, updateData),
      update(realtimeUserRef, realtimeUpdateData)
    ]);
    
    return { success: true, syncedPoints: stats.totalPoints, syncedLevel: stats.level };
  } catch (error) {
    console.error('Error syncing user data:', error);
    throw error;
  }
}; 