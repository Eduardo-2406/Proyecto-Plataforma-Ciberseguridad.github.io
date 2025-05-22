import { create } from 'zustand';

const useStore = create((set) => ({
  // Estado del usuario
  user: null,
  points: 0,
  level: 'Novato',
  badges: [],
  completedModules: [],
  completedQuizzes: [],
  weeklyChallenges: [],

  // Funciones para actualizar el estado
  setUser: (user) => set({ user }),
  addPoints: (points) => set((state) => {
    const newPoints = state.points + points;
    let newLevel = state.level;
    
    // Actualizar nivel basado en puntos
    if (newPoints >= 500) {
      newLevel = 'Protector';
    } else if (newPoints >= 200) {
      newLevel = 'Defensor';
    } else {
      newLevel = 'Novato';
    }

    return { points: newPoints, level: newLevel };
  }),
  addBadge: (badge) => set((state) => ({
    badges: [...state.badges, badge]
  })),
  completeModule: (moduleId) => set((state) => ({
    completedModules: [...state.completedModules, moduleId]
  })),
  completeQuiz: (quizId) => set((state) => ({
    completedQuizzes: [...state.completedQuizzes, quizId]
  })),
  addWeeklyChallenge: (challenge) => set((state) => ({
    weeklyChallenges: [...state.weeklyChallenges, challenge]
  })),

  // Estado del ranking
  ranking: [],
  updateRanking: (ranking) => set({ ranking }),

  // Estado del foro
  forumPosts: [],
  addForumPost: (post) => set((state) => ({
    forumPosts: [...state.forumPosts, post]
  })),
}));

export default useStore; 