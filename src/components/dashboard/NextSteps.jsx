import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/NextSteps.css';

const NextSteps = () => {
  const { moduleProgress } = useProgress();
  const navigate = useNavigate();

  // Encontrar el siguiente módulo no completado
  const nextModule = moduleProgress.find(module => !module.completed);

  // Encontrar módulos con progreso parcial
  const inProgressModules = moduleProgress.filter(
    module => module.progress > 0 && module.progress < 100
  );

  const handleModuleClick = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className="next-steps">
      <h2>Próximos Pasos</h2>
      
      {nextModule && (
        <div className="next-module">
          <h3>Continuar Aprendiendo</h3>
          <div 
            className="module-card"
            onClick={() => handleModuleClick(nextModule.id)}
          >
            <div className="module-info">
              <h4>{nextModule.title}</h4>
              <p>{nextModule.description}</p>
            </div>
            <div className="module-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${nextModule.progress}%` }}
                />
              </div>
              <span>{nextModule.progress}% completado</span>
            </div>
          </div>
        </div>
      )}

      {inProgressModules.length > 0 && (
        <div className="in-progress-modules">
          <h3>Módulos en Progreso</h3>
          {inProgressModules.map(module => (
            <div 
              key={module.id}
              className="module-card"
              onClick={() => handleModuleClick(module.id)}
            >
              <div className="module-info">
                <h4>{module.title}</h4>
                <p>{module.description}</p>
              </div>
              <div className="module-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
                <span>{module.progress}% completado</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!nextModule && inProgressModules.length === 0 && (
        <div className="all-completed">
          <h3>¡Felicidades!</h3>
          <p>Has completado todos los módulos disponibles.</p>
          <p>Mantente atento para nuevos contenidos.</p>
        </div>
      )}
    </div>
  );
};

export default NextSteps; 