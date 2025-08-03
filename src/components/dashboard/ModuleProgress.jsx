import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaCheckCircle, FaClock, FaLock } from 'react-icons/fa';
import '../../styles/ModuleProgress.css';

const ModuleProgress = () => {
  const { moduleProgress, stats } = useProgress();
  const navigate = useNavigate();

  const handleModuleClick = (moduleId, isLocked) => {
    if (!isLocked) {
      navigate(`/modules#module-${moduleId}`);
    }
  };

  const getModuleStatus = (module, index) => {
    if (module.completed) return 'completed';
    if (module.progress > 0) return 'in-progress';
    if (index === 0 || (moduleProgress[index - 1] && moduleProgress[index - 1].completed)) {
      return 'available';
    }
    return 'locked';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'in-progress':
        return <FaClock className="status-icon in-progress" />;
      case 'available':
        return <FaBook className="status-icon available" />;
      case 'locked':
        return <FaLock className="status-icon locked" />;
      default:
        return <FaBook className="status-icon" />;
    }
  };

  return (
    <div className="module-progress">
      <div className="module-progress-header">
        <h2>Progreso de Módulos</h2>
        <div className="overall-progress">
          <span>
            {moduleProgress.filter(m => m.completed).length} de {moduleProgress.length} completados
          </span>
        </div>
      </div>

      <div className="modules-grid">
        {moduleProgress.map((module, index) => {
          const status = getModuleStatus(module, index);
          const isLocked = status === 'locked';

          return (
            <motion.div
              key={module.id}
              className={`module-card ${status} ${isLocked ? 'locked' : ''}`}
              onClick={() => handleModuleClick(module.id, isLocked)}
              whileHover={!isLocked ? { scale: 1.02 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="module-header">
                <div className="module-icon">
                  {getStatusIcon(status)}
                </div>
                <div className="module-info">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>
              </div>

              <div className="module-progress-bar">
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${module.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="progress-text">{module.progress}%</span>
              </div>

              {module.completed && (
                <div className="completion-badge">
                  <span>¡Completado!</span>
                </div>
              )}

              {isLocked && (
                <div className="locked-overlay">
                  <span>Completa el módulo anterior</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleProgress;
