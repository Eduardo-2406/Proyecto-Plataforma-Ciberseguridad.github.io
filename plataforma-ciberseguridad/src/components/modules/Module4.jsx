import React from 'react';
import BaseModule from './BaseModule';

const Module4 = () => {
  const moduleData = {
    title: "Seguridad en Dispositivos Móviles",
    description: "Aprende a proteger tus dispositivos móviles y la información empresarial que contienen.",
    moduleId: 4,
    prevModuleId: 3,
    nextModuleId: 5,
    sections: [
      {
        id: "mobile-threats",
        title: "Amenazas en Dispositivos Móviles",
        content: "Los dispositivos móviles son objetivos frecuentes de ataques cibernéticos debido a la información sensible que contienen y su uso generalizado en entornos empresariales.",
        points: [
          "Malware móvil",
          "Aplicaciones maliciosas",
          "Redes WiFi inseguras",
          "Robo o pérdida física"
        ]
      },
      {
        id: "protection-measures",
        title: "Medidas de Protección",
        content: "Implementar medidas de seguridad adecuadas puede proteger significativamente los dispositivos móviles y la información que contienen.",
        points: [
          "Actualizaciones de sistema",
          "Antivirus móvil",
          "Cifrado de datos",
          "Control de acceso"
        ]
      },
      {
        id: "best-practices",
        title: "Mejores Prácticas",
        content: "Seguir buenas prácticas de seguridad puede prevenir la mayoría de los incidentes relacionados con dispositivos móviles.",
        points: [
          "Bloqueo de pantalla",
          "Copia de seguridad regular",
          "Uso de VPN",
          "Políticas BYOD"
        ]
      }
    ],
    videos: [
      {
        title: "Seguridad en Dispositivos Móviles",
        url: "https://www.youtube.com/embed/your-video-id-7"
      },
      {
        title: "Protección de Datos Empresariales",
        url: "https://www.youtube.com/embed/your-video-id-8"
      }
    ],
    quiz: {
      questions: [
        {
          type: 'multiple_choice',
          question: '¿Cuál es la amenaza más común en dispositivos móviles?',
          answers: [
            'Aplicaciones maliciosas',
            'Virus informáticos',
            'Spam',
            'Publicidad'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! Las aplicaciones maliciosas son la amenaza más común en dispositivos móviles.',
          incorrectFeedback: 'Incorrecto. Las aplicaciones maliciosas son la amenaza más común en dispositivos móviles.'
        },
        {
          type: 'true_false',
          question: 'Los dispositivos móviles son menos vulnerables que las computadoras de escritorio.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! Los dispositivos móviles son igualmente vulnerables y requieren protección.',
          incorrectFeedback: 'Incorrecto. Los dispositivos móviles son igualmente vulnerables a amenazas de seguridad.'
        },
        {
          type: 'matching',
          question: 'Relaciona cada medida de seguridad con su propósito:',
          items: [
            { left: 'Actualizaciones del sistema' },
            { left: 'Antivirus móvil' },
            { left: 'Cifrado de datos' },
            { left: 'Control de acceso' }
          ],
          options: [
            'Parchear vulnerabilidades de seguridad',
            'Detectar y eliminar malware',
            'Proteger información sensible',
            'Restringir acceso no autorizado'
          ],
          correctAnswer: [0, 1, 2, 3],
          feedback: 'Cada medida de seguridad tiene un propósito específico en la protección del dispositivo.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es el BYOD (Bring Your Own Device)?',
          answers: [
            'La política que permite usar dispositivos personales en el trabajo',
            'Un tipo de dispositivo móvil',
            'Un sistema de seguridad',
            'Una aplicación de respaldo'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! BYOD es la política que permite usar dispositivos personales en el trabajo.',
          incorrectFeedback: 'Incorrecto. BYOD es la política que permite usar dispositivos personales en el trabajo.'
        },
        {
          type: 'fill_blank',
          question: 'El ________ es una red privada virtual que protege la conexión a internet en dispositivos móviles.',
          correctAnswer: 'VPN',
          feedback: 'Una VPN (Red Privada Virtual) es esencial para proteger las conexiones en dispositivos móviles.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es el bloqueo de pantalla?',
          answers: [
            'Un mecanismo que protege el acceso al dispositivo',
            'Un tipo de virus',
            'Una aplicación de mensajería',
            'Un sistema de respaldo'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! El bloqueo de pantalla es un mecanismo que protege el acceso al dispositivo.',
          incorrectFeedback: 'Incorrecto. El bloqueo de pantalla es un mecanismo que protege el acceso al dispositivo.'
        },
        {
          type: 'true_false',
          question: 'Es seguro conectarse a cualquier red WiFi pública.',
          correctAnswer: false,
          correctFeedback: '¡Correcto! Las redes WiFi públicas pueden ser inseguras y deben evitarse.',
          incorrectFeedback: 'Incorrecto. Las redes WiFi públicas pueden ser inseguras y deben evitarse.'
        },
        {
          type: 'multiple_choice',
          question: '¿Qué es el borrado remoto?',
          answers: [
            'Una función que permite borrar datos del dispositivo a distancia',
            'Un tipo de malware',
            'Un sistema de respaldo',
            'Una aplicación de mensajería'
          ],
          correctAnswer: 0,
          correctFeedback: '¡Correcto! El borrado remoto permite borrar datos del dispositivo a distancia en caso de pérdida.',
          incorrectFeedback: 'Incorrecto. El borrado remoto es una función que permite borrar datos del dispositivo a distancia.'
        }
      ]
    }
  };

  return <BaseModule {...moduleData} />;
};

export default Module4; 