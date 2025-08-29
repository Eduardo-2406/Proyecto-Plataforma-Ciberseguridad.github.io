import React, { useState, useEffect } from 'react';
import BaseModule from './BaseModule';
import { ref, onValue } from 'firebase/database';
import { auth, rtdb } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const Module2 = () => {
  const moduleData = {
    title: "Gestión de Contraseñas y MFA",
    description: "Aprende las mejores prácticas para crear y gestionar contraseñas seguras, y la implementación de autenticación multifactor para proteger tus cuentas y sistemas.",
    moduleId: "2",
    prevModuleId: "1",
    nextModuleId: "3",
    sections: [
      {
        id: "password-basics",
        title: "Fundamentos de Contraseñas Seguras",
        content: "Las contraseñas son la primera línea de defensa en la seguridad de tus cuentas. Aprende los principios fundamentales para crear y gestionar contraseñas seguras.",
        points: [
          "Longitud mínima de 12 caracteres",
          "Combinación de mayúsculas, minúsculas, números y símbolos",
          "Evitar información personal predecible",
          "No reutilizar contraseñas entre cuentas"
        ]
      },
      {
        id: "password-managers",
        title: "Gestores de Contraseñas",
        content: "Los gestores de contraseñas son herramientas esenciales para mantener contraseñas seguras y únicas para cada cuenta. Conoce las mejores opciones y cómo utilizarlas.",
        points: [
          "LastPass - https://www.lastpass.com/",
          "1Password - https://1password.com/",
          "Bitwarden - https://bitwarden.com/",
          "KeePass - https://keepass.info/"
        ]
      },
      {
        id: "mfa-implementation",
        title: "Implementación de MFA",
        content: "La autenticación multifactor añade una capa adicional de seguridad a tus cuentas. Aprende sobre los diferentes tipos de MFA y cómo implementarlos.",
        points: [
          "Autenticación por aplicación (Google Authenticator, Microsoft Authenticator)",
          "Tokens físicos de seguridad",
          "Autenticación biométrica",
          "Códigos SMS/Email (menos seguros)"
        ]
      },
      {
        id: "best-practices",
        title: "Mejores Prácticas",
        content: "Implementa estas mejores prácticas para mantener tus cuentas seguras y protegidas contra accesos no autorizados.",
        points: [
          "Cambio regular de contraseñas (3-6 meses)",
          "Revisión periódica de accesos activos",
          "Habilitar MFA en todas las cuentas posibles",
          "Monitoreo de intentos de acceso fallidos"
        ]
      }
    ],
    videos: [
      {
        title: "Creación de Contraseñas Seguras",
        url: "https://www.youtube.com/embed/example1"
      },
      {
        title: "Uso de Gestores de Contraseñas",
        url: "https://www.youtube.com/embed/example2"
      },
      {
        title: "Configuración de MFA",
        url: "https://www.youtube.com/embed/example3"
      }
    ],
    quiz: {
      maxAttempts: 3,
      questions: [
        {
          type: 'multiple_choice',
          question: '¿Cuál es la longitud mínima recomendada para una contraseña segura?',
          answers: [
            '12 caracteres',
            '8 caracteres',
            '6 caracteres',
            '4 caracteres'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Una contraseña de 12 caracteres es más segura y resistente a ataques de fuerza bruta.',
          incorrectFeedback: 'Incorrecto. Se recomienda una longitud mínima de 12 caracteres para mayor seguridad.'
        },
        {
          type: 'true_false',
          question: 'Es seguro usar la misma contraseña para múltiples cuentas siempre que sea una contraseña fuerte.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! Cada cuenta debe tener una contraseña única para evitar que un compromiso afecte a múltiples cuentas.',
          incorrectFeedback: 'Incorrecto. Usar la misma contraseña en múltiples cuentas aumenta el riesgo de seguridad, incluso si es una contraseña fuerte.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es un gestor de contraseñas?',
          answers: [
            'Una herramienta que almacena y gestiona contraseñas de forma segura y encriptada',
            'Un programa que solo genera contraseñas aleatorias',
            'Un sistema de recuperación de contraseñas',
            'Un tipo de autenticación biométrica'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Un gestor de contraseñas almacena y gestiona contraseñas de forma segura y encriptada, permitiendo usar contraseñas únicas y complejas.',
          incorrectFeedback: 'Incorrecto. Un gestor de contraseñas es una herramienta que almacena y gestiona contraseñas de forma segura y encriptada.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué elementos debe incluir una contraseña fuerte?',
          answers: [
            'Letras mayúsculas, minúsculas, números y símbolos especiales',
            'Solo letras y números',
            'Solo números y símbolos',
            'Solo letras mayúsculas y minúsculas'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Una contraseña fuerte debe incluir una combinación de letras mayúsculas, minúsculas, números y símbolos especiales.',
          incorrectFeedback: 'Incorrecto. Una contraseña fuerte debe incluir una combinación de letras mayúsculas, minúsculas, números y símbolos especiales.'
        },
        {
          type: 'multiple_choice',
          question: '¿Con qué frecuencia se recomienda cambiar las contraseñas?',
          answers: [
            'Cada 3-6 meses',
            'Una vez al año',
            'Solo cuando hay una sospecha de compromiso',
            'Nunca, una vez establecida'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Se recomienda cambiar las contraseñas cada 3-6 meses como medida de seguridad preventiva.',
          incorrectFeedback: 'Incorrecto. Se recomienda cambiar las contraseñas cada 3-6 meses como medida de seguridad preventiva.'
        },
        {
          type: 'true_false',
          question: 'La autenticación de dos factores (2FA) es suficiente para proteger completamente una cuenta.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! Aunque 2FA mejora significativamente la seguridad, debe combinarse con contraseñas fuertes y otras medidas de seguridad.',
          incorrectFeedback: 'Incorrecto. 2FA debe combinarse con contraseñas fuertes y otras medidas de seguridad.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es la autenticación multifactor (MFA)?',
          answers: [
            'Un método que requiere múltiples formas de verificación para acceder a una cuenta',
            'Un sistema que usa múltiples contraseñas',
            'Un método que requiere cambiar la contraseña varias veces',
            'Un sistema de respaldo de contraseñas'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! MFA requiere múltiples formas de verificación (algo que sabes, algo que tienes, algo que eres) para acceder a una cuenta.',
          incorrectFeedback: 'Incorrecto. MFA es un método que requiere múltiples formas de verificación para acceder a una cuenta.'
        },
        {
          type: 'true_false',
          question: 'Es seguro compartir contraseñas con colegas de confianza si es necesario para el trabajo.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! Las contraseñas son personales y no deben compartirse, incluso con colegas de confianza. Existen métodos más seguros para compartir acceso.',
          incorrectFeedback: 'Incorrecto. Las contraseñas son personales y no deben compartirse. Existen métodos más seguros para compartir acceso.'
        },
        {
          type: 'multiple_choice',
          question: '¿Cuál es el mejor método para recordar múltiples contraseñas fuertes?',
          answers: [
            'Usar un gestor de contraseñas confiable',
            'Guardarlas en un archivo de texto',
            'Usar variaciones de la misma contraseña',
            'Escribirlas en un papel'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Un gestor de contraseñas es la forma más segura y conveniente de gestionar múltiples contraseñas fuertes.',
          incorrectFeedback: 'Incorrecto. Un gestor de contraseñas es la forma más segura y conveniente de gestionar múltiples contraseñas.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué tipo de información no debe incluirse en una contraseña?',
          answers: [
            'Información personal fácil de adivinar (fechas, nombres, etc.)',
            'Números aleatorios',
            'Símbolos especiales',
            'Letras mayúsculas y minúsculas'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! No se debe usar información personal fácil de adivinar en las contraseñas, ya que puede ser vulnerable a ataques de ingeniería social.',
          incorrectFeedback: 'Incorrecto. No se debe usar información personal fácil de adivinar en las contraseñas.'
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
      const attemptsRef = ref(rtdb, `quizAttempts/${auth.currentUser.uid}/2`);
      const bestScoreRef = ref(rtdb, `bestQuizScores/${auth.currentUser.uid}/2`);
      const moduleProgressRef = ref(rtdb, `users/${auth.currentUser.uid}/progress/2`);

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

      onValue(moduleProgressRef, (snapshot) => {
        const progress = snapshot.val();
        if (progress && progress.completed) {
          setQuizCompleted(true);
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

export default Module2; 