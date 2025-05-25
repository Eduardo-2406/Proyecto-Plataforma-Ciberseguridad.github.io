import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useFirebaseQuery } from '../../hooks/useFirebaseQuery';
import { auth, database } from '../../config/firebase';
import { ref, set } from 'firebase/database';
import confetti from 'canvas-confetti';
import { modulesData } from '../../data/modules';

const MAX_ATTEMPTS = 2; // Máximo de intentos permitidos para el quiz

// Variantes de animación
const questionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const feedbackVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const Quiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // 30 segundos por pregunta
  const [isCorrect, setIsCorrect] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { addPoints, completeQuiz } = useStore();

  // Obtener las preguntas del módulo
  const module = modulesData[moduleId];
  const questions = module?.quiz?.questions || [];

  // Obtener intentos previos
  const { data: quizAttempts } = useFirebaseQuery(`quizAttempts/${auth.currentUser?.uid}/${moduleId}`, {
    limitTo: 2,
    orderByField: 'timestamp',
    orderDirection: 'desc'
  });

  // Verificar intentos al cargar
  useEffect(() => {
    if (quizAttempts && quizAttempts.length >= MAX_ATTEMPTS) {
      alert('Has alcanzado el máximo de intentos permitidos para este quiz.');
      navigate(`/module/${moduleId}`);
    }
  }, [quizAttempts, moduleId, navigate]);

  // Si no hay preguntas, redirigir al módulo
  useEffect(() => {
    if (!module || !questions.length) {
      console.log('Módulo no encontrado o sin preguntas:', { moduleId, module, questions });
      navigate(`/module/${moduleId}`);
    }
  }, [module, questions, moduleId, navigate]);

  // Si no hay preguntas, mostrar mensaje de carga
  if (!module || !questions.length) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cargando quiz...</h2>
      </div>
    );
  }

  // Tipos de preguntas
  const QUESTION_TYPES = {
    MULTIPLE_CHOICE: 'multiple_choice',
    TRUE_FALSE: 'true_false',
    MATCHING: 'matching',
    FILL_BLANK: 'fill_blank'
  };

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleNextQuestion();
    }
  }, [timeLeft, showResults]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Calcular puntuación basada en el tipo de pregunta
  const calculateScore = (question, answer) => {
    switch (question.type) {
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return answer === question.correctAnswer ? 10 : 0;
      case QUESTION_TYPES.TRUE_FALSE:
        return answer === question.correctAnswer ? 5 : 0;
      case QUESTION_TYPES.MATCHING:
        return answer.every((item, index) => item === question.correctAnswer[index]) ? 15 : 0;
      case QUESTION_TYPES.FILL_BLANK:
        return answer.toLowerCase() === question.correctAnswer.toLowerCase() ? 10 : 0;
      default:
        return 0;
    }
  };

  // Generar retroalimentación basada en la respuesta
  const generateFeedback = (question, answer) => {
    if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE || question.type === QUESTION_TYPES.TRUE_FALSE) {
      return answer === question.correctAnswer
        ? question.correctFeedback || '¡Correcto!'
        : 'Incorrecto. Intenta de nuevo.';
    }
    return question.feedback || 'Respuesta procesada.';
  };

  const handleAnswerSelect = async (answer) => {
    setSelectedAnswer(answer);
    const isAnswerCorrect = answer === questions[currentQuestion].correctAnswer;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(prevScore => prevScore + 10);
      triggerConfetti();
    }

    setFeedback(generateFeedback(questions[currentQuestion], answer));
    setShowFeedback(true);

    // Registrar intento en Firebase
    if (auth.currentUser) {
      const attemptRef = ref(database, `quizAttempts/${auth.currentUser.uid}/${moduleId}/${Date.now()}`);
      await set(attemptRef, {
        questionId: currentQuestion,
        answer,
        isCorrect: isAnswerCorrect,
        timestamp: Date.now()
      });
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(30);
      setIsCorrect(null);
    } else {
      setIsSaving(true);
      const finalScore = (score / (questions.length * 10)) * 100;
      
      try {
        if (auth.currentUser) {
          // Asegurarnos de que currentAttempts sea un array y tenga una longitud válida
          const currentAttempts = Array.isArray(quizAttempts) ? quizAttempts : [];
          const attemptNumber = Math.max(1, currentAttempts.length + 1);
          
          const attemptRef = ref(database, `quizAttempts/${auth.currentUser.uid}/${moduleId}/${Date.now()}`);
          await set(attemptRef, {
            score: finalScore,
            points: Math.round((finalScore / 100) * 30),
            timestamp: Date.now(),
            attemptNumber: attemptNumber
          });

          // Guardar la mejor puntuación
          const bestScoreRef = ref(database, `bestQuizScores/${auth.currentUser.uid}/${moduleId}`);
          await set(bestScoreRef, {
            score: finalScore,
            timestamp: Date.now()
          });

          // Actualizar el estado del módulo si se aprobó
          if (finalScore >= 80) {
            const userProgressRef = ref(database, `users/${auth.currentUser.uid}/progress/${moduleId}`);
            await set(userProgressRef, {
              quizCompleted: true,
              quizScore: finalScore,
              lastUpdated: Date.now()
            });

            const points = Math.round((finalScore / 100) * 30);
            addPoints(points);
            completeQuiz(moduleId);
          }
        }
      } catch (error) {
        console.error('Error al guardar el intento:', error);
      } finally {
        setIsSaving(false);
        setShowResults(true);
      }
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <div className="space-y-4">
            {question.answers.map((answer, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedAnswer === index
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
                disabled={selectedAnswer !== null}
              >
                {answer}
              </motion.button>
            ))}
          </div>
        );

      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswerSelect(true)}
              className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                selectedAnswer === true
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
              disabled={selectedAnswer !== null}
            >
              Verdadero
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswerSelect(false)}
              className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                selectedAnswer === false
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
              disabled={selectedAnswer !== null}
            >
              Falso
            </motion.button>
          </div>
        );

      case QUESTION_TYPES.MATCHING:
        return (
          <div className="space-y-4">
            {question.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="w-1/2">{item.left}</span>
                <select
                  className="w-1/2 p-2 border rounded"
                  onChange={(e) => {
                    const newAnswer = [...(selectedAnswer || [])];
                    newAnswer[index] = e.target.value;
                    handleAnswerSelect(newAnswer);
                  }}
                >
                  <option value="">Selecciona una opción</option>
                  {question.options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );

      case QUESTION_TYPES.FILL_BLANK:
        return (
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-4 border rounded-lg"
              placeholder="Escribe tu respuesta..."
              onChange={(e) => handleAnswerSelect(e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (showResults) {
    const percentage = (score / (questions.length * 10)) * 100;
    const points = Math.round((percentage / 100) * 30);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center min-h-screen bg-gray-50 py-8"
      >
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultados del Quiz</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Puntuación total:</span>
              <span className="font-bold">{score} puntos</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className={`h-4 rounded-full ${
                  percentage >= 80 ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
          
          {percentage >= 80 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 text-green-800 p-4 rounded-lg mb-4"
            >
              <h3 className="font-bold mb-2">¡Felicidades!</h3>
              <p>Has aprobado el quiz con un {percentage.toFixed(1)}%</p>
              <p className="mt-2">Has ganado {points} puntos por completar el quiz con éxito.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 text-red-800 p-4 rounded-lg mb-4"
            >
              <h3 className="font-bold mb-2">No has alcanzado el mínimo requerido</h3>
              <p>Tu puntuación: {percentage.toFixed(1)}%</p>
              <p className="mt-2">Necesitas al menos un 80% para aprobar.</p>
            </motion.div>
          )}

          <div className="flex space-x-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/module/${moduleId}`)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Volver al Módulo'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Pregunta {currentQuestion + 1} de {questions.length}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Intentos: {quizAttempts?.length || 0} de {MAX_ATTEMPTS}
            </div>
            <motion.div
              className="text-sm font-medium"
              animate={{
                color: timeLeft <= 10 ? '#ef4444' : '#6b7280'
              }}
            >
              Tiempo: {timeLeft}s
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={currentQuestion}
              variants={questionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <motion.h2
                className="text-xl font-semibold text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {questions[currentQuestion]?.question || 'Pregunta no disponible'}
              </motion.h2>

              {questions[currentQuestion] && renderQuestion(questions[currentQuestion])}

              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    variants={feedbackVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`p-4 rounded-lg ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedAnswer !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNextQuestion}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentQuestion < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultados del Quiz</h2>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Puntuación total:</span>
                  <span className="font-bold">{score} puntos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / (questions.length * 10)) * 100}%` }}
                    className={`h-4 rounded-full ${
                      score >= questions.length * 8 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
              
              {score >= questions.length * 8 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 text-green-800 p-4 rounded-lg mb-4"
                >
                  <h3 className="font-bold mb-2">¡Felicidades!</h3>
                  <p>Has aprobado el quiz con un {((score / (questions.length * 10)) * 100).toFixed(1)}%</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 text-red-800 p-4 rounded-lg mb-4"
                >
                  <h3 className="font-bold mb-2">No has alcanzado el mínimo requerido</h3>
                  <p>Tu puntuación: {((score / (questions.length * 10)) * 100).toFixed(1)}%</p>
                  <p className="mt-2">Necesitas al menos un 80% para aprobar.</p>
                </motion.div>
              )}

              <div className="flex space-x-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setScore(0);
                    setShowResults(false);
                    setTimeLeft(30);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Intentar de nuevo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/module/${moduleId}`)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Volver al Módulo
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Quiz; 