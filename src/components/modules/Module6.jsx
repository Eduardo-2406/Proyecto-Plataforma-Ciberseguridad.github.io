import React, { useState, useEffect } from 'react';
import BaseModule from './BaseModule';
import { ref, onValue } from 'firebase/database';
import { auth, rtdb } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const Module6 = () => {
  const moduleData = {
    title: "Simulaciones de Ciberataques",
    description: "Aprende a realizar simulaciones de ciberataques de manera segura y controlada para fortalecer la seguridad de tu organización.",
    moduleId: "6",
    prevModuleId: "5",
    nextModuleId: null,
    sections: [
      {
        id: "simulation-basics",
        title: "Fundamentos de Simulaciones",
        content: "Las simulaciones de ciberataques son ejercicios controlados que replican escenarios de ataque reales para evaluar y mejorar la seguridad de los sistemas.",
        points: [
          "Tipos de simulaciones",
          "Entornos de prueba",
          "Planificación y alcance",
          "Documentación y reportes"
        ]
      },
      {
        id: "tools-and-environments",
        title: "Herramientas y Entornos",
        content: "Conoce las herramientas y entornos necesarios para realizar simulaciones de ciberataques de manera segura y efectiva.",
        points: [
          "Kali Linux - https://www.kali.org/get-kali/",
          "VirtualBox - https://www.virtualbox.org/wiki/Downloads",
          "VMware Workstation - https://www.vmware.com/products/workstation-pro/workstation-pro-evaluation.html",
          "Entornos de prueba aislados"
        ]
      },
      {
        id: "simulation-scenarios",
        title: "Escenarios de Simulación",
        content: "Aprende a crear y ejecutar diferentes escenarios de simulación para evaluar la seguridad de tu organización.",
        points: [
          "Simulación de phishing",
          "Pruebas de penetración web",
          "Análisis de vulnerabilidades",
          "Simulación de ataques internos"
        ]
      },
      {
        id: "best-practices",
        title: "Mejores Prácticas",
        content: "Implementa las mejores prácticas para realizar simulaciones de ciberataques de manera segura y efectiva.",
        points: [
          "Planificación detallada",
          "Documentación exhaustiva",
          "Análisis de resultados",
          "Mejoras continuas"
        ]
      }
    ],
    videos: [
      {
        title: "Introducción a Kali Linux",
        url: "https://www.youtube.com/embed/example1"
      },
      {
        title: "Configuración de Entornos de Prueba",
        url: "https://www.youtube.com/embed/example2"
      },
      {
        title: "Ejecución de Simulaciones",
        url: "https://www.youtube.com/embed/example3"
      }
    ],
    quiz: {
      maxAttempts: 3,
      questions: [
        {
          type: 'multiple_choice',
          question: '¿Qué es una simulación de ciberataque?',
          answers: [
            'Un ejercicio controlado que replica escenarios de ataque reales',
            'Un tipo de virus informático',
            'Un sistema de respaldo',
            'Un método de encriptación'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Una simulación de ciberataque es un ejercicio controlado que replica escenarios de ataque reales.',
          incorrectFeedback: 'Incorrecto. Una simulación de ciberataque es un ejercicio controlado que replica escenarios de ataque reales.'
        },
        {
          type: 'true_false',
          question: 'Las simulaciones de ciberataques deben realizarse siempre en un entorno de prueba aislado.',
          correctAnswer: true,
          correctFeedback: '¡Correcto! Es crucial realizar las simulaciones en un entorno de prueba aislado para evitar afectar sistemas productivos.',
          incorrectFeedback: 'Incorrecto. Las simulaciones siempre deben realizarse en un entorno de prueba aislado.'
        },
        {
          type: 'multiple_choice',
          question: '¿Cuál es el primer paso al planificar una simulación de ciberataque?',
          answers: [
            'Definir el alcance y objetivos de la simulación',
            'Instalar herramientas de hacking',
            'Iniciar el ataque inmediatamente',
            'Notificar a los usuarios'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! El primer paso es definir claramente el alcance y objetivos de la simulación.',
          incorrectFeedback: 'Incorrecto. El primer paso es definir el alcance y objetivos de la simulación.'
        },
        {
          type: 'true_false',
          question: 'Kali Linux es una distribución especializada para pruebas de penetración.',
          correctAnswer: true,
          correctFeedback: '¡Correcto! Kali Linux es una distribución especializada que incluye herramientas para pruebas de penetración.',
          incorrectFeedback: 'Incorrecto. Kali Linux es una distribución especializada para pruebas de penetración.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué herramienta se utiliza comúnmente para escanear puertos en redes?',
          answers: [
            'Nmap',
            'Wireshark',
            'Metasploit',
            'Burp Suite'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Nmap es una herramienta especializada para el escaneo de puertos y redes.',
          incorrectFeedback: 'Incorrecto. Nmap es la herramienta especializada para escaneo de puertos.'
        },
        {
          type: 'true_false',
          question: 'Es necesario documentar todos los hallazgos durante una simulación de ciberataque.',
          correctAnswer: true,
          correctFeedback: '¡Correcto! La documentación detallada es crucial para el análisis posterior y la mejora de la seguridad.',
          incorrectFeedback: 'Incorrecto. La documentación detallada es obligatoria durante las simulaciones.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es un entorno de prueba aislado?',
          answers: [
            'Una red separada donde se realizan las simulaciones sin afectar sistemas productivos',
            'Un tipo de firewall',
            'Un sistema de respaldo',
            'Un método de encriptación'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Un entorno de prueba aislado es una red separada para realizar simulaciones de forma segura.',
          incorrectFeedback: 'Incorrecto. Un entorno de prueba aislado es una red separada para realizar simulaciones de forma segura.'
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
      const attemptsRef = ref(rtdb, `quizAttempts/${auth.currentUser.uid}/6`);
      const bestScoreRef = ref(rtdb, `bestQuizScores/${auth.currentUser.uid}/6`);
      const moduleProgressRef = ref(rtdb, `users/${auth.currentUser.uid}/progress/6`);

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

export default Module6; 