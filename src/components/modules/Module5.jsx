import React, { useState, useEffect } from 'react';
import BaseModule from './BaseModule';
import { ref, onValue } from 'firebase/database';
import { auth, rtdb } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const Module5 = () => {
  const moduleData = {
    title: "Respuesta a Incidentes",
    description: "Aprende los protocolos y procedimientos para detectar, reportar y responder a incidentes de seguridad de manera efectiva.",
    moduleId: "5",
    prevModuleId: "4",
    nextModuleId: "6",
    sections: [
      {
        id: "incident-detection",
        title: "Detección de Incidentes",
        content: "La detección temprana de incidentes de seguridad es crucial para minimizar su impacto. Es importante conocer los indicadores y sistemas de monitoreo.",
        points: [
          "Sistemas de detección de intrusiones",
          "Monitoreo de red",
          "Análisis de logs",
          "Alertas de seguridad"
        ]
      },
      {
        id: "response-protocols",
        title: "Protocolos de Respuesta",
        content: "Tener protocolos claros de respuesta a incidentes permite actuar de manera rápida y efectiva cuando ocurre un incidente de seguridad.",
        points: [
          "Plan de respuesta a incidentes",
          "Equipo de respuesta",
          "Procedimientos de contención",
          "Comunicación de crisis"
        ]
      },
      {
        id: "recovery-process",
        title: "Proceso de Recuperación",
        content: "La recuperación después de un incidente de seguridad requiere un plan estructurado para restaurar los sistemas y servicios afectados.",
        points: [
          "Evaluación de daños",
          "Restauración de sistemas",
          "Verificación de seguridad",
          "Lecciones aprendidas"
        ]
      }
    ],
    videos: [
      {
        title: "Protocolos de Respuesta a Incidentes",
        url: "https://www.youtube.com/embed/example3"
      },
      {
        title: "Proceso de Recuperación Post-Incidente",
        url: "https://www.youtube.com/embed/example4"
      }
    ],
    quiz: {
      maxAttempts: 3,
      questions: [
        {
          type: 'multiple_choice',
          question: '¿Qué es un incidente de seguridad?',
          answers: [
            'Un evento que compromete la seguridad de los sistemas o datos',
            'Un error de programación',
            'Una actualización de software',
            'Un cambio de contraseña'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Un incidente de seguridad es un evento que compromete la seguridad de los sistemas o datos.',
          incorrectFeedback: 'Incorrecto. Un incidente de seguridad es un evento que compromete la seguridad de los sistemas o datos.'
        },
        {
          type: 'true_false',
          question: 'La detección temprana de incidentes reduce el impacto del ataque.',
          correctAnswer: true,
          correctFeedback: '¡Correcto! La detección temprana es crucial para minimizar el impacto de los incidentes.',
          incorrectFeedback: 'Incorrecto. La detección temprana es fundamental para reducir el impacto de los incidentes.'
        },
        {
          type: 'multiple_choice',
          question: '¿Cuál es el primer paso en la respuesta a un incidente?',
          answers: [
            'Contener el incidente para evitar su propagación',
            'Apagar todos los sistemas',
            'Cambiar todas las contraseñas',
            'Notificar a los medios'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! El primer paso es contener el incidente para evitar su propagación.',
          incorrectFeedback: 'Incorrecto. El primer paso es contener el incidente para evitar su propagación.'
        },
        {
          type: 'true_false',
          question: 'Es necesario documentar todos los pasos tomados durante la respuesta a un incidente.',
          correctAnswer: true,
          correctFeedback: '¡Correcto! La documentación es crucial para el análisis posterior y la mejora de procesos.',
          incorrectFeedback: 'Incorrecto. La documentación es obligatoria para el análisis y mejora de procesos.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es un plan de respuesta a incidentes?',
          answers: [
            'Un conjunto de procedimientos para manejar incidentes de seguridad',
            'Un sistema de respaldo',
            'Un tipo de firewall',
            'Un método de encriptación'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Un plan de respuesta a incidentes define los procedimientos para manejar incidentes de seguridad.',
          incorrectFeedback: 'Incorrecto. Un plan de respuesta a incidentes es un conjunto de procedimientos para manejar incidentes de seguridad.'
        },
        {
          type: 'true_false',
          question: 'La comunicación efectiva es crucial durante la respuesta a un incidente.',
          correctAnswer: true,
          correctFeedback: '¡Correcto! La comunicación efectiva es esencial para coordinar la respuesta.',
          incorrectFeedback: 'Incorrecto. La comunicación efectiva es fundamental durante la respuesta a incidentes.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es el análisis post-incidente?',
          answers: [
            'La evaluación de lo que sucedió y cómo mejorar la respuesta futura',
            'Un tipo de software antivirus',
            'Un sistema de respaldo',
            'Un método de encriptación'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! El análisis post-incidente evalúa lo sucedido y cómo mejorar la respuesta futura.',
          incorrectFeedback: 'Incorrecto. El análisis post-incidente es la evaluación de lo que sucedió y cómo mejorar la respuesta futura.'
        }
      ]
    }
  };

  const [quizAttempts, setQuizAttempts] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  const navigate = useNavigate();

  // Obtener intentos y puntuación del quiz
  useEffect(() => {
    if (auth.currentUser) {
      const attemptsRef = ref(rtdb, `quizAttempts/${auth.currentUser.uid}/5`);
      const bestScoreRef = ref(rtdb, `bestQuizScores/${auth.currentUser.uid}/5`);

      onValue(attemptsRef, (snapshot) => {
        const attempts = snapshot.val();
        if (attempts) {
          const attemptsArray = Object.values(attempts);
          const completeAttempts = attemptsArray.filter(a => a && typeof a.score !== 'undefined');
          setQuizAttempts(completeAttempts.length);
        } else {
          setQuizAttempts(0);
        }
      });

      onValue(bestScoreRef, (snapshot) => {
        const score = snapshot.val();
        if (score) {
          setBestScore(score.score);
          if (score.score >= 80) {
            setQuizCompleted(true);
          }
        }
      });
    }
  }, []);

  const handleRetryQuiz = () => {
    if (quizAttempts < moduleData.quiz.maxAttempts) {
      navigate(`/quiz/${moduleData.moduleId}`);
    }
  };

  return <BaseModule {...moduleData} quizAttempts={quizAttempts} quizCompleted={quizCompleted} bestScore={bestScore} onRetryQuiz={handleRetryQuiz} />;
};

export default Module5; 