import React, { useState, useEffect } from 'react';
import BaseModule from './BaseModule';
import { ref, onValue } from 'firebase/database';
import { auth, rtdb } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const Module3 = () => {
  const moduleData = {
    title: "Phishing y Seguridad en el Correo Electrónico",
    description: "Aprende a identificar y prevenir ataques de phishing, y cómo mantener segura tu comunicación por correo electrónico.",
    moduleId: "3",
    prevModuleId: "2",
    nextModuleId: "4",
    sections: [
      {
        id: "phishing-intro",
        title: "¿Qué es el Phishing?",
        content: "El phishing es una técnica de ingeniería social que busca engañar a los usuarios para obtener información sensible como contraseñas, datos bancarios o información personal.",
        points: [
          "Suplantación de identidad",
          "Mensajes urgentes o alarmantes",
          "Enlaces maliciosos",
          "Archivos adjuntos peligrosos"
        ]
      },
      {
        id: "email-security",
        title: "Seguridad en el Correo Electrónico",
        content: "El correo electrónico es una de las principales vías de entrada para ataques cibernéticos. Es crucial implementar buenas prácticas de seguridad.",
        points: [
          "Verificar remitentes",
          "Revisar enlaces antes de hacer clic",
          "No abrir archivos adjuntos sospechosos",
          "Usar filtros anti-spam"
        ]
      },
      {
        id: "prevention",
        title: "Prevención de Ataques",
        content: "La prevención es la mejor defensa contra el phishing. Conocer las técnicas comunes y estar alerta puede evitar la mayoría de los incidentes.",
        points: [
          "Capacitación regular",
          "Políticas de seguridad claras",
          "Reporte de incidentes",
          "Actualización de software"
        ]
      }
    ],
    videos: [
      {
        title: "Identificación de Emails de Phishing",
        url: "https://www.youtube.com/embed/GIxWzwxdH48"
      },
      {
        title: "Seguridad en el Correo Electrónico",
        url: "https://www.youtube.com/embed/UuuAlP7ay6U"
      }
    ],
    quiz: {
      maxAttempts: 3,
      questions: [
        {
          type: 'multiple_choice',
          question: '¿Qué es el phishing?',
          answers: [
            'Un tipo de ataque que intenta engañar a los usuarios para obtener información sensible',
            'Un virus informático',
            'Un tipo de spam',
            'Un error de software'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! El phishing es un ataque que intenta engañar a los usuarios.',
          incorrectFeedback: 'Incorrecto. El phishing es un ataque que intenta engañar a los usuarios para obtener información sensible.'
        },
        {
          type: 'true_false',
          question: 'Los correos electrónicos de phishing siempre contienen errores gramaticales.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! Los ataques de phishing pueden ser muy sofisticados y sin errores.',
          incorrectFeedback: 'Incorrecto. Los ataques de phishing modernos pueden ser muy sofisticados y sin errores.'
        },
        {
          type: 'matching',
          question: 'Relaciona cada tipo de ataque de phishing con su descripción:',
          items: [
            { left: 'Spear Phishing' },
            { left: 'Whaling' },
            { left: 'Vishing' },
            { left: 'Smishing' }
          ],
          options: [
            'Ataque dirigido a una persona específica',
            'Ataque dirigido a ejecutivos de alto nivel',
            'Phishing por llamada telefónica',
            'Phishing por mensaje de texto'
          ],
          correctAnswer: [0, 1, 2, 3],
          feedback: 'Cada tipo de phishing tiene características y objetivos específicos.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué debes hacer si recibes un correo electrónico sospechoso?',
          answers: [
            'Verificar el remitente y no hacer clic en enlaces',
            'Responder al correo para verificar',
            'Hacer clic en los enlaces para verificar',
            'Reenviar el correo a colegas'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Siempre verifica el remitente y evita hacer clic en enlaces sospechosos.',
          incorrectFeedback: 'Incorrecto. Nunca debes interactuar con correos sospechosos.'
        },
        {
          type: 'true_false',
          question: 'El protocolo TLS es el estándar para cifrar comunicaciones por correo electrónico.',
          correctAnswer: true,
          correctFeedback: '¡Correcto! TLS (Transport Layer Security) es el protocolo estándar para cifrar comunicaciones por correo electrónico.',
          incorrectFeedback: 'Incorrecto. TLS es el protocolo estándar para cifrar comunicaciones por correo electrónico.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es un filtro anti-spam?',
          answers: [
            'Un sistema que identifica y bloquea correos no deseados',
            'Un tipo de virus',
            'Un programa de respaldo',
            'Un sistema de autenticación'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Un filtro anti-spam identifica y bloquea correos no deseados.',
          incorrectFeedback: 'Incorrecto. Un filtro anti-spam es un sistema que identifica y bloquea correos no deseados.'
        },
        {
          type: 'true_false',
          question: 'Es seguro abrir archivos adjuntos de correos electrónicos de remitentes desconocidos.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! Nunca debes abrir archivos adjuntos de remitentes desconocidos.',
          incorrectFeedback: 'Incorrecto. Los archivos adjuntos pueden contener malware.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es la suplantación de identidad en correo electrónico?',
          answers: [
            'Falsificar la dirección del remitente para parecer legítimo',
            'Cambiar la contraseña del correo',
            'Enviar correos masivos',
            'Bloquear correos no deseados'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! La suplantación de identidad es falsificar la dirección del remitente.',
          incorrectFeedback: 'Incorrecto. La suplantación de identidad es falsificar la dirección del remitente.'
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
      const attemptsRef = ref(rtdb, `quizAttempts/${auth.currentUser.uid}/3`);
      const bestScoreRef = ref(rtdb, `bestQuizScores/${auth.currentUser.uid}/3`);

      onValue(attemptsRef, (snapshot) => {
        const attempts = snapshot.val();
        if (attempts) {
          const attemptsArray = Object.values(attempts);
          setQuizAttempts(attemptsArray.length);
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

export default Module3; 