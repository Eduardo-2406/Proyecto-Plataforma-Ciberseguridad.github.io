import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  updateModuleProgress,
  getModuleProgress,
  saveEvaluationResult,
  getEvaluationResults,
  unlockAchievement,
  getTopUsers,
  getUserStats,
  saveVideoProgress,
  saveQuizResult,
  syncUserData
} from '../services/firestore';
import { evaluationsData } from '../data/evaluations';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';

const ProgressContext = createContext();

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }) {
  const { currentUser, userProfile } = useAuth();
  const [moduleProgress, setModuleProgress] = useState({});
  const [evaluationResults, setEvaluationResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar progreso inicial
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    } else {
      setModuleProgress({});
      setEvaluationResults([]);
      setStats(null);
      setTopUsers([]);
      setLoading(false);
    }
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Sincronizar datos al cargar
      await syncUserData(currentUser.uid);
      
      // Cargar progreso de módulos con datos completos (siempre 1-based)
      const progress = {};
      for (let i = 1; i <= 6; i++) {
        try {
          progress[i] = await getModuleProgress(currentUser.uid, i);
        } catch (moduleError) {
          console.error(`Error al cargar módulo ${i}:`, moduleError);
          progress[i] = null;
        }
      }

      // No normalizar a 0-based, mantener 1-based
      setModuleProgress(progress);

      // Cargar resultados de evaluaciones
      try {
        const results = await getEvaluationResults(currentUser.uid);
        setEvaluationResults(results);
      } catch (evalError) {
        console.error('Error al cargar evaluaciones:', evalError);
        setEvaluationResults([]);
      }

      // Cargar estadísticas completas
      try {
        const userStats = await getUserStats(currentUser.uid);
        setStats(userStats);
        // Comprobar logros globales basados en módulos completados
        try {
          await checkGlobalAchievements(userStats);
        } catch (err) {
          console.error('Error al comprobar logros globales:', err);
        }
      } catch (statsError) {
        console.error('Error al cargar estadísticas:', statsError);
        setStats(null);
      }

      // Cargar ranking
      try {
        const top = await getTopUsers(10);
        // Enrich top users with displayName from Realtime DB when Firestore doc lacks a name
        const enriched = await Promise.all(top.map(async (u) => {
          try {
            const userRef = ref(database, `users/${u.id}`);
            const snap = await get(userRef);
            const data = snap.exists() ? snap.val() : {};
            const rtDisplayName = data.displayName || data.name || (data.email ? data.email.split('@')[0] : null);
            // If RTDB has a displayName, prefer it (override Firestore value)
            if (rtDisplayName) {
              return { ...u, displayName: rtDisplayName };
            }

            return u;
          } catch (err) {
            return u;
          }
        }));
        setTopUsers(enriched);
      } catch (rankingError) {
        console.error('Error al cargar ranking:', rankingError);
        setTopUsers([]);
      }
    } catch (error) {
      console.error('Error general al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (moduleId, progress) => {
    if (!currentUser) return;

    try {
      await updateModuleProgress(currentUser.uid, moduleId, progress);
      setModuleProgress(prev => ({
        ...prev,
        [moduleId]: progress
      }));

      // Verificar logros
      checkAchievements(moduleId, progress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const saveEvaluation = async (evaluationId, result) => {
    if (!currentUser) return;

    try {
      await saveEvaluationResult(currentUser.uid, evaluationId, result);
      setEvaluationResults(prev => [result, ...prev]);
      
      // Actualizar estadísticas
      const newStats = await getUserStats(currentUser.uid);
      setStats(newStats);

      // Desbloquear logro de puntuación perfecta si aplica
      if (Number(result.score) === 100) {
        try {
          await unlockAchievement(currentUser.uid, {
            id: 'perfect_score',
            title: 'Puntuación Perfecta',
            description: 'Obtuviste 100% en una evaluación',
            points: 200
          });
        } catch (err) {
          console.error('Error unlocking perfect_score after evaluation save', err);
        }
      }
      try {
        await checkGlobalAchievements(newStats);
      } catch (err) {
        console.error('Error checking global achievements after saveEvaluation', err);
      }

      // Actualizar ranking
      const newTop = await getTopUsers();
      try {
        const enrichedTop = await Promise.all(newTop.map(async (u) => {
          try {
            const userRef = ref(database, `users/${u.id}`);
            const snap = await get(userRef);
            const data = snap.exists() ? snap.val() : {};
            const rtDisplayName = data.displayName || data.name || (data.email ? data.email.split('@')[0] : null);
            if (rtDisplayName) return { ...u, displayName: rtDisplayName };
            return u;
          } catch (err) {
            return u;
          }
        }));
        setTopUsers(enrichedTop);
      } catch (err) {
        setTopUsers(newTop);
      }
    } catch (error) {
      console.error('Error saving evaluation:', error);
    }
  };

  const checkAchievements = async (moduleId, progress) => {
    if (!currentUser) return;

    const achievements = [
      {
        id: 'first_module',
        title: 'Primer Módulo',
        description: 'Completaste tu primer módulo',
        points: 100,
        condition: () => progress.completed
      },
      {
        id: 'perfect_score',
        title: 'Puntuación Perfecta',
        description: 'Obtuviste 100% en una evaluación',
        points: 200,
        condition: () => progress.score === 100
      },
      {
        id: 'fast_learner',
        title: 'Aprendiz Rápido',
        description: 'Completaste un módulo en menos de 30 minutos',
        points: 150,
        condition: () => {
          const startTime = new Date(progress.startTime);
          const endTime = new Date(progress.completedAt);
          return (endTime - startTime) < 30 * 60 * 1000;
        }
      }
    ];

    for (const achievement of achievements) {
      if (achievement.condition()) {
        await unlockAchievement(currentUser.uid, achievement);
      }
    }
  };

    // Comprobar logros globales basados en estadísticas
    const checkGlobalAchievements = async (userStats) => {
      if (!currentUser || !userStats) return;

      const modulesCompleted = userStats.modulesCompleted || 0;

      const globalAchievements = [
        {
          id: 'complete_3_modules',
          title: 'Completar 3 Módulos',
          description: 'Completaste 3 módulos',
          points: 300,
          condition: () => modulesCompleted >= 3
        },
        {
          id: 'complete_6_modules',
          title: 'Completar 6 Módulos',
          description: 'Completaste 6 módulos',
          points: 600,
          condition: () => modulesCompleted >= 6
        }
  ,
      {
        id: 'evaluation_expert',
        title: 'Experto en Evaluaciones',
        description: 'Completaste todas las evaluaciones',
        points: 300,
        condition: () => {
          const totalEvals = userStats?.totalAvailableEvals || 0;
          const completedEvals = (userStats?.evaluationResults || []).filter(r => r.completed || typeof r.score === 'number').length;
          return totalEvals > 0 && completedEvals >= totalEvals;
        }
      },
      {
        id: 'consistent_learner',
        title: 'Aprendiz Consistente',
        description: 'Accediste a la plataforma durante 7 días seguidos',
        points: 250,
        condition: () => {
          const streak = Number(userStats?.consecutiveDays ?? userStats?.streak ?? 0);
          return streak >= 7;
        }
      }
      ];

      for (const achievement of globalAchievements) {
        if (achievement.condition()) {
          try {
            await unlockAchievement(currentUser.uid, achievement);
          } catch (err) {
            console.error('Error unlocking global achievement', achievement.id, err);
          }
        }
      }
    };

  // Función para registrar video visto
  const recordVideoProgress = async (moduleId, videoId) => {
    if (!currentUser) return;

    try {
      const result = await saveVideoProgress(currentUser.uid, moduleId, videoId);
      
      // Recargar datos si se obtuvieron puntos
      if (result.points > 0) {
        await loadUserData();
      }
      
      return result;
    } catch (error) {
      console.error('Error recording video progress:', error);
      throw error;
    }
  };

  // Función para registrar resultado de quiz
  const recordQuizResult = async (moduleId, score, attemptNumber) => {
    if (!currentUser) {
      console.warn('recordQuizResult: No currentUser available. Aborting saveQuizResult.', { moduleId, score, attemptNumber });
      throw new Error('User not authenticated');
    }

    try {
      const result = await saveQuizResult(currentUser.uid, moduleId, score, attemptNumber);
      
      // Recargar datos si hubo mejora
      if (result.improved) {
        await loadUserData();
      }
      
      return result;
    } catch (error) {
      console.error('Error recording quiz result:', error);
      throw error;
    }
  };

  // Función para sincronizar datos
  const syncData = async () => {
    if (!currentUser) return;

    try {
      const result = await syncUserData(currentUser.uid);
      await loadUserData(); // Recargar después de sincronizar
      return result;
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  };

  const value = {
    moduleProgress,
    evaluationResults,
    stats,
    topUsers,
    loading,
    updateProgress,
    saveEvaluation,
    recordVideoProgress,
    recordQuizResult,
    syncData,
    loadUserData
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
} 