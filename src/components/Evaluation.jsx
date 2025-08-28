import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { evaluationsData } from '../data/evaluations';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { database } from '../config/firebase';
import { ref, set } from 'firebase/database';
import '../styles/Evaluation.css';

const Evaluation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { saveEvaluation } = useProgress();
  const [evaluation, setEvaluation] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadEvaluation = async () => {
      try {
        const data = evaluationsData[id];
        if (data) {
          setEvaluation(data);
          setTimeLeft(data.duration * 60);
          setLoading(false);
        } else {
          setError('Evaluación no encontrada');
          setLoading(false);
        }

        // Cargar progreso existente desde Firestore
        const progressRef = doc(db, 'users', currentUser.uid, 'evaluations', id);
        const progressSnap = await getDoc(progressRef);
        if (progressSnap.exists()) {
          const progress = progressSnap.data();
          if (progress.completed) {
            // Load completed results state
            setAnswers(progress.answers || {});
            setSubmitted(true);
          } else {
            // Load in-progress state
            setCurrentQuestion(progress.currentQuestion || 0);
            setAnswers(progress.answers || {});
          }
        } else {
          // No progress found, start fresh
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar la evaluación:', error);
        setError('Error al cargar la evaluación');
        setLoading(false);
      }
    };

    loadEvaluation();
  }, [id, currentUser, navigate]);

  useEffect(() => {
    if (!timeLeft || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));

    // Guardar progreso en Firestore
    const progressRef = doc(db, 'users', currentUser.uid, 'evaluations', id);
    setDoc(progressRef, {
      currentQuestion,
      answers: { ...answers, [questionId]: answer },
      lastUpdated: new Date().toISOString()
    });
  };

  const handleNext = () => {
    if (currentQuestion < evaluation.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    evaluation.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;

      let isCorrect = false;
      if (question.type === 'multiple_choice') {
        isCorrect = userAnswer === question.options[correctAnswer];
      } else if (question.type === 'true_false') {
        const normalizedUserAnswer = typeof userAnswer === 'string' ? (userAnswer === 'Verdadero') : userAnswer;
        isCorrect = normalizedUserAnswer === correctAnswer;
      } else {
        isCorrect = userAnswer === correctAnswer;
      }

      if (isCorrect) {
        correctAnswers++;
      }
    });
    
    return Math.round((correctAnswers / evaluation.questions.length) * 100);
  };

  const generateCertificate = async (score) => {
    try {
      const certificateId = `cert_${Date.now()}`;
      const certificate = {
        id: certificateId,
        title: `Certificado de ${evaluation.title}`,
        recipientName: currentUser.displayName || 'Usuario',
        issuer: 'Plataforma de Ciberseguridad',
        issueDate: new Date().toISOString(),
        evaluationId: id,
        score: score,
        evaluationTitle: evaluation.title,
        verificationCode: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      // **GUARDAR CERTIFICADO EN REALTIME DATABASE**
      const certificateRef = ref(database, `users/${currentUser.uid}/certificates/${certificateId}`);
      await set(certificateRef, certificate);

      return certificate;
    } catch (error) {
      console.error('Evaluation.jsx - Error en generateCertificate (set): ', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (submitted) return;

    try {
      const score = calculateScore();
      const correctAnswers = evaluation.questions.filter(
        (question) => {
          const userAnswer = answers[question.id];
          const correctAnswer = question.correctAnswer;

          if (question.type === 'multiple_choice') {
            return userAnswer === question.options[correctAnswer];
          } else if (question.type === 'true_false') {
            const normalizedUserAnswer = typeof userAnswer === 'string' ? (userAnswer === 'Verdadero') : userAnswer;
            return normalizedUserAnswer === correctAnswer;
          } else {
            return userAnswer === correctAnswer;
          }
        }
      ).length;
      const incorrectAnswers = evaluation.questions.filter(
        (question) => {
          const userAnswer = answers[question.id];
          if (!(question.id in answers)) return false;

          const correctAnswer = question.correctAnswer;

          if (question.type === 'multiple_choice') {
            return userAnswer !== question.options[correctAnswer];
          } else if (question.type === 'true_false') {
            const normalizedUserAnswer = typeof userAnswer === 'string' ? (userAnswer === 'Verdadero') : userAnswer;
            return normalizedUserAnswer !== correctAnswer;
          } else {
            return userAnswer !== correctAnswer;
          }
        }
      ).length;

      const result = {
        evaluationId: id,
        userId: currentUser.uid,
        completed: true,
        score,
        correctAnswers,
        incorrectAnswers,
        completedAt: new Date().toISOString(),
        points: Math.round(score * 10),
        answers: answers
      };

      // Intentar guardar la evaluación
      await saveEvaluation(id, result);
      
      // Si el usuario pasa la evaluación, generamos certificado
      if (score >= evaluation.passingScore) {
        try {
          await generateCertificate(score);
        } catch (certError) {
          console.error('Evaluation.jsx - Error al generar certificado:', certError);
        }
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error al guardar los resultados:', error);
      setError(`Error al guardar los resultados: ${error.message}. Por favor, intenta nuevamente.`);
    }
  };

  if (loading) {
    return (
      <div className="evaluation-container">
        <div className="loading">Cargando evaluación...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evaluation-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (submitted) {
    const score = calculateScore();
    const passed = score >= evaluation.passingScore;

    return (
      <div className="evaluation-container result-page">
        <div className="result-container">
          <div className="result-header">
            <div className="header-content">
              <h2>Resultados de la Evaluación</h2>
              <div className="evaluation-info">
                <span className="evaluation-title">{evaluation.title}</span>
                <span className="completion-date">
                  <i className="fas fa-calendar-check" />
                  Completada el {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="score-display">
            <div className={`score-circle ${passed ? 'passed' : 'failed'}`}>
              <div className="score-content">
                <span className="score-value">{score}%</span>
                <span className="score-label">
                  {passed ? '¡Aprobado!' : 'No aprobado'}
                </span>
              </div>
            </div>
            <div className="score-details">
              <div className="score-info">
                <i className="fas fa-percentage" />
                <div className="info-content">
                  <span className="info-label">Puntuación mínima requerida</span>
                  <span className="info-value">{evaluation.passingScore}%</span>
                </div>
              </div>
              <div className="score-info">
                <i className="fas fa-clock" />
                <div className="info-content">
                  <span className="info-label">Tiempo utilizado</span>
                  <span className="info-value">
                    {Math.floor((evaluation.duration * 60 - timeLeft) / 60)} minutos
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="result-details">
            <div className="result-section">
              <h3>Resumen de Respuestas</h3>
              <div className="answers-summary">
                <div className="summary-item correct">
                  <div className="summary-icon">
                    <i className="fas fa-check-circle" />
                  </div>
                  <div className="summary-content">
                    <span className="summary-value">
                      {evaluation.questions.filter(
                        (question) => {
                          const userAnswer = answers[question.id];
                          const correctAnswer = question.correctAnswer;

                          if (question.type === 'multiple_choice') {
                            return userAnswer === question.options[correctAnswer];
                          } else if (question.type === 'true_false') {
                            const normalizedUserAnswer = typeof userAnswer === 'string' ? (userAnswer === 'Verdadero') : userAnswer;
                            return normalizedUserAnswer === correctAnswer;
                          } else {
                            return userAnswer === correctAnswer;
                          }
                        }
                      ).length}
                    </span>
                    <span className="summary-label">Respuestas correctas</span>
                  </div>
                </div>
                <div className="summary-item incorrect">
                  <div className="summary-icon">
                    <i className="fas fa-times-circle" />
                  </div>
                  <div className="summary-content">
                    <span className="summary-value">
                      {evaluation.questions.filter(
                        (question) => {
                          const userAnswer = answers[question.id];
                          if (!(question.id in answers)) return false;

                          const correctAnswer = question.correctAnswer;

                          if (question.type === 'multiple_choice') {
                            return userAnswer !== question.options[correctAnswer];
                          } else if (question.type === 'true_false') {
                            const normalizedUserAnswer = typeof userAnswer === 'string' ? (userAnswer === 'Verdadero') : userAnswer;
                            return normalizedUserAnswer !== correctAnswer;
                          } else {
                            return userAnswer !== correctAnswer;
                          }
                        }
                      ).length}
                    </span>
                    <span className="summary-label">Respuestas incorrectas</span>
                  </div>
                </div>
                <div className="summary-item total">
                  <div className="summary-icon">
                    <i className="fas fa-list-ol" />
                  </div>
                  <div className="summary-content">
                    <span className="summary-value">{evaluation.questions.length}</span>
                    <span className="summary-label">Total de preguntas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="result-section">
              <h3>Revisión de Respuestas</h3>
              <div className="answers-review">
                {evaluation.questions.map((question, index) => (
                  <div key={index} className="review-item">
                    <div className="question-review">
                      <span className="question-number">Pregunta {index + 1}:</span>
                      <span className="question-text">{question.text}</span>
                    </div>
                    <div className="answer-review">
                      <div className={`answer-status ${
                        (() => {
                          const userAnswer = answers[question.id];
                          const correctAnswer = question.correctAnswer;

                          if (question.type === 'multiple_choice') {
                            return userAnswer === question.options[correctAnswer];
                          } else if (question.type === 'true_false') {
                            const normalizedUserAnswer = typeof userAnswer === 'string' ? (userAnswer === 'Verdadero') : userAnswer;
                            return normalizedUserAnswer === correctAnswer;
                          } else {
                            return userAnswer === correctAnswer;
                          }
                        })()
                        ? 'correct' : 'incorrect'}`}>
                        <i className={`fas fa-${
                          (() => {
                            const userAnswer = answers[question.id];
                            const correctAnswer = question.correctAnswer;

                            if (question.type === 'multiple_choice') {
                              return userAnswer === question.options[correctAnswer];
                            } else if (question.type === 'true_false') {
                              const normalizedUserAnswer = typeof userAnswer === 'string' ? (userAnswer === 'Verdadero') : userAnswer;
                              return normalizedUserAnswer === correctAnswer;
                            } else {
                              return userAnswer === correctAnswer;
                            }
                          })()
                        ? 'check' : 'times'}-circle`} />
                        <span>Tu respuesta: {typeof answers[question.id] === 'boolean' ? (answers[question.id] ? 'Verdadero' : 'Falso') : answers[question.id]}</span>
                      </div>
                      {!(
                        (() => {
                          const userAnswer = answers[question.id];
                          const correctAnswer = question.correctAnswer;

                          if (question.type === 'multiple_choice') {
                            return userAnswer === question.options[correctAnswer];
                          } else if (question.type === 'true_false') {
                            const normalizedUserAnswer = typeof userAnswer === 'string' ? (userAnswer === 'Verdadero') : userAnswer;
                            return normalizedUserAnswer === correctAnswer;
                          } else {
                            return userAnswer === correctAnswer;
                          }
                        })()
                      )
                        && (
                        <div className="correct-answer">
                          <i className="fas fa-check-circle" />
                          <span>Respuesta correcta: {question.type === 'multiple_choice' ? question.options[question.correctAnswer] : (typeof question.correctAnswer === 'boolean' ? (question.correctAnswer ? 'Verdadero' : 'Falso') : question.correctAnswer)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="result-actions">
            <button
              className="return-button"
              onClick={() => navigate('/evaluations')}
            >
              <i className="fas fa-arrow-left" />
              Volver a evaluaciones
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = evaluation.questions[currentQuestion];

  return (
    <div className="evaluation-container">
      <div className="evaluation-header">
        <div className="header-content">
          <h1>{evaluation.title}</h1>
          <div className="evaluation-meta">
            <span className="meta-item">
              <i className="fas fa-list-ol" />
              Pregunta {currentQuestion + 1} de {evaluation.questions.length}
            </span>
            <span className="meta-item timer">
              <i className="fas fa-clock" />
              <span className="timer-value">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="question-container">
        <div className="question-content">
          <h2>{question?.text || 'Pregunta no disponible'}</h2>
          <div className="options-grid">
            {question?.type === 'multiple_choice' && question?.options?.map((option, index) => (
              <button
                key={index}
                className={`option-button ${answers[question.id] === option ? 'selected' : ''}`}
                onClick={() => handleAnswer(question.id, option)}
              >
                <div className="option-content">
                  <span className="option-text">{option}</span>
                </div>
              </button>
            ))}
            {question?.type === 'true_false' && (
              <div className="true-false-options">
                <button
                  className={`option-button ${answers[question.id] === true ? 'selected' : ''}`}
                  onClick={() => handleAnswer(question.id, true)}
                >
                  <div className="option-content">
                    <span className="option-text">Verdadero</span>
                  </div>
                </button>
                <button
                  className={`option-button ${answers[question.id] === false ? 'selected' : ''}`}
                  onClick={() => handleAnswer(question.id, false)}
                >
                  <div className="option-content">
                    <span className="option-text">Falso</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className="navigation-buttons">
            <button
              className="nav-button"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              <i className="fas fa-arrow-left nav-icon" />
              <span className="nav-text">Anterior</span>
            </button>
            <button
              className="nav-button"
              onClick={() => {
                if (currentQuestion === evaluation.questions.length - 1) {
                  handleSubmit();
                } else {
                  setCurrentQuestion(prev => Math.min(evaluation.questions.length - 1, prev + 1));
                }
              }}
            >
              {currentQuestion === evaluation.questions.length - 1 ? (
                <>
                  <span className="nav-text">Finalizar</span>
                  <i className="fas fa-check nav-icon" />
                </>
              ) : (
                <>
                  <span className="nav-text">Siguiente</span>
                  <i className="fas fa-arrow-right nav-icon" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="evaluation-sidebar">
        <div className="sidebar-section">
          <h3>Progreso</h3>
          <div className="progress-list">
            {evaluation.questions.map((q, index) => (
              <div
                key={index}
                className={`progress-item ${index === currentQuestion ? 'current' : ''} ${q.id in answers ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              >
                <div className="progress-number">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Resumen</h3>
          <div className="progress-list">
            <div className="progress-item">
              <i className="fas fa-check-circle" />
              <span>Respondidas: {Object.keys(answers).length}</span>
            </div>
            <div className="progress-item">
              <i className="fas fa-clock" />
              <span>Pendientes: {evaluation.questions.length - Object.keys(answers).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluation; 