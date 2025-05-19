import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GeneralEvaluation = ({ evaluationId }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const evaluationData = {
    1: {
      title: "Evaluación General de Ciberseguridad",
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: '¿Qué es la ciberseguridad?',
          options: [
            'Protección de datos digitales',
            'Creación de software',
            'Diseño de hardware'
          ],
          correctAnswer: 0,
          points: 2
        },
        {
          id: 2,
          type: 'multiple_choice',
          question: '¿Cuál de los siguientes es un tipo de malware?',
          options: [
            'Antivirus',
            'Firewall',
            'Ransomware'
          ],
          correctAnswer: 2,
          points: 2
        },
        {
          id: 3,
          type: 'open',
          question: 'Describe cómo protegerías una red doméstica.',
          points: 5,
          keywords: ['firewall', 'contraseñas', 'actualizaciones', 'antivirus']
        },
        {
          id: 4,
          type: 'open',
          question: '¿Cuáles son las principales amenazas cibernéticas que enfrentan las organizaciones hoy en día?',
          points: 5,
          keywords: ['ransomware', 'phishing', 'malware', 'ingeniería social']
        },
        {
          id: 5,
          type: 'open',
          question: '¿Qué medidas de seguridad implementarías para proteger los datos personales?',
          points: 5,
          keywords: ['cifrado', 'backups', 'autenticación', 'políticas']
        },
        {
          id: 6,
          type: 'multiple_choice',
          question: '¿Qué es el phishing?',
          options: [
            'Un tipo de virus informático',
            'Un ataque que busca obtener información personal a través de engaños',
            'Un software de seguridad'
          ],
          correctAnswer: 1,
          points: 2
        },
        {
          id: 7,
          type: 'multiple_choice',
          question: '¿Qué es un firewall?',
          options: [
            'Un dispositivo de hardware que filtra el tráfico de red no autorizado',
            'Un software que permite el acceso remoto a una computadora',
            'Un tipo de malware'
          ],
          correctAnswer: 0,
          points: 2
        },
        {
          id: 8,
          type: 'multiple_choice',
          question: '¿Cuál es la función de un antivirus?',
          options: [
            'Crear copias de seguridad',
            'Detectar y eliminar software malicioso',
            'Gestionar contraseñas'
          ],
          correctAnswer: 1,
          points: 2
        },
        {
          id: 9,
          type: 'multiple_choice',
          question: '¿Qué es el ransomware?',
          options: [
            'Un tipo de firewall',
            'Un tipo de malware que restringe el acceso a la información y pide un rescate a cambio',
            'Un software de protección de datos'
          ],
          correctAnswer: 1,
          points: 2
        },
        {
          id: 10,
          type: 'multiple_choice',
          question: '¿Qué es la autenticación multifactor (MFA)?',
          options: [
            'Una medida de seguridad que requiere más de una forma de verificación para acceder a un sistema',
            'Un software para gestionar contraseñas',
            'Un tipo de cifrado de datos'
          ],
          correctAnswer: 0,
          points: 2
        }
      ]
    },
    2: {
      title: "Evaluación Avanzada de Ciberseguridad",
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: '¿Qué es un ataque de denegación de servicio (DDoS)?',
          options: [
            'Un ataque que intenta hacer que un sistema sea inaccesible para sus usuarios',
            'Un tipo de malware',
            'Un método de cifrado'
          ],
          correctAnswer: 0,
          points: 2
        },
        {
          id: 2,
          type: 'multiple_choice',
          question: '¿Qué es el cifrado de extremo a extremo?',
          options: [
            'Un método de respaldo de datos',
            'Un sistema donde solo los usuarios finales pueden leer los mensajes',
            'Un tipo de firewall'
          ],
          correctAnswer: 1,
          points: 2
        },
        {
          id: 3,
          type: 'open',
          question: 'Explica la importancia de las actualizaciones de seguridad.',
          points: 5,
          keywords: ['vulnerabilidades', 'parches', 'seguridad', 'protección']
        },
        {
          id: 4,
          type: 'open',
          question: '¿Cómo implementarías una política de seguridad en una empresa?',
          points: 5,
          keywords: ['normas', 'procedimientos', 'capacitación', 'auditorías']
        },
        {
          id: 5,
          type: 'open',
          question: 'Describe el proceso de respuesta a un incidente de seguridad.',
          points: 5,
          keywords: ['identificación', 'contención', 'erradicación', 'recuperación']
        }
      ]
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const evaluateOpenQuestion = (answer, keywords) => {
    if (!answer) return 0;
    const answerLower = answer.toLowerCase();
    let points = 0;
    keywords.forEach(keyword => {
      if (answerLower.includes(keyword.toLowerCase())) {
        points += 1;
      }
    });
    return Math.min(points, 5);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let totalScore = 0;
    const currentEvaluation = evaluationData[evaluationId];

    currentEvaluation.questions.forEach(question => {
      if (question.type === 'multiple_choice') {
        if (answers[question.id] === question.correctAnswer) {
          totalScore += question.points;
        }
      } else if (question.type === 'open') {
        totalScore += evaluateOpenQuestion(answers[question.id], question.keywords);
      }
    });

    setScore(totalScore);
    setShowResults(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const currentEvaluation = evaluationData[evaluationId];

  return (
    <div className="evaluation-container">
      <h1>{currentEvaluation.title}</h1>
      
      {!showResults ? (
        <form onSubmit={handleSubmit}>
          {currentEvaluation.questions.map((question) => (
            <div key={question.id} className="evaluation-question">
              <h3>Pregunta {question.id}: {question.question}</h3>
              
              {question.type === 'multiple_choice' ? (
                question.options.map((option, index) => (
                  <label key={index}>
                    <input
                      type="radio"
                      name={`question${question.id}`}
                      value={index}
                      onChange={() => handleAnswerChange(question.id, index)}
                      checked={answers[question.id] === index}
                    />
                    {option}
                  </label>
                ))
              ) : (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  rows="4"
                  cols="50"
                  placeholder="Escribe tu respuesta aquí..."
                />
              )}
            </div>
          ))}

          <div className="evaluation-buttons">
            <button type="submit">Enviar Evaluación</button>
          </div>
        </form>
      ) : (
        <div className="evaluation-results">
          <h2>Resultados de la Evaluación</h2>
          <p>Tu puntuación: {score} de {currentEvaluation.questions.reduce((acc, q) => acc + q.points, 0)} puntos</p>
          <div className="evaluation-buttons">
            <button onClick={handleRetry}>Reintentar</button>
            <button onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralEvaluation; 