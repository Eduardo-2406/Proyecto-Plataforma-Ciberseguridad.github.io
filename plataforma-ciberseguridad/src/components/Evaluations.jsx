import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { evaluationsData } from '../data/evaluations';
import { rtdb } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import '../styles/Evaluations.css';

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [userResults, setUserResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { evaluationResults } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        // Cargar evaluaciones desde el archivo local
        const evalsArray = Object.values(evaluationsData);
        setEvaluations(evalsArray);

        // Cargar resultados del usuario si está autenticado
        if (currentUser) {
          const resultsRef = ref(rtdb, `users/${currentUser.uid}/evaluations`);
          onValue(resultsRef, (snapshot) => {
            if (snapshot.exists()) {
              const results = snapshot.val();
              setUserResults(results);
            }
          });
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

  const getEvaluationStatus = (evalId) => {
    if (!currentUser) return 'not-started';
    const result = userResults[evalId];
    
    // Si no hay resultado, no está iniciada
    if (!result) return 'not-started';
    
    // Si tiene completed true y score, está completada
    if (result.completed === true && result.score !== undefined) {
      return 'completed';
    }
    
    // Si tiene respuestas, está en progreso
    if (result.answers && Object.keys(result.answers).length > 0) {
      return 'in-progress';
    }
    
    return 'not-started';
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En progreso';
      default:
        return 'No iniciado';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#16a34a';
      case 'in-progress':
        return '#2563eb';
      default:
        return '#718096';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#2563eb';
    return '#dc2626';
  };

  const handleStartEvaluation = (evaluationId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/evaluation/${evaluationId}`);
  };

  if (loading) {
    return (
      <div className="evaluations-container">
        <div className="loading">Cargando evaluaciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evaluations-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="evaluations-container">
      <h1>Evaluaciones</h1>
      <p className="evaluations-description">
        Pon a prueba tus conocimientos con nuestras evaluaciones y obtén
        certificados de competencia.
      </p>

      <div className="evaluations-grid">
        {evaluations.map((evaluation) => {
          const status = getEvaluationStatus(evaluation.id);
          const result = userResults[evaluation.id];
          return (
            <div key={evaluation.id} className="evaluation-card">
              <div className="evaluation-header">
                <img
                  src={evaluation.image}
                  alt={evaluation.title}
                  className="evaluation-image"
                />
                <div className="evaluation-badge">
                  <i className="fas fa-tasks" />
                </div>
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
                    <i className="fas fa-question-circle" />
                    <span>{evaluation.totalQuestions} preguntas</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-percentage" />
                    <span>{evaluation.passingScore}% mínimo</span>
                  </div>
                </div>

                <div className="evaluation-tags">
                  {evaluation.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {result?.completed && (
                  <div className="evaluation-result">
                    <div className="result-score">
                      <span
                        className="score-value"
                        style={{ color: getScoreColor(result.score) }}
                      >
                        {result.score}%
                      </span>
                      <span className="score-label">Puntuación Final</span>
                    </div>
                    <div className="result-details">
                      <div className="result-item">
                        <i className="fas fa-check-circle" />
                        <span>{result.correctAnswers} respuestas correctas</span>
                      </div>
                      <div className="result-item">
                        <i className="fas fa-times-circle" />
                        <span>{result.incorrectAnswers} respuestas incorrectas</span>
                      </div>
                      <div className="result-item">
                        <i className="fas fa-calendar-check" />
                        <span>Completada el {new Date(result.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="evaluation-status">
                  <span
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(status) }}
                  />
                  <span className="status-label">{getStatusLabel(status)}</span>
                </div>

                <button
                  className={`start-button ${status === 'completed' ? 'completed' : ''}`}
                  onClick={() => handleStartEvaluation(evaluation.id)}
                >
                  {status === 'completed'
                    ? 'Ver resultados'
                    : status === 'in-progress'
                    ? 'Continuar evaluación'
                    : 'Comenzar evaluación'}
                </button>
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