import React, { useState, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/WeeklyChallenge.css';

const WeeklyChallenge = () => {
  const { currentUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Simular carga del reto semanal
    setChallenge({
      id: 1,
      title: 'Análisis de Vulnerabilidades',
      description: 'Identifica y documenta las vulnerabilidades en el siguiente escenario de red.',
      scenario: 'Una empresa ha reportado intentos de acceso no autorizado a su servidor web. Analiza los logs proporcionados y determina el tipo de ataque, las vulnerabilidades explotadas y las recomendaciones de mitigación.',
      points: 500,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      submissions: 45
    });
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submission.trim()) return;

    try {
      // Aquí iría la lógica para guardar la submission en Firebase
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting challenge:', error);
    }
  };

  if (loading) {
    return <div className="weekly-challenge loading">Cargando reto semanal...</div>;
  }

  return (
    <div className="weekly-challenge">
      <div className="challenge-header">
        <h2>Reto Semanal</h2>
        <div className="challenge-meta">
          <span className="challenge-points">+{challenge.points} puntos</span>
          <span className="challenge-deadline">
            Fecha límite: {new Date(challenge.deadline).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="challenge-content">
        <h3>{challenge.title}</h3>
        <p>{challenge.description}</p>
        
        <div className="challenge-scenario">
          <h4>Escenario:</h4>
          <p>{challenge.scenario}</p>
        </div>

        <div className="challenge-stats">
          <div className="stat">
            <span className="stat-value">{challenge.submissions}</span>
            <span className="stat-label">Participantes</span>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="challenge-submission">
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Describe tu análisis y recomendaciones..."
              rows="6"
              required
            />
            <button type="submit" className="submit-button">
              Enviar Solución
            </button>
          </form>
        ) : (
          <div className="submission-success">
            <p>¡Solución enviada con éxito!</p>
            <p>Recibirás retroalimentación pronto.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyChallenge; 