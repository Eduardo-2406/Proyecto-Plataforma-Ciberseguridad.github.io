import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { evaluationsData } from '../data/evaluations';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import AnimatedText from './animations/AnimatedText';
import '../styles/Evaluations.css';

const evaluationImages = {
  'eval1': 'evaluations/evaluacion1.jpg',
  'eval2': 'evaluations/evaluacion2.jpg',
};

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [userEvaluationProgress, setUserEvaluationProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { evaluationResults } = useProgress();
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState({});

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        // Cargar evaluaciones desde el archivo local
        const evalsArray = Object.entries(evaluationsData).map(([id, data]) => ({
          id,
          ...data
        }));
        setEvaluations(evalsArray);

        // Cargar resultados del usuario desde Firestore si está autenticado
        if (currentUser) {
          // Load user evaluation progress from Firestore
          const evaluationsCollectionRef = collection(db, 'users', currentUser.uid, 'evaluations');
          const querySnapshot = await getDocs(evaluationsCollectionRef);
          const evaluationProgressData = {};
          querySnapshot.forEach((doc) => {
            evaluationProgressData[doc.id] = doc.data();
          });
          setUserEvaluationProgress(evaluationProgressData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar evaluaciones:', error);
        setError('Error al cargar las evaluaciones');
        setLoading(false);
      }
    };

    loadEvaluations();
  }, [currentUser]);

  const getEvaluationStatus = (evaluationId) => {
    const result = userEvaluationProgress[evaluationId];
    if (!result) return { status: 'not_started', score: null };
    
    return {
      status: result.completed ? 'completed' : 'in_progress',
      score: result.score || null
    };
  };

  const handleEvaluationClick = (evaluationId) => {
    const status = getEvaluationStatus(evaluationId);
    if (status.status === 'completed') {
      // Si está completada, mostrar resultados
      navigate(`/evaluation/${evaluationId}/results`);
    } else {
      // Si no está completada, continuar o iniciar
      navigate(`/evaluation/${evaluationId}`);
    }
  };

  if (loading) {
    return <div className="loading">Cargando evaluaciones...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="evaluations-container">
      <AnimatedText 
        text="Evaluaciones" 
        className="animated-title"
        type="h1" 
      />
      <AnimatedText 
        text="Pon a prueba tus conocimientos con nuestras evaluaciones y obtén certificados de competencia."
        className="animated-subtitle"
        type="h2"
      />

      <div className="evaluations-grid">
        {evaluations.map((evaluation) => {
          const status = getEvaluationStatus(evaluation.id);
          return (
            <div
              key={evaluation.id}
              className="evaluation-card"
            >
              <div className="evaluation-header">
                <img
                  src={`/images/${evaluationImages[evaluation.id]}`}
                  alt={evaluation.title}
                  className={`evaluation-image${imgLoaded[evaluation.id] ? ' loaded' : ''}`}
                  onLoad={() => setImgLoaded(prev => ({ ...prev, [evaluation.id]: true }))}
                />
              </div>
              <div className="evaluation-content">
                <h3>{evaluation.title}</h3>
                <p className="evaluation-description">{evaluation.description}</p>
                
                <div className="evaluation-details">
                  <div className="detail-item">
                    <i className="fas fa-clock" />
                    <span>{evaluation.duration} minutos</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-list-ol" />
                    <span>{evaluation.questions.length} preguntas</span>
                  </div>
                </div>

                <div className="evaluation-status">
                  {status.status === 'completed' ? (
                    <>
                      <div className="status-badge completed">
                        <i className="fas fa-check-circle" />
                        Completada
                      </div>
                      <div className="score-display">
                        Puntuación: {status.score}%
                      </div>
                    </>
                  ) : status.status === 'in_progress' ? (
                    <div className="status-badge in-progress">
                      <i className="fas fa-clock" />
                      En progreso
                    </div>
                  ) : (
                    <div className="status-badge not-started">
                      <i className="fas fa-play-circle" />
                      No iniciada
                    </div>
                  )}

                  <button 
                    className="start-evaluation-button"
                    onClick={() => handleEvaluationClick(evaluation.id)}
                  >
                    {status.status === 'completed' ? (
                      <>
                        <i className="fas fa-eye" />
                        Ver resultados
                      </>
                    ) : status.status === 'in_progress' ? (
                      <>
                        <i className="fas fa-play" />
                        Continuar evaluación
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play" />
                        Comenzar evaluación
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!currentUser && (
        <div className="login-prompt">
          <h2>¿Listo para evaluarte?</h2>
          <p>
            Inicia sesión o crea una cuenta para comenzar tus evaluaciones y
            obtener certificados.
          </p>
          <div className="prompt-buttons">
            <button
              className="login-button"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
            <button
              className="register-button"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluations; 