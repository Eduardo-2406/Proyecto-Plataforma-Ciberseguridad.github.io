import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import PrivateRoute from './components/PrivateRoute';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';
import Progress from './components/Progress';
import styled from 'styled-components';
import './styles/ErrorBoundary.css';
import Quiz from './components/modules/Quiz';
import ModuleRouter from './components/modules/ModuleRouter';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Modules = lazy(() => import('./components/Modules'));
const Module1 = lazy(() => import('./components/modules/Module1'));
const Module2 = lazy(() => import('./components/modules/Module2'));
const Module3 = lazy(() => import('./components/modules/Module3'));
const Module4 = lazy(() => import('./components/modules/Module4'));
const Module5 = lazy(() => import('./components/modules/Module5'));
const Module6 = lazy(() => import('./components/modules/Module6'));
const Evaluations = lazy(() => import('./components/Evaluations'));
const Evaluation = lazy(() => import('./components/Evaluation'));
const Forum = lazy(() => import('./components/forum/Forum'));
const Profile = lazy(() => import('./components/Profile'));
const Certificates = lazy(() => import('./components/Certificates'));
const CreateUser = lazy(() => import('./pages/admin/CreateUser'));
const Resources = lazy(() => import('./pages/Resources'));

const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
  transition: { 
    duration: 0.3,
    ease: "easeInOut"
  }
};

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
`;

const AppContent = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      }>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={
              <motion.div className="page-content" {...pageTransition}>
                <Home />
              </motion.div>
            } />
            <Route path="/login" element={
              <motion.div className="page-content" {...pageTransition}>
                <Login />
              </motion.div>
            } />
            <Route path="/register" element={
              <motion.div className="page-content" {...pageTransition}>
                <Register />
              </motion.div>
            } />
            <Route path="/modules" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Modules />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/module/1" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Module1 />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/module/2" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Module2 />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/module/3" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Module3 />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/module/4" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Module4 />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/module/5" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Module5 />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/module/6" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Module6 />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/evaluations" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Evaluations />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/evaluation/:id" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Evaluation />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/evaluation/:id/results" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Evaluation />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/forum" element={
              <motion.div className="page-content" {...pageTransition}>
                <Forum />
              </motion.div>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Profile />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/progress" element={
              <PrivateRoute>
                <ErrorBoundary>
                  <motion.div className="page-content" {...pageTransition}>
                    <Progress />
                  </motion.div>
                </ErrorBoundary>
              </PrivateRoute>
            } />
            <Route path="/certificates" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Certificates />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/admin/create-user" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <CreateUser />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/module/:id" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <ModuleRouter />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/quiz/:moduleId" element={
              <PrivateRoute>
                <motion.div className="page-content" {...pageTransition}>
                  <Quiz />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/resources" element={
              <motion.div className="page-content" {...pageTransition}>
                <Resources />
              </motion.div>
            } />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ProgressProvider>
          <div className="app">
            <AppContent />
          </div>
        </ProgressProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
