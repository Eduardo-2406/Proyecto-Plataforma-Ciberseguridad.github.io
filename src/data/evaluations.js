export const evaluationsData = {
  'eval1': {
    id: 'eval1',
    title: 'Evaluación General de Ciberseguridad',
    description: 'Evalúa tus conocimientos sobre conceptos fundamentales de ciberseguridad, gestión de contraseñas, phishing y protección de datos.',
    image: '/images/evaluations/general.jpg',
    duration: 60,
    totalQuestions: 30,
    passingScore: 70,
    tags: ['Fundamentos', 'Contraseñas', 'Phishing', 'Datos'],
    questions: [
      // Módulo 1: Introducción a la Ciberseguridad
      {
        id: 'q1',
        type: 'multiple_choice',
        text: '¿Qué es la ciberseguridad?',
        options: [
          'La protección de sistemas informáticos contra accesos no autorizados',
          'Solo la protección de contraseñas',
          'Un tipo de software antivirus',
          'La gestión de redes sociales'
        ],
        correctAnswer: 0
      },
      {
        id: 'q2',
        type: 'true_false',
        text: 'La ciberseguridad solo es importante para grandes empresas.',
        correctAnswer: false
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        text: '¿Cuál es el objetivo principal de la ciberseguridad?',
        options: [
          'Proteger la información y los sistemas',
          'Aumentar la velocidad de internet',
          'Reducir costos de hardware',
          'Mejorar el diseño de páginas web'
        ],
        correctAnswer: 0
      },
      {
        id: 'q4',
        type: 'multiple_choice',
        text: '¿Qué es una amenaza cibernética?',
        options: [
          'Cualquier acción que pueda comprometer la seguridad de un sistema',
          'Solo virus informáticos',
          'Errores de programación',
          'Problemas de hardware'
        ],
        correctAnswer: 0
      },
      {
        id: 'q5',
        type: 'true_false',
        text: 'Los empleados son la primera línea de defensa en ciberseguridad.',
        correctAnswer: true
      },

      // Módulo 2: Gestión de Contraseñas y MFA
      {
        id: 'q6',
        type: 'multiple_choice',
        text: '¿Cuál es la longitud mínima recomendada para una contraseña segura?',
        options: [
          '12 caracteres',
          '8 caracteres',
          '6 caracteres',
          '4 caracteres'
        ],
        correctAnswer: 0
      },
      {
        id: 'q7',
        type: 'true_false',
        text: 'Es seguro usar la misma contraseña para múltiples cuentas siempre que sea una contraseña fuerte.',
        correctAnswer: false
      },
      {
        id: 'q8',
        type: 'multiple_choice',
        text: '¿Qué es un gestor de contraseñas?',
        options: [
          'Una herramienta que almacena y gestiona contraseñas de forma segura y encriptada',
          'Un programa que solo genera contraseñas aleatorias',
          'Un sistema de recuperación de contraseñas',
          'Un tipo de autenticación biométrica'
        ],
        correctAnswer: 0
      },
      {
        id: 'q9',
        type: 'multiple_choice',
        text: '¿Qué elementos debe incluir una contraseña fuerte?',
        options: [
          'Letras mayúsculas, minúsculas, números y símbolos especiales',
          'Solo letras y números',
          'Solo números y símbolos',
          'Solo letras mayúsculas y minúsculas'
        ],
        correctAnswer: 0
      },
      {
        id: 'q10',
        type: 'true_false',
        text: 'La autenticación de dos factores (2FA) es suficiente para proteger completamente una cuenta.',
        correctAnswer: false
      },

      // Módulo 3: Phishing e Ingeniería Social
      {
        id: 'q11',
        type: 'multiple_choice',
        text: '¿Qué es el phishing?',
        options: [
          'Un tipo de ataque que intenta engañar a los usuarios para obtener información sensible',
          'Un virus informático',
          'Un tipo de spam',
          'Un error de software'
        ],
        correctAnswer: 0
      },
      {
        id: 'q12',
        type: 'true_false',
        text: 'Los correos electrónicos de phishing siempre contienen errores gramaticales.',
        correctAnswer: false
      },
      {
        id: 'q13',
        type: 'multiple_choice',
        text: '¿Qué debes hacer si recibes un correo electrónico sospechoso?',
        options: [
          'Verificar el remitente y no hacer clic en enlaces',
          'Responder al correo para verificar',
          'Hacer clic en los enlaces para verificar',
          'Reenviar el correo a colegas'
        ],
        correctAnswer: 0
      },
      {
        id: 'q14',
        type: 'true_false',
        text: 'El protocolo TLS es el estándar para cifrar comunicaciones por correo electrónico.',
        correctAnswer: true
      },
      {
        id: 'q15',
        type: 'multiple_choice',
        text: '¿Qué es la suplantación de identidad en correo electrónico?',
        options: [
          'Falsificar la dirección del remitente para parecer legítimo',
          'Cambiar la contraseña del correo',
          'Enviar correos masivos',
          'Bloquear correos no deseados'
        ],
        correctAnswer: 0
      },

      // Módulo 4: Protección y Privacidad de Datos
      {
        id: 'q16',
        type: 'multiple_choice',
        text: '¿Qué es la protección de datos sensibles?',
        options: [
          'El conjunto de medidas para salvaguardar información confidencial',
          'Solo el respaldo de archivos',
          'Un tipo de software antivirus',
          'La gestión de redes sociales'
        ],
        correctAnswer: 0
      },
      {
        id: 'q17',
        type: 'true_false',
        text: 'La encriptación de datos es opcional para información sensible.',
        correctAnswer: false
      },
      {
        id: 'q18',
        type: 'multiple_choice',
        text: '¿Cuál es el objetivo principal de las normativas de privacidad?',
        options: [
          'Proteger los derechos de los usuarios sobre sus datos personales',
          'Aumentar la velocidad de procesamiento de datos',
          'Reducir costos de almacenamiento',
          'Mejorar el diseño de bases de datos'
        ],
        correctAnswer: 0
      },
      {
        id: 'q19',
        type: 'true_false',
        text: 'Es necesario documentar todos los accesos a datos sensibles.',
        correctAnswer: true
      },
      {
        id: 'q20',
        type: 'multiple_choice',
        text: '¿Qué es una política de retención de datos?',
        options: [
          'Un conjunto de reglas que define cuánto tiempo se conservan los datos',
          'Un sistema de respaldo automático',
          'Un método de encriptación',
          'Un tipo de firewall'
        ],
        correctAnswer: 0
      },

      // Módulo 5: Respuesta a Incidentes
      {
        id: 'q21',
        type: 'multiple_choice',
        text: '¿Qué es un incidente de seguridad?',
        options: [
          'Un evento que compromete la seguridad de los sistemas o datos',
          'Un error de programación',
          'Una actualización de software',
          'Un cambio de contraseña'
        ],
        correctAnswer: 0
      },
      {
        id: 'q22',
        type: 'true_false',
        text: 'La detección temprana de incidentes reduce el impacto del ataque.',
        correctAnswer: true
      },
      {
        id: 'q23',
        type: 'multiple_choice',
        text: '¿Cuál es el primer paso en la respuesta a un incidente?',
        options: [
          'Contener el incidente para evitar su propagación',
          'Apagar todos los sistemas',
          'Cambiar todas las contraseñas',
          'Notificar a los medios'
        ],
        correctAnswer: 0
      },
      {
        id: 'q24',
        type: 'true_false',
        text: 'Es necesario documentar todos los pasos tomados durante la respuesta a un incidente.',
        correctAnswer: true
      },
      {
        id: 'q25',
        type: 'multiple_choice',
        text: '¿Qué es un plan de respuesta a incidentes?',
        options: [
          'Un conjunto de procedimientos para manejar incidentes de seguridad',
          'Un sistema de respaldo',
          'Un tipo de firewall',
          'Un método de encriptación'
        ],
        correctAnswer: 0
      },

      // Módulo 6: Simulaciones de Ciberataques
      {
        id: 'q26',
        type: 'multiple_choice',
        text: '¿Qué es una simulación de ciberataque?',
        options: [
          'Un ejercicio controlado que replica escenarios de ataque reales',
          'Un tipo de virus informático',
          'Un sistema de respaldo',
          'Un método de encriptación'
        ],
        correctAnswer: 0
      },
      {
        id: 'q27',
        type: 'true_false',
        text: 'Las simulaciones de ciberataques deben realizarse siempre en un entorno de prueba aislado.',
        correctAnswer: true
      },
      {
        id: 'q28',
        type: 'multiple_choice',
        text: '¿Cuál es el primer paso al planificar una simulación de ciberataque?',
        options: [
          'Definir el alcance y objetivos de la simulación',
          'Instalar herramientas de hacking',
          'Iniciar el ataque inmediatamente',
          'Notificar a los usuarios'
        ],
        correctAnswer: 0
      },
      {
        id: 'q29',
        type: 'true_false',
        text: 'Kali Linux es una distribución especializada para pruebas de penetración.',
        correctAnswer: true
      },
      {
        id: 'q30',
        type: 'multiple_choice',
        text: '¿Qué herramienta se utiliza comúnmente para escanear puertos en redes?',
        options: [
          'Nmap',
          'Wireshark',
          'Metasploit',
          'Burp Suite'
        ],
        correctAnswer: 0
      }
    ]
  },
  'eval2': {
    id: 'eval2',
    title: 'Evaluación Avanzada de Ciberseguridad',
    description: 'Pon a prueba tus conocimientos avanzados sobre respuesta a incidentes, simulaciones de ciberataques y protección de datos.',
    image: '/images/evaluations/avanzada.jpg',
    duration: 60,
    totalQuestions: 30,
    passingScore: 75,
    tags: ['Incidentes', 'Simulaciones', 'Datos', 'Seguridad'],
    questions: [
      // Módulo 1: Introducción a la Ciberseguridad
      {
        id: 'q1',
        type: 'multiple_choice',
        text: '¿Cuál es la diferencia entre seguridad de la información y ciberseguridad?',
        options: [
          'La ciberseguridad se enfoca en proteger sistemas digitales, mientras que la seguridad de la información protege todo tipo de información',
          'No hay diferencia, son términos intercambiables',
          'La seguridad de la información solo protege datos en papel',
          'La ciberseguridad solo protege redes'
        ],
        correctAnswer: 0
      },
      {
        id: 'q2',
        type: 'true_false',
        text: 'La ciberseguridad es un proceso continuo que requiere actualización constante.',
        correctAnswer: true
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        text: '¿Qué es el principio de menor privilegio?',
        options: [
          'Dar a los usuarios solo los permisos necesarios para realizar sus tareas',
          'Limitar el número de usuarios en el sistema',
          'Reducir el tiempo de acceso a los sistemas',
          'Eliminar todos los permisos de administrador'
        ],
        correctAnswer: 0
      },
      {
        id: 'q4',
        type: 'true_false',
        text: 'La capacitación en ciberseguridad es solo necesaria para el personal técnico.',
        correctAnswer: false
      },
      {
        id: 'q5',
        type: 'multiple_choice',
        text: '¿Qué es un vector de ataque?',
        options: [
          'El método o ruta que usa un atacante para comprometer un sistema',
          'Un tipo de virus',
          'Un sistema de defensa',
          'Una herramienta de monitoreo'
        ],
        correctAnswer: 0
      },

      // Módulo 2: Gestión de Contraseñas y MFA
      {
        id: 'q6',
        type: 'multiple_choice',
        text: '¿Por qué es importante usar contraseñas únicas para cada cuenta?',
        options: [
          'Para evitar que un compromiso en una cuenta afecte a otras',
          'Porque es más fácil de recordar',
          'Porque los sistemas lo requieren',
          'Porque es una moda'
        ],
        correctAnswer: 0
      },
      {
        id: 'q7',
        type: 'true_false',
        text: 'Los gestores de contraseñas son vulnerables a ataques y no deben usarse.',
        correctAnswer: false
      },
      {
        id: 'q8',
        type: 'multiple_choice',
        text: '¿Qué es la autenticación multifactor (MFA)?',
        options: [
          'Un método que requiere múltiples formas de verificación para acceder a una cuenta',
          'Un sistema que usa múltiples contraseñas',
          'Un método que requiere cambiar la contraseña varias veces',
          'Un sistema de respaldo de contraseñas'
        ],
        correctAnswer: 0
      },
      {
        id: 'q9',
        type: 'true_false',
        text: 'La autenticación biométrica es más segura que las contraseñas tradicionales.',
        correctAnswer: true
      },
      {
        id: 'q10',
        type: 'multiple_choice',
        text: '¿Cuál es el mejor método para compartir credenciales de forma segura?',
        options: [
          'Usar un gestor de contraseñas con función de compartir',
          'Enviar por correo electrónico',
          'Compartir por mensaje de texto',
          'Escribir en un papel'
        ],
        correctAnswer: 0
      },

      // Módulo 3: Phishing e Ingeniería Social
      {
        id: 'q11',
        type: 'multiple_choice',
        text: '¿Qué es la ingeniería social?',
        options: [
          'La manipulación psicológica para obtener información confidencial',
          'Un tipo de software malicioso',
          'Un método de encriptación',
          'Una técnica de programación'
        ],
        correctAnswer: 0
      },
      {
        id: 'q12',
        type: 'true_false',
        text: 'Los ataques de phishing solo se realizan por correo electrónico.',
        correctAnswer: false
      },
      {
        id: 'q13',
        type: 'multiple_choice',
        text: '¿Qué es un ataque de spear phishing?',
        options: [
          'Un ataque dirigido a una persona o organización específica',
          'Un ataque masivo a múltiples objetivos',
          'Un tipo de virus',
          'Un método de encriptación'
        ],
        correctAnswer: 0
      },
      {
        id: 'q14',
        type: 'true_false',
        text: 'Los filtros anti-spam son 100% efectivos contra el phishing.',
        correctAnswer: false
      },
      {
        id: 'q15',
        type: 'multiple_choice',
        text: '¿Qué es el vishing?',
        options: [
          'Phishing realizado por teléfono',
          'Un tipo de virus',
          'Un método de encriptación',
          'Una técnica de programación'
        ],
        correctAnswer: 0
      },

      // Módulo 4: Protección y Privacidad de Datos
      {
        id: 'q16',
        type: 'multiple_choice',
        text: '¿Qué es el cifrado de datos?',
        options: [
          'El proceso de convertir datos en un formato ilegible para protegerlos',
          'Un método de respaldo',
          'Un tipo de firewall',
          'Una técnica de programación'
        ],
        correctAnswer: 0
      },
      {
        id: 'q17',
        type: 'true_false',
        text: 'Los datos encriptados son imposibles de descifrar.',
        correctAnswer: false
      },
      {
        id: 'q18',
        type: 'multiple_choice',
        text: '¿Qué es una política de retención de datos?',
        options: [
          'Un conjunto de reglas que define cuánto tiempo se conservan los datos',
          'Un sistema de respaldo',
          'Un método de encriptación',
          'Un tipo de firewall'
        ],
        correctAnswer: 0
      },
      {
        id: 'q19',
        type: 'true_false',
        text: 'Es necesario documentar todos los accesos a datos sensibles.',
        correctAnswer: true
      },
      {
        id: 'q20',
        type: 'multiple_choice',
        text: '¿Qué es una auditoría de seguridad?',
        options: [
          'Una evaluación sistemática de las medidas de protección de datos',
          'Un tipo de software antivirus',
          'Un sistema de respaldo',
          'Un método de encriptación'
        ],
        correctAnswer: 0
      },

      // Módulo 5: Respuesta a Incidentes
      {
        id: 'q21',
        type: 'multiple_choice',
        text: '¿Qué es un plan de respuesta a incidentes?',
        options: [
          'Un conjunto de procedimientos para manejar incidentes de seguridad',
          'Un sistema de respaldo',
          'Un tipo de firewall',
          'Un método de encriptación'
        ],
        correctAnswer: 0
      },
      {
        id: 'q22',
        type: 'true_false',
        text: 'La comunicación efectiva es crucial durante la respuesta a un incidente.',
        correctAnswer: true
      },
      {
        id: 'q23',
        type: 'multiple_choice',
        text: '¿Qué es el análisis post-incidente?',
        options: [
          'La evaluación de lo que sucedió y cómo mejorar la respuesta futura',
          'Un tipo de software antivirus',
          'Un sistema de respaldo',
          'Un método de encriptación'
        ],
        correctAnswer: 0
      },
      {
        id: 'q24',
        type: 'true_false',
        text: 'Todos los incidentes de seguridad requieren la misma respuesta.',
        correctAnswer: false
      },
      {
        id: 'q25',
        type: 'multiple_choice',
        text: '¿Qué es la contención de un incidente?',
        options: [
          'Limitar el impacto y la propagación del incidente',
          'Eliminar todos los datos',
          'Apagar todos los sistemas',
          'Cambiar todas las contraseñas'
        ],
        correctAnswer: 0
      },

      // Módulo 6: Simulaciones de Ciberataques
      {
        id: 'q26',
        type: 'multiple_choice',
        text: '¿Qué es un entorno de prueba aislado?',
        options: [
          'Una red separada donde se realizan las simulaciones sin afectar sistemas productivos',
          'Un tipo de firewall',
          'Un sistema de respaldo',
          'Un método de encriptación'
        ],
        correctAnswer: 0
      },
      {
        id: 'q27',
        type: 'true_false',
        text: 'Es necesario documentar todos los hallazgos durante una simulación de ciberataque.',
        correctAnswer: true
      },
      {
        id: 'q28',
        type: 'multiple_choice',
        text: '¿Qué es una prueba de penetración?',
        options: [
          'Una evaluación autorizada de la seguridad de un sistema',
          'Un tipo de ataque malicioso',
          'Un método de respaldo',
          'Una técnica de programación'
        ],
        correctAnswer: 0
      },
      {
        id: 'q29',
        type: 'true_false',
        text: 'Las simulaciones de ciberataques deben realizarse sin notificar al personal.',
        correctAnswer: false
      },
      {
        id: 'q30',
        type: 'multiple_choice',
        text: '¿Qué es un informe de vulnerabilidades?',
        options: [
          'Un documento que detalla las debilidades encontradas en un sistema',
          'Un tipo de malware',
          'Un sistema de respaldo',
          'Un método de encriptación'
        ],
        correctAnswer: 0
      }
    ]
  }
}; 