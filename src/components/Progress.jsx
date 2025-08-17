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
  FaStar, FaAward, FaCheckCircle, FaArrowUp,
  FaFire, FaBullseye, FaRocket, FaBolt, FaGem,
  FaUsers, FaCalendarAlt, FaChartBar
} from 'react-icons/fa';
import '../styles/Progress.css';
import ProgressSkeleton from './common/ProgressSkeleton';

// Recharts components con lazy loading
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
const LineChart = lazy(() => import('recharts').then(mod => ({ default: mod.LineChart })));
const Line = lazy(() => import('recharts').then(mod => ({ default: mod.Line })));
const Area = lazy(() => import('recharts').then(mod => ({ default: mod.Area })));
const AreaChart = lazy(() => import('recharts').then(mod => ({ default: mod.AreaChart })));
const RadialBarChart = lazy(() => import('recharts').then(mod => ({ default: mod.RadialBarChart })));
const RadialBar = lazy(() => import('recharts').then(mod => ({ default: mod.RadialBar })));

const Progress = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { currentUser } = useAuth();
  const { stats, moduleProgress, topUsers, evaluationResults, loadUserData, syncData } = useProgress();

  // Función para sincronizar datos manualmente
  const handleSyncData = async () => {
    try {
      setLoading(true);
      await syncData();
      console.log('Datos sincronizados correctamente');
    } catch (error) {
      console.error('Error al sincronizar datos:', error);
      setError('Error al sincronizar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    // Usar principalmente los datos del ProgressContext
    if (stats) {
      setUserData({
        points: stats.totalPoints,
        level: stats.level,
        evaluationResults: stats.evaluationResults || [],
        moduleProgress: stats.moduleProgress || {},
        videosWatched: stats.videosWatched || 0,
        quizzesPassed: stats.quizzesPassed || 0,
        detailedModuleProgress: stats.detailedModuleProgress || []
      });
      setLoading(false);
    } else {
      // Fallback a Realtime Database si no hay datos en stats
      const userRef = ref(database, `users/${currentUser.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            setUserData({
              ...data,
              evaluationResults: evaluationResults || [],
              moduleProgress: moduleProgress || {}
            });
          }
          setLoading(false);
        } catch (error) {
          console.error('Error al cargar datos:', error);
          setError('Error al cargar los datos del usuario');
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser, stats, moduleProgress, evaluationResults]);

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

  // Función para generar logros dinámicos
  const generateAchievements = (userData) => {
    const achievements = [];
    const points = userData?.points || 0;
    const videosWatched = userData?.videosWatched || 0;
    const quizzesPassed = userData?.quizzesPassed || 0;
    const evaluationResults = userData?.evaluationResults || [];

    if (points >= 100) {
      achievements.push({
        title: "Primer Paso",
        description: "Obtuviste tus primeros 100 puntos",
        icon: <FaStar />,
        points: 50,
        color: "#10B981",
        unlocked: true
      });
    }

    if (points >= 500) {
      achievements.push({
        title: "En Racha",
        description: "Acumulaste 500 puntos",
        icon: <FaFire />,
        points: 100,
        color: "#F59E0B",
        unlocked: true
      });
    }

    if (points >= 1000) {
      achievements.push({
        title: "Especialista",
        description: "Alcanzaste 1000 puntos",
        icon: <FaBullseye />,
        points: 150,
        color: "#3B82F6",
        unlocked: true
      });
    }

    if (videosWatched >= 5) {
      achievements.push({
        title: "Estudiante Dedicado",
        description: "Viste 5 videos completos",
        icon: <FaBook />,
        points: 75,
        color: "#8B5CF6",
        unlocked: true
      });
    }

    if (quizzesPassed >= 3) {
      achievements.push({
        title: "Experto en Quizzes",
        description: "Aprobaste 3 quizzes",
        icon: <FaBolt />,
        points: 100,
        color: "#EF4444",
        unlocked: true
      });
    }

    if (evaluationResults.filter(r => r.passed).length >= 2) {
      achievements.push({
        title: "Evaluador Profesional",
        description: "Aprobaste 2 evaluaciones",
        icon: <FaGem />,
        points: 200,
        color: "#EC4899",
        unlocked: true
      });
    }

    // Logros bloqueados para motivar
    if (points < 2000) {
      achievements.push({
        title: "Defensor Élite",
        description: "Alcanza 2000 puntos",
        icon: <FaShieldAlt />,
        points: 300,
        color: "#6B7280",
        unlocked: false
      });
    }

    if (evaluationResults.filter(r => r.passed).length < 5) {
      achievements.push({
        title: "Maestro de Evaluaciones",
        description: "Aprueba 5 evaluaciones",
        icon: <FaCrown />,
        points: 500,
        color: "#6B7280",
        unlocked: false
      });
    }

    return achievements;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

  // Datos mejorados de módulos con información detallada
  const moduleData = userData?.detailedModuleProgress?.map((module) => ({
    name: `Módulo ${module.moduleId + 1}`,
    completed: module.completed ? 1 : 0,
    videosWatched: module.videosWatched || 0,
    quizScore: module.bestQuizScore || 0,
    quizPassed: module.quizPassed ? 1 : 0,
    attempts: module.quizAttempts || 0
  })) || Object.entries(moduleProgress || {}).map(([id, progress]) => ({
    name: `Módulo ${parseInt(id) + 1}`,
    completed: progress?.completed ? 1 : 0,
    videosWatched: progress?.videosWatched || 0,
    quizScore: progress?.bestQuizScore || 0,
    quizPassed: (progress?.bestQuizScore || 0) >= 80 ? 1 : 0,
    attempts: progress?.quizAttempts || 0
  }));

  // Datos de evaluaciones con más detalle - Formato mejorado para gráficas modernas
  const evaluationData = (userData?.evaluationResults || []).map((result, index) => ({
    name: `Eval ${index + 1}`,
    score: result.score || 0,
    passed: result.passed || false,
    label: `${result.score || 0}%`,
    fill: result.passed ? '#10B981' : '#EF4444'
  }));

  // Datos para gráfica radial de evaluaciones (más moderna)
  const evaluationRadialData = evaluationData.length > 0 ? evaluationData.map((eval_, index) => ({
    name: eval_.name,
    value: eval_.score,
    fill: eval_.fill
  })) : [];

  // Datos de progreso mensual mejorados con tendencia realista
  const currentMonth = new Date().getMonth();
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  const progressData = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - 5 + i + 12) % 12;
    const factor = Math.min((i + 1) / 6, 1); // Progresión más realista
    
    return {
      month: monthNames[monthIndex],
      puntos: Math.floor((userData?.points || 0) * factor),
      videos: Math.floor((userData?.videosWatched || 0) * factor),
      evaluaciones: Math.floor(evaluationData.length * factor),
      tendencia: Math.floor((userData?.points || 0) * factor * 0.8) // Línea de tendencia
    };
  });

  // Datos para ranking con información más rica
  const rankingData = topUsers.slice(0, 8).map((user, index) => ({
    position: index + 1,
    name: user.name || `Usuario ${index + 1}`,
    points: user.points || 0,
    isCurrentUser: user.id === currentUser?.uid,
    fill: user.id === currentUser?.uid ? '#F59E0B' : '#3B82F6'
  }));

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

  // Datos de estadísticas adicionales
  const additionalStats = [
    { 
      label: 'Videos Vistos', 
      value: userData?.videosWatched || 0,
      icon: <FaBook />,
      color: '#10B981'
    },
    { 
      label: 'Quizzes Aprobados', 
      value: userData?.quizzesPassed || 0,
      icon: <FaCheckCircle />,
      color: '#3B82F6'
    },
    { 
      label: 'Promedio de Puntuación', 
      value: stats?.averageScore ? `${stats.averageScore.toFixed(1)}%` : '0%',
      icon: <FaStar />,
      color: '#F59E0B'
    },
    { 
      label: 'Evaluaciones Aprobadas', 
      value: stats?.passedEvaluations || 0,
      icon: <FaMedal />,
      color: '#8B5CF6'
    }
  ];

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
            
            {/* Botón de sincronización */}
            <motion.div 
              className="sync-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.button
                onClick={handleSyncData}
                className="sync-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                <FaArrowUp />
                {loading ? 'Sincronizando...' : 'Sincronizar Datos'}
              </motion.button>
            </motion.div>
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
                  <p>{(userData?.evaluationResults || []).filter(r => r.completed).length}</p>
                </motion.div>

                {/* Nuevas tarjetas de estadísticas */}
                {additionalStats.map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="stat-icon-container" style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                    <h3>{stat.label}</h3>
                    <p>{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sección de progreso detallado por módulo */}
            <motion.div 
              className="detailed-modules-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2>Progreso Detallado por Módulo</h2>
              <div className="modules-detailed-grid">
                {moduleData.map((module, index) => (
                  <motion.div 
                    key={module.name}
                    className="module-detailed-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="module-header">
                      <h3>{module.name}</h3>
                      <span className={`status-badge ${module.completed ? 'completed' : 'pending'}`}>
                        {module.completed ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="module-stats">
                      <div className="stat-item">
                        <FaBook />
                        <span>Videos: {module.videosWatched}</span>
                      </div>
                      <div className="stat-item">
                        <FaTrophy />
                        <span>Quiz: {module.quizScore}%</span>
                      </div>
                      <div className="stat-item">
                        <FaCheckCircle />
                        <span>Intentos: {module.attempts}</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${module.completed ? 100 : (module.videosWatched > 0 ? 50 : 0)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ 
                          backgroundColor: module.completed ? '#10B981' : 
                                         module.videosWatched > 0 ? '#F59E0B' : '#E5E7EB'
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="progress-charts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {/* Progreso de Evaluaciones - Gráfica Donut Moderna */}
              <div className="modern-chart-container">
                <div className="chart-header">
                  <h2><FaChartBar /> Progreso de Evaluaciones</h2>
                  <p>Puntuaciones de tus evaluaciones completadas</p>
                </div>
                {evaluationData.length > 0 ? (
                  <Suspense fallback={<div className="chart-skeleton" />}>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={evaluationRadialData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={false}
                        >
                          {evaluationRadialData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Puntuación']}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Suspense>
                ) : (
                  <div className="empty-chart">
                    <FaTrophy className="empty-icon" />
                    <p>Completa evaluaciones para ver tu progreso</p>
                  </div>
                )}
              </div>

              {/* Progreso de Módulos - Gráfica de Área Suave */}
              <div className="modern-chart-container">
                <div className="chart-header">
                  <h2><FaBook /> Progreso de Módulos</h2>
                  <p>Tu avance en cada módulo de aprendizaje</p>
                </div>
                {moduleData.length > 0 ? (
                  <Suspense fallback={<div className="chart-skeleton" />}>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={moduleData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="colorVideos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorQuiz" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="videosWatched"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorVideos)"
                          name="Videos Vistos"
                        />
                        <Area
                          type="monotone"
                          dataKey="quizScore"
                          stroke="#10B981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorQuiz)"
                          name="Puntuación Quiz (%)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Suspense>
                ) : (
                  <div className="empty-chart">
                    <FaBook className="empty-icon" />
                    <p>Comienza a estudiar módulos para ver tu progreso</p>
                  </div>
                )}
              </div>

              {/* Progreso Mensual - Línea Suave con Área */}
              <div className="modern-chart-container">
                <div className="chart-header">
                  <h2><FaCalendarAlt /> Progreso Mensual</h2>
                  <p>Tu evolución durante los últimos meses</p>
                </div>
                <Suspense fallback={<div className="chart-skeleton" />}>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="colorPuntos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="puntos"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPuntos)"
                        name="Puntos"
                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Suspense>
              </div>

              {/* Ranking Visual - Gráfica de Barras Horizontal */}
              <div className="modern-chart-container">
                <div className="chart-header">
                  <h2><FaUsers /> Ranking Global</h2>
                  <p>Tu posición entre los mejores estudiantes</p>
                </div>
                {rankingData.length > 0 ? (
                  <Suspense fallback={<div className="chart-skeleton" />}>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={rankingData}
                        layout="horizontal"
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          type="number"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <YAxis 
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                          width={80}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value, name) => [`${value} puntos`, 'Puntuación']}
                        />
                        <Bar 
                          dataKey="points" 
                          radius={[0, 4, 4, 0]}
                          name="Puntos"
                        >
                          {rankingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Suspense>
                ) : (
                  <div className="empty-chart">
                    <FaUsers className="empty-icon" />
                    <p>No hay datos de ranking disponibles</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="achievements-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="section-header">
                <h2><FaAward /> Logros</h2>
                <p>Desbloquea logros completando actividades</p>
              </div>
              <div className="achievements-grid">
                {generateAchievements(userData).map((achievement, index) => (
                  <motion.div 
                    key={index}
                    className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: achievement.unlocked ? 1.02 : 1 }}
                    whileTap={{ scale: achievement.unlocked ? 0.98 : 1 }}
                  >
                    <div 
                      className="achievement-icon"
                      style={{ color: achievement.color }}
                    >
                      {achievement.icon}
                    </div>
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                    <div className="achievement-footer">
                      <span className="achievement-points">
                        +{achievement.points} puntos
                      </span>
                      {achievement.unlocked && (
                        <span className="achievement-status">
                          <FaCheckCircle /> Desbloqueado
                        </span>
                      )}
                    </div>
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
              <div className="section-header">
                <h2><FaUsers /> Tu Posición en el Ranking</h2>
                <p>Compite con otros estudiantes de ciberseguridad</p>
              </div>
              
              {/* Tarjeta de Posición del Usuario */}
              <div className="user-ranking-card">
                {topUsers.findIndex(user => user.id === currentUser?.uid) !== -1 ? (
                  <motion.div 
                    className="user-rank-info"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className="rank-badge">
                      <span className="rank-position">
                        #{topUsers.findIndex(user => user.id === currentUser?.uid) + 1}
                      </span>
                    </div>
                    <div className="rank-details">
                      <h3>Tu Posición</h3>
                      <p className="user-points">{userData.points} puntos</p>
                      <p className="rank-message">
                        {topUsers.findIndex(user => user.id === currentUser?.uid) < 3 
                          ? "¡Estás en el top 3! 🏆" 
                          : topUsers.findIndex(user => user.id === currentUser?.uid) < 10
                          ? "¡Estás en el top 10! 🎖️"
                          : "¡Sigue así para subir en el ranking! 💪"
                        }
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="no-rank-info"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <FaRocket className="motivational-icon" />
                    <h3>¡Únete al Ranking!</h3>
                    <p>Completa más evaluaciones y módulos para aparecer en la clasificación global</p>
                  </motion.div>
                )}
              </div>

              {/* Top 3 Destacado */}
              {topUsers.length > 0 && (
                <div className="top-users-showcase">
                  <h3>🏆 Top 3 Estudiantes</h3>
                  <div className="podium">
                    {topUsers.slice(0, 3).map((user, index) => (
                      <motion.div
                        key={user.id}
                        className={`podium-position position-${index + 1}`}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1 + index * 0.2 }}
                      >
                        <div className="podium-icon">
                          {index === 0 && <FaCrown style={{ color: '#F59E0B' }} />}
                          {index === 1 && <FaMedal style={{ color: '#6B7280' }} />}
                          {index === 2 && <FaTrophy style={{ color: '#CD7C2F' }} />}
                        </div>
                        <div className="podium-info">
                          <span className="user-name">{user.name || `Usuario ${index + 1}`}</span>
                          <span className="user-score">{user.points} pts</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
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