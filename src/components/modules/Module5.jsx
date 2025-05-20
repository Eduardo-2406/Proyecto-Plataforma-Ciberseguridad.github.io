import React from 'react';
import BaseModule from './BaseModule';

const Module5 = () => {
  const moduleData = {
    title: "Protección de Datos y Privacidad",
    description: "Aprende sobre la importancia de proteger los datos personales y empresariales, y cómo cumplir con las regulaciones de privacidad.",
    moduleId: 5,
    prevModuleId: 4,
    nextModuleId: 6,
    sections: [
      {
        id: "data-protection",
        title: "Protección de Datos",
        content: "La protección de datos es fundamental para mantener la confidencialidad y seguridad de la información personal y empresarial.",
        points: [
          "Clasificación de datos",
          "Almacenamiento seguro",
          "Transmisión cifrada",
          "Eliminación segura"
        ]
      },
      {
        id: "privacy-regulations",
        title: "Regulaciones de Privacidad",
        content: "Las empresas deben cumplir con diversas regulaciones de privacidad que protegen los datos personales de los usuarios y clientes.",
        points: [
          "GDPR (Reglamento General de Protección de Datos)",
          "LOPDGDD (Ley Orgánica de Protección de Datos)",
          "Derechos de los usuarios",
          "Obligaciones empresariales"
        ]
      },
      {
        id: "compliance",
        title: "Cumplimiento Normativo",
        content: "El cumplimiento de las regulaciones de privacidad requiere implementar medidas técnicas y organizativas adecuadas.",
        points: [
          "Evaluación de riesgos",
          "Políticas de privacidad",
          "Registro de actividades",
          "Auditorías regulares"
        ]
      }
    ],
    videos: [
      {
        title: "Protección de Datos Personales",
        url: "https://www.youtube.com/embed/your-video-id-9"
      },
      {
        title: "Cumplimiento de Regulaciones de Privacidad",
        url: "https://www.youtube.com/embed/your-video-id-10"
      }
    ],
    quiz: {
      questions: [
        {
          type: 'multiple_choice',
          question: '¿Qué es la protección de datos?',
          answers: [
            'El conjunto de medidas para proteger información personal y empresarial',
            'Solo el respaldo de archivos',
            'Un tipo de software antivirus',
            'Un método de encriptación'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! La protección de datos abarca todas las medidas para proteger información.',
          incorrectFeedback: 'Incorrecto. La protección de datos es el conjunto de medidas para proteger información personal y empresarial.'
        },
        {
          type: 'true_false',
          question: 'El GDPR solo aplica a empresas europeas.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! El GDPR aplica a cualquier empresa que procese datos de ciudadanos europeos.',
          incorrectFeedback: 'Incorrecto. El GDPR aplica a cualquier empresa que procese datos de ciudadanos europeos.'
        },
        {
          type: 'matching',
          question: 'Relaciona cada principio del GDPR con su descripción:',
          items: [
            { left: 'Licitud' },
            { left: 'Transparencia' },
            { left: 'Minimización' },
            { left: 'Limitación' }
          ],
          options: [
            'Procesamiento basado en una base legal',
            'Información clara sobre el procesamiento',
            'Solo datos necesarios para el fin',
            'Almacenamiento limitado en el tiempo'
          ],
          correctAnswer: [0, 1, 2, 3],
          feedback: 'Cada principio del GDPR tiene un propósito específico en la protección de datos.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es el cifrado de datos?',
          answers: [
            'Un método para convertir datos en un formato ilegible',
            'Un tipo de respaldo',
            'Un sistema de autenticación',
            'Una política de seguridad'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! El cifrado convierte datos en un formato ilegible para protegerlos.',
          incorrectFeedback: 'Incorrecto. El cifrado es un método para convertir datos en un formato ilegible.'
        },
        {
          type: 'fill_blank',
          question: 'El ________ es el derecho de los usuarios a solicitar sus datos personales.',
          correctAnswer: 'derecho de acceso',
          feedback: 'El derecho de acceso permite a los usuarios solicitar sus datos personales a las empresas.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es una evaluación de impacto?',
          answers: [
            'Un análisis de riesgos para el procesamiento de datos',
            'Un tipo de auditoría',
            'Un informe de seguridad',
            'Una política de privacidad'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! La evaluación de impacto analiza los riesgos del procesamiento de datos.',
          incorrectFeedback: 'Incorrecto. La evaluación de impacto es un análisis de riesgos para el procesamiento de datos.'
        },
        {
          type: 'true_false',
          question: 'Las empresas pueden almacenar datos personales indefinidamente.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! Los datos personales solo deben almacenarse mientras sean necesarios.',
          incorrectFeedback: 'Incorrecto. Los datos personales solo deben almacenarse mientras sean necesarios.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es el derecho al olvido?',
          answers: [
            'El derecho a solicitar la eliminación de datos personales',
            'Un tipo de respaldo',
            'Un método de cifrado',
            'Una política de seguridad'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! El derecho al olvido permite solicitar la eliminación de datos personales.',
          incorrectFeedback: 'Incorrecto. El derecho al olvido es el derecho a solicitar la eliminación de datos personales.'
        }
      ]
    }
  };

  return <BaseModule {...moduleData} />;
};

export default Module5; 