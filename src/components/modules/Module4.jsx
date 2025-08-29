import React, { useState, useEffect } from 'react';
import BaseModule from './BaseModule';
import { ref, onValue } from 'firebase/database';
import { auth, rtdb } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const Module4 = () => {
  const moduleData = {
    title: "Protección y Privacidad de Datos",
    description: "Aprende sobre la protección de información sensible y el cumplimiento de normativas de privacidad en el sector financiero.",
    moduleId: "4",
    prevModuleId: "3",
    nextModuleId: "5",
    sections: [
      {
        id: "data-protection",
        title: "Protección de Datos Sensibles",
        content: "La protección de datos sensibles es fundamental en el sector financiero. Es crucial implementar medidas robustas para salvaguardar la información de los clientes y la empresa.",
        points: [
          "Clasificación de datos",
          "Encriptación de información",
          "Control de acceso",
          "Respaldo de datos"
        ]
      },
      {
        id: "privacy-regulations",
        title: "Normativas de Privacidad",
        content: "El cumplimiento de normativas de privacidad es esencial para operar en el sector financiero. Conocer y aplicar estas regulaciones protege tanto a la empresa como a los clientes.",
        points: [
          "Ley de Protección de Datos",
          "Regulaciones financieras",
          "Requisitos de cumplimiento",
          "Auditorías de seguridad"
        ]
      },
      {
        id: "best-practices",
        title: "Mejores Prácticas",
        content: "Implementar mejores prácticas en la gestión de datos ayuda a mantener la integridad y confidencialidad de la información sensible.",
        points: [
          "Políticas de retención",
          "Procedimientos de eliminación",
          "Capacitación del personal",
          "Monitoreo continuo"
        ]
      }
    ],
    videos: [
      {
        title: "Protección de Datos en el Sector Financiero",
        url: "https://www.youtube.com/embed/example1"
      },
      {
        title: "Cumplimiento de Normativas de Privacidad",
        url: "https://www.youtube.com/embed/example2"
      }
    ],
    quiz: {
      maxAttempts: 3,
      questions: [
        {
          type: 'multiple_choice',
          question: '¿Qué es la protección de datos sensibles?',
          answers: [
            'El conjunto de medidas para salvaguardar información confidencial',
            'Solo el respaldo de archivos',
            'Un tipo de software antivirus',
            'La gestión de redes sociales'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! La protección de datos sensibles implica un conjunto de medidas para salvaguardar información confidencial.',
          incorrectFeedback: 'Incorrecto. La protección de datos sensibles es el conjunto de medidas para salvaguardar información confidencial.'
        },
        {
          type: 'true_false',
          question: 'La encriptación de datos es opcional para información sensible.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! La encriptación es obligatoria para proteger datos sensibles.',
          incorrectFeedback: 'Incorrecto. La encriptación es una medida obligatoria para proteger datos sensibles.'
        },
        {
          type: 'multiple_choice',
          question: '¿Cuál es el objetivo principal de las normativas de privacidad?',
          answers: [
            'Proteger los derechos de los usuarios sobre sus datos personales',
            'Aumentar la velocidad de procesamiento de datos',
            'Reducir costos de almacenamiento',
            'Mejorar el diseño de bases de datos'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! El objetivo principal es proteger los derechos de los usuarios sobre sus datos personales.',
          incorrectFeedback: 'Incorrecto. El objetivo principal es proteger los derechos de los usuarios sobre sus datos personales.'
        },
        {
          type: 'true_false',
          question: 'Es necesario documentar todos los accesos a datos sensibles.',
          correctAnswer: true,
          correctFeedback: '¡Correcto! La documentación de accesos es crucial para la auditoría y seguridad.',
          incorrectFeedback: 'Incorrecto. Es obligatorio documentar todos los accesos a datos sensibles.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es una política de retención de datos?',
          answers: [
            'Un conjunto de reglas que define cuánto tiempo se conservan los datos',
            'Un sistema de respaldo automático',
            'Un método de encriptación',
            'Un tipo de firewall'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Una política de retención define el tiempo de conservación de los datos.',
          incorrectFeedback: 'Incorrecto. Una política de retención es un conjunto de reglas que define cuánto tiempo se conservan los datos.'
        },
        {
          type: 'true_false',
          question: 'Los empleados deben recibir capacitación regular sobre protección de datos.',
          correctAnswer: true,
          correctFeedback: '¡Correcto! La capacitación regular es esencial para mantener la seguridad.',
          incorrectFeedback: 'Incorrecto. La capacitación regular es obligatoria para todos los empleados.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es una auditoría de seguridad?',
          answers: [
            'Una evaluación sistemática de las medidas de protección de datos',
            'Un tipo de software antivirus',
            'Un sistema de respaldo',
            'Un método de encriptación'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Una auditoría de seguridad es una evaluación sistemática de las medidas de protección.',
          incorrectFeedback: 'Incorrecto. Una auditoría de seguridad es una evaluación sistemática de las medidas de protección de datos.'
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
      const attemptsRef = ref(rtdb, `quizAttempts/${auth.currentUser.uid}/4`);
      const bestScoreRef = ref(rtdb, `bestQuizScores/${auth.currentUser.uid}/4`);

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

export default Module4; 