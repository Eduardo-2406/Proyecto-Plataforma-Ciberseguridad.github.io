import React, { useState, useEffect, Suspense, lazy } from 'react';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedText from './animations/AnimatedText';
import { 
  FaTrophy, FaMedal, FaBook, FaChartLine, 
  FaUserGraduate, FaShieldAlt, FaCrown,
  FaStar, FaAward, FaCheckCircle, FaArrowUp
} from 'react-icons/fa';
import '../styles/Progress.css';
import ProgressSkeleton from './common/ProgressSkeleton';

const PieChart = lazy(() => import('recharts').then(mod => ({ default: mod.PieChart })));
const Pie = lazy(() => import('recharts').then(mod => ({ default: mod.Pie })));
const Cell = lazy(() => import('recharts').then(mod => ({ default: mod.Cell })));
const Tooltip = lazy(() => import('recharts').then(mod => ({ default: mod.Tooltip })));
const Legend = lazy(() => import('recharts').then(mod => ({ default: mod.Legend })));
const ResponsiveContainer = lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })));
const BarChart = lazy(() => import('recharts').then(mod => ({ default: mod.BarChart })));
const Bar = lazy(() => import('recharts').then(mod => ({ default: mod.Bar })));
const CartesianGrid = lazy(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })));
const XAxis = lazy(() => import('recharts').then(mod => ({ default: mod.XAxis })));
const YAxis = lazy(() => import('recharts').then(mod => ({ default: mod.YAxis })));

const Progress = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { currentUser } = useAuth();
  const { stats, moduleProgress, topUsers } = useProgress();

  useEffect(() => {
    if (!currentUser) return;

    const userRef = ref(database, `users/${currentUser.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          setUserData(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos del usuario');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateLevel = (points) => {
    if (points >= 5000) return { name: 'Protector', icon: <FaCrown />, color: '#F59E0B' };
    if (points >= 2000) return { name: 'Defensor', icon: <FaShieldAlt />, color: '#3B82F6' };
    return { name: 'Novato', icon: <FaUserGraduate />, color: '#10B981' };
  };

  const calculateProgressToNextLevel = (points) => {
    const currentLevel = calculateLevel(points);
    const pointsForNextLevel = currentLevel.name === 'Novato' ? 2000 :
                              currentLevel.name === 'Defensor' ? 5000 : 10000;
    const pointsInCurrentLevel = points % pointsForNextLevel;
    return (pointsInCurrentLevel / pointsForNextLevel) * 100;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const moduleData = Object.entries(moduleProgress || {}).map(([id, progress]) => ({
    name: `Módulo ${parseInt(id) + 1}`,
    value: progress?.score || 0,
    status: progress?.completed ? 'Completado' : progress?.started ? 'En Progreso' : 'No Iniciado',
  }));

  const progressData = [
    { name: 'Ene', puntos: 0 },
    { name: 'Feb', puntos: 500 },
    { name: 'Mar', puntos: 1200 },
    { name: 'Abr', puntos: 1800 },
    { name: 'May', puntos: 2500 },
    { name: 'Jun', puntos: 3200 }
  ];

  if (loading) {
    return <ProgressSkeleton />;
  }

  if (error) return (
    <motion.div 
      className="error-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {error}
    </motion.div>
  );

  if (!userData) return (
    <motion.div 
      className="no-data-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      No se encontraron datos del usuario
    </motion.div>
  );

  const userLevel = calculateLevel(userData.points || 0);
  const progressToNextLevel = calculateProgressToNextLevel(userData.points || 0);

  const evaluationResults = userData.evaluationResults || [];
  const evaluationData = evaluationResults.map((result, index) => ({
    name: `Evaluación ${index + 1}`,
    value: result.score || 0,
    completed: result.completed || false
  }));

  return (
    <div className="progress-container">
      {!loading && (
        <motion.div 
          className="progress-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          <div className="progress-content">
            <AnimatedText 
              text="Mi Progreso" 
              className="animated-title"
              type="h1" 
            />
            <motion.div 
              className="progress-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="progress-stats-grid">
                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="stat-icon-container">
                    <FaChartLine className="stat-icon" />
                  </div>
                  <h3>Puntos Totales</h3>
                  <p>{userData.points || 0}</p>
                </motion.div>

                <motion.div 
                  className="stat-card level-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="level-info">
                    <span className="level-icon" style={{ color: userLevel.color }}>
                      {userLevel.icon}
                    </span>
                    <span className="level-name">{userLevel.name}</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNextLevel}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="progress-text">
                    {Math.round(progressToNextLevel)}% al siguiente nivel
                  </p>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="stat-icon-container">
                    <FaTrophy className="stat-icon" />
                  </div>
                  <h3>Evaluaciones Completadas</h3>
                  <p>{evaluationResults.filter(r => r.completed).length}</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="progress-charts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="chart-container">
                <h2>Progreso de Evaluaciones</h2>
                <Suspense fallback={<div className="chart-skeleton" />}> 
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={evaluationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {evaluationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Suspense>
              </div>

              <div className="chart-container">
                <h2>Progreso Mensual</h2>
                <Suspense fallback={<div className="chart-skeleton" />}> 
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="puntos" 
                        fill="#8884d8"
                        name="Puntos"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Suspense>
              </div>
            </motion.div>

            <motion.div 
              className="achievements-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2>Logros</h2>
              <div className="achievements-grid">
                {stats?.achievements?.map((achievement, index) => (
                  <motion.div 
                    key={index}
                    className="achievement-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="achievement-icon">
                      <FaAward />
                    </div>
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                    <span className="achievement-points">+{achievement.points} puntos</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="ranking-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2>Tu Posición en el Ranking</h2>
              <div className="ranking-card">
                {topUsers.findIndex(user => user.id === currentUser?.uid) !== -1 ? (
                  <div className="user-rank-info">
                    <span className="rank-position">
                      #{topUsers.findIndex(user => user.id === currentUser?.uid) + 1}
                    </span>
                    <span className="user-points">{userData.points} puntos</span>
                  </div>
                ) : (
                  <p>Completa más evaluaciones para aparecer en el ranking</p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Progress;