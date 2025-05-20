import React from 'react';
import BaseModule from './BaseModule';

const Module1 = () => {
  const moduleData = {
    title: "Introducción a la Ciberseguridad",
    description: "Aprende los conceptos fundamentales de la ciberseguridad y su importancia en el entorno empresarial actual.",
    moduleId: 1,
    nextModuleId: 2,
    sections: [
      {
        id: "intro",
        title: "¿Qué es la Ciberseguridad?",
        content: "La ciberseguridad es la práctica de proteger sistemas, redes y programas de ataques digitales. Estos ciberataques suelen tener como objetivo acceder, modificar o destruir información sensible, extorsionar a usuarios o interrumpir la continuidad del negocio.",
        points: [
          "Protección de sistemas y redes",
          "Prevención de ataques digitales",
          "Resguardo de información sensible",
          "Continuidad del negocio"
        ]
      },
      {
        id: "importance",
        title: "Importancia en el Entorno Empresarial",
        content: "En la era digital, la ciberseguridad se ha convertido en una prioridad para las empresas. Los ataques cibernéticos pueden resultar en pérdidas financieras significativas, daño a la reputación y pérdida de confianza de los clientes.",
        points: [
          "Protección de activos digitales",
          "Cumplimiento normativo",
          "Preservación de la reputación",
          "Confianza de los clientes"
        ]
      },
      {
        id: "threats",
        title: "Amenazas Comunes",
        content: "Las empresas enfrentan diversos tipos de amenazas cibernéticas. Es crucial conocerlas para poder implementar las medidas de protección adecuadas.",
        points: [
          "Malware y ransomware",
          "Phishing y suplantación de identidad",
          "Ataques de denegación de servicio",
          "Vulnerabilidades en software"
        ]
      }
    ],
    videos: [
      {
        title: "Fundamentos de Ciberseguridad",
        url: "https://www.youtube.com/embed/your-video-id-1"
      },
      {
        title: "Amenazas Cibernéticas Actuales",
        url: "https://www.youtube.com/embed/your-video-id-2"
      }
    ],
    quiz: {
      questions: [
        {
          type: 'multiple_choice',
          question: '¿Qué es la ciberseguridad?',
          answers: [
            'La protección de sistemas informáticos contra accesos no autorizados',
            'Solo la protección de contraseñas',
            'Un tipo de software antivirus',
            'La gestión de redes sociales'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! La ciberseguridad es la protección integral de sistemas informáticos.',
          incorrectFeedback: 'Incorrecto. La ciberseguridad es la protección de sistemas informáticos contra accesos no autorizados.'
        },
        {
          type: 'true_false',
          question: 'La ciberseguridad solo es importante para grandes empresas.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! La ciberseguridad es importante para empresas de todos los tamaños.',
          incorrectFeedback: 'Incorrecto. La ciberseguridad es crucial para empresas de todos los tamaños.'
        },
        {
          type: 'multiple_choice',
          question: '¿Cuál es el objetivo principal de la ciberseguridad?',
          answers: [
            'Proteger la información y los sistemas',
            'Aumentar la velocidad de internet',
            'Reducir costos de hardware',
            'Mejorar el diseño de páginas web'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! El objetivo principal es proteger la información y los sistemas.',
          incorrectFeedback: 'Incorrecto. El objetivo principal es proteger la información y los sistemas.'
        },
        {
          type: 'matching',
          question: 'Relaciona cada amenaza con su descripción:',
          items: [
            { left: 'Malware' },
            { left: 'Phishing' },
            { left: 'Ransomware' },
            { left: 'Ataque DDoS' }
          ],
          options: [
            'Software malicioso que daña sistemas',
            'Engaño para obtener información sensible',
            'Secuestra datos y pide rescate',
            'Sobrecarga servidores con tráfico'
          ],
          correctAnswer: [0, 1, 2, 3],
          feedback: 'Cada amenaza tiene características específicas que la hacen única.'
        },
        {
          type: 'fill_blank',
          question: 'La sigla CIA en ciberseguridad significa Confidencialidad, Integridad y ________.',
          correctAnswer: 'Disponibilidad',
          feedback: 'La disponibilidad es crucial para asegurar que los sistemas estén accesibles cuando se necesiten.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es un firewall?',
          answers: [
            'Un sistema que controla el tráfico de red',
            'Un programa antivirus',
            'Un tipo de contraseña',
            'Un servidor web'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Un firewall es un sistema que controla el tráfico de red.',
          incorrectFeedback: 'Incorrecto. Un firewall es un sistema que controla el tráfico de red.'
        },
        {
          type: 'true_false',
          question: 'Las actualizaciones de software son importantes para la ciberseguridad.',
          correctAnswer: true,
          correctFeedback: '¡Correcto! Las actualizaciones parchean vulnerabilidades de seguridad.',
          incorrectFeedback: 'Incorrecto. Las actualizaciones son cruciales para mantener la seguridad.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es la autenticación de dos factores?',
          answers: [
            'Un método que requiere dos formas de verificación',
            'Un tipo de contraseña doble',
            'Un sistema de respaldo',
            'Un protocolo de red'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! La autenticación de dos factores requiere dos formas de verificación.',
          incorrectFeedback: 'Incorrecto. La autenticación de dos factores requiere dos formas de verificación.'
        }
      ]
    }
  };

  return <BaseModule {...moduleData} />;
};

export default Module1; 