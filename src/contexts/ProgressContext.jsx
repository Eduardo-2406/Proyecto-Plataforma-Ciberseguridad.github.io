import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  updateModuleProgress,
  getModuleProgress,
  saveEvaluationResult,
  getEvaluationResults,
  unlockAchievement,
  getTopUsers,
  getUserStats
} from '../services/firestore';

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
      // Cargar progreso de módulos
      const progress = {};
      for (let i = 0; i < 6; i++) {
        try {
          progress[i] = await getModuleProgress(currentUser.uid, i);
        } catch (moduleError) {
          console.error(`Error al cargar módulo ${i}:`, moduleError);
          progress[i] = null;
        }
      }
      setModuleProgress(progress);

      // Cargar resultados de evaluaciones
      try {
        const results = await getEvaluationResults(currentUser.uid);
        setEvaluationResults(results);
      } catch (evalError) {
        console.error('Error al cargar evaluaciones:', evalError);
        setEvaluationResults([]);
      }

      // Cargar estadísticas
      try {
        const userStats = await getUserStats(currentUser.uid);
        setStats(userStats);
      } catch (statsError) {
        console.error('Error al cargar estadísticas:', statsError);
        setStats(null);
      }

      // Cargar ranking
      try {
        const top = await getTopUsers(10); // Especificamos explícitamente el límite
        setTopUsers(top);
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

      // Actualizar ranking
      const newTop = await getTopUsers();
      setTopUsers(newTop);
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

  const value = {
    moduleProgress,
    evaluationResults,
    stats,
    topUsers,
    loading,
    updateProgress,
    saveEvaluation
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
} 