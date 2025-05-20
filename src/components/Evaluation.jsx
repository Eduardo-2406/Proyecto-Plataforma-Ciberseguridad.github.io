import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { evaluationsData } from '../data/evaluations';
import { rtdb } from '../config/firebase';
import { ref, set, get } from 'firebase/database';
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

        // Cargar progreso existente desde Firebase
        const progressRef = ref(rtdb, `users/${currentUser.uid}/evaluations/${id}`);
        const snapshot = await get(progressRef);
        if (snapshot.exists()) {
          const progress = snapshot.val();
          if (!progress.completed) {
            setCurrentQuestion(progress.currentQuestion || 0);
            setAnswers(progress.answers || {});
          }
        }
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

    // Guardar progreso en Firebase
    const progressRef = ref(rtdb, `users/${currentUser.uid}/evaluations/${id}`);
    set(progressRef, {
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
      if (answers[question.id] === question.correctAnswer) {
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

      const certificateRef = ref(rtdb, `users/${currentUser.uid}/certificates/${certificateId}`);
      await set(certificateRef, certificate);
      
      return certificate;
    } catch (error) {
      console.error('Error al generar certificado:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (submitted) return;

    const score = calculateScore();
    const result = {
      evaluationId: id,
      completed: true,
      score,
      correctAnswers: Object.values(answers).filter(
        (answer, index) => answer === evaluation.questions[index].correctAnswer
      ).length,
      incorrectAnswers: Object.values(answers).filter(
        (answer, index) => answer !== evaluation.questions[index].correctAnswer
      ).length,
      completedAt: new Date().toISOString(),
      points: Math.round(score * 10), // 10 puntos por cada punto porcentual
      answers: answers // Guardamos también las respuestas
    };

    try {
      // Primero guardamos en Firebase directamente
      const evaluationRef = ref(rtdb, `users/${currentUser.uid}/evaluations/${id}`);
      await set(evaluationRef, result);
      
      // Luego actualizamos el contexto
      await saveEvaluation(id, result);
      
      // Si el usuario pasa la evaluación, generamos certificado
      if (score >= evaluation.passingScore) {
        await generateCertificate(score);
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error al guardar los resultados:', error);
      setError('Error al guardar los resultados');
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
                      {Object.values(answers).filter(
                        (answer, index) => answer === evaluation.questions[index].correctAnswer
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
                      {Object.values(answers).filter(
                        (answer, index) => answer !== evaluation.questions[index].correctAnswer
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
          </div>

          <div className="result-actions">
            <button
              className="review-button"
              onClick={() => setSubmitted(false)}
            >
              <i className="fas fa-search" />
              Revisar respuestas
            </button>
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
          <h2>{question.text}</h2>
          <div className="options-grid">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${answers[question.id] === option ? 'selected' : ''}`}
                onClick={() => handleAnswer(question.id, option)}
              >
                <div className="option-content">
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                </div>
                {answers[question.id] === option && (
                  <i className="fas fa-check option-check" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="navigation-buttons">
          <button
            className="nav-button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <i className="fas fa-arrow-left" />
            Anterior
          </button>
          <button
            className="nav-button"
            onClick={handleNext}
            disabled={currentQuestion === evaluation.questions.length - 1}
          >
            Siguiente
            <i className="fas fa-arrow-right" />
          </button>
        </div>

        {currentQuestion === evaluation.questions.length - 1 && (
          <button className="submit-button" onClick={handleSubmit}>
            <i className="fas fa-check-circle" />
            Finalizar Evaluación
          </button>
        )}
      </div>
    </div>
  );
};

export default Evaluation; 