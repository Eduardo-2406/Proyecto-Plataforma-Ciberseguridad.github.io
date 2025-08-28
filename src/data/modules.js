export const modulesData = {
  "1": {
    "title": "Introducción a la Ciberseguridad",
    "description": "Conceptos fundamentales de ciberseguridad, amenazas comunes y medidas básicas de protección para MIPYMES financieras.",
    "image": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/introduccion.avif?format=webp&w=800",
    "duration": 2,
    "level": "Novato",
    "lessons": 3,
    "tags": ["Fundamentos", "Conceptos Básicos", "Amenazas"],
    "quiz": {
      "questions": [
        {
          "type": "multiple_choice",
          "question": "¿Qué es la ciberseguridad?",
          "answers": [
            "La protección de sistemas informáticos contra accesos no autorizados",
            "Solo la protección de contraseñas",
            "Un tipo de software antivirus",
            "La gestión de redes sociales"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! La ciberseguridad es la protección integral de sistemas informáticos.",
          "incorrectFeedback": "Incorrecto. La ciberseguridad es la protección de sistemas informáticos contra accesos no autorizados."
        },
        {
          "type": "true_false",
          "question": "La ciberseguridad solo es importante para grandes empresas.",
          "correctAnswer": false,
          "correctFeedback": "¡Correcto! La ciberseguridad es importante para empresas de todos los tamaños.",
          "incorrectFeedback": "Incorrecto. La ciberseguridad es crucial para empresas de todos los tamaños."
        },
        {
          "type": "multiple_choice",
          "question": "¿Cuál es el objetivo principal de la ciberseguridad?",
          "answers": [
            "Proteger la información y los sistemas",
            "Aumentar la velocidad de internet",
            "Reducir costos de hardware",
            "Mejorar el diseño de páginas web"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! El objetivo principal es proteger la información y los sistemas.",
          "incorrectFeedback": "Incorrecto. El objetivo principal es proteger la información y los sistemas."
        }
      ]
    }
  },
  "2": {
    "title": "Gestión de Contraseñas y MFA",
    "description": "Aprende las mejores prácticas para crear y gestionar contraseñas seguras, y la implementación de autenticación multifactor para proteger tus cuentas y sistemas.",
    "image": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/passwords.avif?format=webp&w=800",
    "duration": 3,
    "level": "Novato",
    "lessons": 4,
    "tags": ["Contraseñas", "MFA", "Autenticación", "Seguridad"],
    "quiz": {
      "questions": [
        {
          "type": "multiple_choice",
          "question": "¿Cuál es la longitud mínima recomendada para una contraseña segura?",
          "answers": [
            "12 caracteres",
            "8 caracteres",
            "6 caracteres",
            "4 caracteres"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Una contraseña de 12 caracteres es más segura y resistente a ataques de fuerza bruta.",
          "incorrectFeedback": "Incorrecto. Se recomienda una longitud mínima de 12 caracteres para mayor seguridad."
        },
        {
          "type": "true_false",
          "question": "Es seguro usar la misma contraseña para múltiples cuentas siempre que sea una contraseña fuerte.",
          "correctAnswer": false,
          "correctFeedback": "¡Correcto! Cada cuenta debe tener una contraseña única para evitar que un compromiso afecte a múltiples cuentas.",
          "incorrectFeedback": "Incorrecto. Usar la misma contraseña en múltiples cuentas aumenta el riesgo de seguridad, incluso si es una contraseña fuerte."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué es un gestor de contraseñas?",
          "answers": [
            "Una herramienta que almacena y gestiona contraseñas de forma segura y encriptada",
            "Un programa que solo genera contraseñas aleatorias",
            "Un sistema de recuperación de contraseñas",
            "Un tipo de autenticación biométrica"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Un gestor de contraseñas almacena y gestiona contraseñas de forma segura y encriptada, permitiendo usar contraseñas únicas y complejas.",
          "incorrectFeedback": "Incorrecto. Un gestor de contraseñas es una herramienta que almacena y gestiona contraseñas de forma segura y encriptada."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué elementos debe incluir una contraseña fuerte?",
          "answers": [
            "Letras mayúsculas, minúsculas, números y símbolos especiales",
            "Solo letras y números",
            "Solo números y símbolos",
            "Solo letras mayúsculas y minúsculas"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Una contraseña fuerte debe incluir una combinación de letras mayúsculas, minúsculas, números y símbolos especiales.",
          "incorrectFeedback": "Incorrecto. Una contraseña fuerte debe incluir una combinación de letras mayúsculas, minúsculas, números y símbolos especiales."
        },
        {
          "type": "multiple_choice",
          "question": "¿Con qué frecuencia se recomienda cambiar las contraseñas?",
          "answers": [
            "Cada 3-6 meses",
            "Una vez al año",
            "Solo cuando hay una sospecha de compromiso",
            "Nunca, una vez establecida"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Se recomienda cambiar las contraseñas cada 3-6 meses como medida de seguridad preventiva.",
          "incorrectFeedback": "Incorrecto. Se recomienda cambiar las contraseñas cada 3-6 meses como medida de seguridad preventiva."
        },
        {
          "type": "true_false",
          "question": "La autenticación de dos factores (2FA) es suficiente para proteger completamente una cuenta.",
          "correctAnswer": false,
          "correctFeedback": "¡Correcto! Aunque 2FA mejora significativamente la seguridad, debe combinarse con contraseñas fuertes y otras medidas de seguridad.",
          "incorrectFeedback": "Incorrecto. 2FA debe combinarse con contraseñas fuertes y otras medidas de seguridad."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué es la autenticación multifactor (MFA)?",
          "answers": [
            "Un método que requiere múltiples formas de verificación para acceder a una cuenta",
            "Un sistema que usa múltiples contraseñas",
            "Un método que requiere cambiar la contraseña varias veces",
            "Un sistema de respaldo de contraseñas"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! MFA requiere múltiples formas de verificación (algo que sabes, algo que tienes, algo que eres) para acceder a una cuenta.",
          "incorrectFeedback": "Incorrecto. MFA es un método que requiere múltiples formas de verificación para acceder a una cuenta."
        },
        {
          "type": "true_false",
          "question": "Es seguro compartir contraseñas con colegas de confianza si es necesario para el trabajo.",
          "correctAnswer": false,
          "correctFeedback": "¡Correcto! Las contraseñas son personales y no deben compartirse, incluso con colegas de confianza. Existen métodos más seguros para compartir acceso.",
          "incorrectFeedback": "Incorrecto. Las contraseñas son personales y no deben compartirse. Existen métodos más seguros para compartir acceso."
        },
        {
          "type": "multiple_choice",
          "question": "¿Cuál es el mejor método para recordar múltiples contraseñas fuertes?",
          "answers": [
            "Usar un gestor de contraseñas confiable",
            "Guardarlas en un archivo de texto",
            "Usar variaciones de la misma contraseña",
            "Escribirlas en un papel"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Un gestor de contraseñas es la forma más segura y conveniente de gestionar múltiples contraseñas fuertes.",
          "incorrectFeedback": "Incorrecto. Un gestor de contraseñas es la forma más segura y conveniente de gestionar múltiples contraseñas."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué tipo de información no debe incluirse en una contraseña?",
          "answers": [
            "Información personal fácil de adivinar (fechas, nombres, etc.)",
            "Números aleatorios",
            "Símbolos especiales",
            "Letras mayúsculas y minúsculas"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! No se debe usar información personal fácil de adivinar en las contraseñas, ya que puede ser vulnerable a ataques de ingeniería social.",
          "incorrectFeedback": "Incorrecto. No se debe usar información personal fácil de adivinar en las contraseñas."
        }
      ]
    }
  },
  "3": {
    "title": "Phishing e Ingeniería Social",
    "description": "Identifica y previene ataques de phishing y técnicas de ingeniería social dirigidas a instituciones financieras.",
    "image": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/phishing.avif?format=webp&w=800",
    "duration": 2,
    "level": "Defensor",
    "lessons": 3,
    "tags": ["Phishing", "Ingeniería Social", "Fraude"],
    "quiz": {
      "questions": [
        {
          "type": "multiple_choice",
          "question": "¿Qué es el phishing?",
          "answers": [
            "Un tipo de ataque que intenta engañar a los usuarios para obtener información sensible",
            "Un virus informático",
            "Un tipo de spam",
            "Un error de software"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! El phishing es un ataque que intenta engañar a los usuarios.",
          "incorrectFeedback": "Incorrecto. El phishing es un ataque que intenta engañar a los usuarios para obtener información sensible."
        },
        {
          "type": "true_false",
          "question": "Los correos electrónicos de phishing siempre contienen errores gramaticales.",
          "correctAnswer": false,
          "correctFeedback": "¡Correcto! Los ataques de phishing pueden ser muy sofisticados y sin errores.",
          "incorrectFeedback": "Incorrecto. Los ataques de phishing modernos pueden ser muy sofisticados y sin errores."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué debes hacer si recibes un correo electrónico sospechoso?",
          "answers": [
            "Verificar el remitente y no hacer clic en enlaces",
            "Responder al correo para verificar",
            "Hacer clic en los enlaces para verificar",
            "Reenviar el correo a colegas"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Siempre verifica el remitente y evita hacer clic en enlaces sospechosos.",
          "incorrectFeedback": "Incorrecto. Nunca debes interactuar con correos sospechosos."
        },
        {
          "type": "true_false",
          "question": "El protocolo TLS es el estándar para cifrar comunicaciones por correo electrónico.",
          "correctAnswer": true,
          "correctFeedback": "¡Correcto! TLS (Transport Layer Security) es el protocolo estándar para cifrar comunicaciones por correo electrónico.",
          "incorrectFeedback": "Incorrecto. TLS es el protocolo estándar para cifrar comunicaciones por correo electrónico."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué es un filtro anti-spam?",
          "answers": [
            "Un sistema que identifica y bloquea correos no deseados",
            "Un tipo de virus",
            "Un programa de respaldo",
            "Un sistema de autenticación"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Un filtro anti-spam identifica y bloquea correos no deseados.",
          "incorrectFeedback": "Incorrecto. Un filtro anti-spam es un sistema que identifica y bloquea correos no deseados."
        },
        {
          "type": "true_false",
          "question": "Es seguro abrir archivos adjuntos de correos electrónicos de remitentes desconocidos.",
          "correctAnswer": false,
          "correctFeedback": "¡Correcto! Nunca debes abrir archivos adjuntos de remitentes desconocidos.",
          "incorrectFeedback": "Incorrecto. Los archivos adjuntos pueden contener malware."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué es la suplantación de identidad en correo electrónico?",
          "answers": [
            "Falsificar la dirección del remitente para parecer legítimo",
            "Cambiar la contraseña del correo",
            "Enviar correos masivos",
            "Bloquear correos no deseados"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! La suplantación de identidad es falsificar la dirección del remitente.",
          "incorrectFeedback": "Incorrecto. La suplantación de identidad es falsificar la dirección del remitente."
        }
      ]
    }
  },
  "4": {
    "title": "Protección y Privacidad de Datos",
    "description": "Protección de información sensible y cumplimiento de normativas de privacidad en el sector financiero.",
    "image": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/datos.avif?format=webp&w=800",
    "duration": 2,
    "level": "Defensor",
    "lessons": 3,
    "tags": ["Datos", "Privacidad", "Cumplimiento"],
    "quiz": {
      "questions": [
        {
          "type": "multiple_choice",
          "question": "¿Qué es la protección de datos sensibles?",
          "answers": [
            "El conjunto de medidas para salvaguardar información confidencial",
            "Solo el respaldo de archivos",
            "Un tipo de software antivirus",
            "La gestión de redes sociales"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! La protección de datos sensibles implica un conjunto de medidas para salvaguardar información confidencial.",
          "incorrectFeedback": "Incorrecto. La protección de datos sensibles es el conjunto de medidas para salvaguardar información confidencial."
        },
        {
          "type": "true_false",
          "question": "La encriptación de datos es opcional para información sensible.",
          "correctAnswer": false,
          "correctFeedback": "¡Correcto! La encriptación es obligatoria para proteger datos sensibles.",
          "incorrectFeedback": "Incorrecto. La encriptación es una medida obligatoria para proteger datos sensibles."
        },
        {
          "type": "multiple_choice",
          "question": "¿Cuál es el objetivo principal de las normativas de privacidad?",
          "answers": [
            "Proteger los derechos de los usuarios sobre sus datos personales",
            "Aumentar la velocidad de procesamiento de datos",
            "Reducir costos de almacenamiento",
            "Mejorar el diseño de bases de datos"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! El objetivo principal es proteger los derechos de los usuarios sobre sus datos personales.",
          "incorrectFeedback": "Incorrecto. El objetivo principal es proteger los derechos de los usuarios sobre sus datos personales."
        },
        {
          "type": "true_false",
          "question": "Es necesario documentar todos los accesos a datos sensibles.",
          "correctAnswer": true,
          "correctFeedback": "¡Correcto! La documentación de accesos es crucial para la auditoría y seguridad.",
          "incorrectFeedback": "Incorrecto. Es obligatorio documentar todos los accesos a datos sensibles."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué es una política de retención de datos?",
          "answers": [
            "Un conjunto de reglas que define cuánto tiempo se conservan los datos",
            "Un sistema de respaldo automático",
            "Un método de encriptación",
            "Un tipo de firewall"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Una política de retención define el tiempo de conservación de los datos.",
          "incorrectFeedback": "Incorrecto. Una política de retención es un conjunto de reglas que define cuánto tiempo se conservan los datos."
        },
        {
          "type": "true_false",
          "question": "Los empleados deben recibir capacitación regular sobre protección de datos.",
          "correctAnswer": true,
          "correctFeedback": "¡Correcto! La capacitación regular es esencial para mantener la seguridad.",
          "incorrectFeedback": "Incorrecto. La capacitación regular es obligatoria para todos los empleados."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué es una auditoría de seguridad?",
          "answers": [
            "Una evaluación sistemática de las medidas de protección de datos",
            "Un tipo de software antivirus",
            "Un sistema de respaldo",
            "Un método de encriptación"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Una auditoría de seguridad es una evaluación sistemática de las medidas de protección.",
          "incorrectFeedback": "Incorrecto. Una auditoría de seguridad es una evaluación sistemática de las medidas de protección de datos."
        }
      ]
    }
  },
  "5": {
    "title": "Respuesta a Incidentes",
    "description": "Protocolos y procedimientos para detectar, reportar y responder a incidentes de seguridad.",
    "image": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/incidentes.avif?format=webp&w=800",
    "duration": 2,
    "level": "Protector",
    "lessons": 3,
    "tags": ["Incidentes", "Protocolos", "Respuesta"],
    "quiz": {
      "questions": [
        {
          "type": "multiple_choice",
          "question": "¿Qué es un incidente de seguridad?",
          "answers": [
            "Un evento que compromete la seguridad de los sistemas o datos",
            "Un error de programación",
            "Una actualización de software",
            "Un cambio de contraseña"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Un incidente de seguridad es un evento que compromete la seguridad de los sistemas o datos.",
          "incorrectFeedback": "Incorrecto. Un incidente de seguridad es un evento que compromete la seguridad de los sistemas o datos."
        },
        {
          "type": "true_false",
          "question": "La detección temprana de incidentes reduce el impacto del ataque.",
          "correctAnswer": true,
          "correctFeedback": "¡Correcto! La detección temprana es crucial para minimizar el impacto de los incidentes.",
          "incorrectFeedback": "Incorrecto. La detección temprana es fundamental para reducir el impacto de los incidentes."
        },
        {
          "type": "multiple_choice",
          "question": "¿Cuál es el primer paso en la respuesta a un incidente?",
          "answers": [
            "Contener el incidente para evitar su propagación",
            "Apagar todos los sistemas",
            "Cambiar todas las contraseñas",
            "Notificar a los medios"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! El primer paso es contener el incidente para evitar su propagación.",
          "incorrectFeedback": "Incorrecto. El primer paso es contener el incidente para evitar su propagación."
        },
        {
          "type": "true_false",
          "question": "Es necesario documentar todos los pasos tomados durante la respuesta a un incidente.",
          "correctAnswer": true,
          "correctFeedback": "¡Correcto! La documentación es crucial para el análisis posterior y la mejora de procesos.",
          "incorrectFeedback": "Incorrecto. La documentación es obligatoria para el análisis y mejora de procesos."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué es un plan de respuesta a incidentes?",
          "answers": [
            "Un conjunto de procedimientos para manejar incidentes de seguridad",
            "Un sistema de respaldo",
            "Un tipo de firewall",
            "Un método de encriptación"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Un plan de respuesta a incidentes define los procedimientos para manejar incidentes de seguridad.",
          "incorrectFeedback": "Incorrecto. Un plan de respuesta a incidentes es un conjunto de procedimientos para manejar incidentes de seguridad."
        },
        {
          "type": "true_false",
          "question": "La comunicación efectiva es crucial durante la respuesta a un incidente.",
          "correctAnswer": true,
          "correctFeedback": "¡Correcto! La comunicación efectiva es esencial para coordinar la respuesta.",
          "incorrectFeedback": "Incorrecto. La comunicación efectiva es fundamental durante la respuesta a incidentes."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué es el análisis post-incidente?",
          "answers": [
            "La evaluación de lo que sucedió y cómo mejorar la respuesta futura",
            "Un tipo de software antivirus",
            "Un sistema de respaldo",
            "Un método de encriptación"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! El análisis post-incidente evalúa lo sucedido y cómo mejorar la respuesta futura.",
          "incorrectFeedback": "Incorrecto. El análisis post-incidente es la evaluación de lo que sucedió y cómo mejorar la respuesta futura."
        }
      ]
    }
  },
  "6": {
    "title": "Simulaciones de Ciberataques",
    "description": "Aprende a realizar simulaciones de ciberataques de manera segura y controlada para fortalecer la seguridad de tu organización.",
    "image": "https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/modules/simulaciones.avif?format=webp&w=800",
    "duration": 3,
    "level": "Protector",
    "lessons": 4,
    "tags": ["Simulaciones", "Pentesting", "Herramientas"],
    "quiz": {
      "questions": [
        {
          "type": "multiple_choice",
          "question": "¿Qué es una simulación de ciberataque?",
          "answers": [
            "Un ejercicio controlado que replica escenarios de ataque reales",
            "Un tipo de virus informático",
            "Un sistema de respaldo",
            "Un método de encriptación"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Una simulación de ciberataque es un ejercicio controlado que replica escenarios de ataque reales.",
          "incorrectFeedback": "Incorrecto. Una simulación de ciberataque es un ejercicio controlado que replica escenarios de ataque reales."
        },
        {
          "type": "true_false",
          "question": "Las simulaciones de ciberataques deben realizarse siempre en un entorno de prueba aislado.",
          "correctAnswer": true,
          "correctFeedback": "¡Correcto! Es crucial realizar las simulaciones en un entorno de prueba aislado para evitar afectar sistemas productivos.",
          "incorrectFeedback": "Incorrecto. Las simulaciones siempre deben realizarse en un entorno de prueba aislado."
        },
        {
          "type": "multiple_choice",
          "question": "¿Cuál es el primer paso al planificar una simulación de ciberataque?",
          "answers": [
            "Definir el alcance y objetivos de la simulación",
            "Instalar herramientas de hacking",
            "Iniciar el ataque inmediatamente",
            "Notificar a los usuarios"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! El primer paso es definir claramente el alcance y objetivos de la simulación.",
          "incorrectFeedback": "Incorrecto. El primer paso es definir el alcance y objetivos de la simulación."
        },
        {
          "type": "true_false",
          "question": "Kali Linux es una distribución especializada para pruebas de penetración.",
          "correctAnswer": true,
          "correctFeedback": "¡Correcto! Kali Linux es una distribución especializada que incluye herramientas para pruebas de penetración.",
          "incorrectFeedback": "Incorrecto. Kali Linux es una distribución especializada para pruebas de penetración."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué herramienta se utiliza comúnmente para escanear puertos en redes?",
          "answers": [
            "Nmap",
            "Wireshark",
            "Metasploit",
            "Burp Suite"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Nmap es una herramienta especializada para el escaneo de puertos y redes.",
          "incorrectFeedback": "Incorrecto. Nmap es la herramienta especializada para escaneo de puertos."
        },
        {
          "type": "true_false",
          "question": "Es necesario documentar todos los hallazgos durante una simulación de ciberataque.",
          "correctAnswer": true,
          "correctFeedback": "¡Correcto! La documentación detallada es crucial para el análisis posterior y la mejora de la seguridad.",
          "incorrectFeedback": "Incorrecto. La documentación detallada es obligatoria durante las simulaciones."
        },
        {
          "type": "multiple_choice",
          "question": "¿Qué es un entorno de prueba aislado?",
          "answers": [
            "Una red separada donde se realizan las simulaciones sin afectar sistemas productivos",
            "Un tipo de firewall",
            "Un sistema de respaldo",
            "Un método de encriptación"
          ],
          "correctAnswer": 0,
          "correctFeedback": "¡Correcto! Un entorno de prueba aislado es una red separada para realizar simulaciones de forma segura.",
          "incorrectFeedback": "Incorrecto. Un entorno de prueba aislado es una red separada para realizar simulaciones de forma segura."
        }
      ]
    }
  }
}; 