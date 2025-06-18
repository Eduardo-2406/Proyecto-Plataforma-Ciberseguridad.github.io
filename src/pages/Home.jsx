import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import AnimatedText from '../components/animations/AnimatedText';
import styled from 'styled-components';
import { gsap } from 'gsap';
import heroImage from '../assets/images/hero-image.jpg';
import '../styles/Home.css';

const Card = ({ title, description, navigateLink }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    const content = document.querySelector('.home-container');
    if (content) {
      gsap.to(content, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          navigate(navigateLink);
        }
      });
    } else {
      navigate(navigateLink);
    }
  };

  return (
    <StyledWrapper>
      <div className="card">
        <div className="card-details">
          <p className="text-title">{title}</p>
          <p className="text-body">{description}</p>
        </div>
        <button className="card-button" onClick={handleButtonClick}>Ver más</button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
   width: 300px; /* Increased fixed width for larger cards */
   height: 350px; /* Increased fixed height for uniform size */
   border-radius: 20px;
   background: #f5f5f5;
   position: relative;
   padding: 1.8rem;
   border: 2px solid #c3c6ce;
   transition: 0.5s ease-out;
   overflow: hidden; /* Hide overflow */
   display: flex; /* Use flexbox for internal layout */
   flex-direction: column;
   justify-content: space-between;
   padding-bottom: 4rem; /* Add padding at the bottom for the button */
  }

  .card-details {
   color: black;
   gap: .5em;
   display: flex; /* Use flexbox for details */
   flex-direction: column;
   flex-grow: 1;
   margin-bottom: 1rem; /* Space before button */
   overflow: hidden; /* Hide overflow to prevent text pushing button down */
  }

  .card-button {
   transform: translate(-50%, 125%); /* Keep original transform for initial state */
   width: 80%; /* Increase button width */
   border-radius: 1rem;
   border: none;
   background-color: #008bf8;
   color: #fff;
   font-size: 1rem;
   padding: .75rem 1rem;
   position: absolute;
   left: 50%;
   bottom: 0; /* Start at the very bottom */
   opacity: 0;
   transition: 0.3s ease-out;
   cursor: pointer;
   z-index: 10;
  }

  .text-body {
   color: #555; /* Darker gray text color */
   flex-grow: 1;
   overflow: hidden;
   text-overflow: ellipsis;
  }

  /*Text*/
  .text-title {
   font-size: 1.5em;
   font-weight: bold;
   margin-bottom: 0.5em;
  }

  /*Hover*/
  .card:hover {
   border-color: #008bf8;
   box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
  }

  /* Adjust hover effect on button to be fully visible */
  .card:hover .card-button {
   transform: translate(-50%, -10%); /* Adjust transform to be fully visible */
   opacity: 1;
  }
`;

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-container" style={{ backgroundColor: 'white' }}>
      <section className="welcome-section">
        <div className="welcome-background">
          <div className="welcome-content">
            <div className="welcome-text">
              <AnimatedText
                text="BIENVENIDO A LA PLATAFORMA DE CIBERSEGURIDAD"
                className="animated-title"
                type="h1"
              />
              <AnimatedText
                text="Tu centro de aprendizaje en seguridad informática"
                className="animated-subtitle"
                type="h2"
              />
            </div>
            <div className="image-content">
              <img 
                src={heroImage} 
                alt="Ciberseguridad Hero" 
                className="welcome-hero-img-mobile-hide"
              />
            </div>
          </div>
          {/* Flecha animada al final de la sección de bienvenida */}
          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: '2rem',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            pointerEvents: 'none'
          }}>
            <motion.div
              initial={{ y: 0, opacity: 0.7 }}
              animate={{ y: 20, opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
              style={{ fontSize: '3rem', color: '#008bf8', filter: 'drop-shadow(0 2px 6px #008bf8aa)' }}
            >
              <i className="fas fa-chevron-down" />
            </motion.div>
            <span style={{ fontSize: '1rem', color: '#888', marginTop: '0.2rem' }}>Desliza hacia abajo</span>
          </div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="features-section"
      >
        <AnimatedText 
          text="Recursos Clave para tu Desarrollo Profesional"
          className="animated-heading"
          type="h3"
        />
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px', justifyContent: 'center' }}>
          <Card
            title="Módulos de Aprendizaje"
            description="Accede a contenido especializado y actualizado en diversas áreas de ciberseguridad, diseñado para potenciar tus habilidades técnicas y conocimientos estratégicos."
            navigateLink="/modules"
          />
          <Card
            title="Evaluaciones y Certificaciones"
            description="Mide tu comprensión con evaluaciones prácticas y obtén certificados reconocidos que validan tus competencias en seguridad informática ante la empresa."
            navigateLink="/evaluations"
          />
          <Card
            title="Foro de Colaboración"
            description="Conéctate con colegas y expertos en ciberseguridad. Comparte conocimientos, resuelve dudas y participa en discusiones relevantes para fortalecer la seguridad en nuestro entorno de trabajo."
            navigateLink="/forum"
          />
          <Card
            title="Seguimiento de Progreso"
            description="Visualiza tu trayectoria de aprendizaje, identifica tus logros y mantente al tanto de tus avances en los diferentes módulos y evaluaciones para un desarrollo continuo."
            navigateLink="/progress"
          />
           <Card
            title="Certificados Obtenidos"
            description="Revisa y gestiona los certificados que has obtenido al completar exitosamente los módulos y evaluaciones. Documenta tus logros y especializaciones en ciberseguridad."
            navigateLink="/certificates"
          />
          <Card
            title="Recursos de Ciberseguridad"
            description="Accede a recursos, noticias, consejos y cursos gratuitos recomendados para fortalecer tu seguridad digital."
            navigateLink="/resources"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="evaluations-section"
      >
        {/* Contenido de las evaluaciones */}
      </motion.div>

      <section className="cta-section">
        <h2>¡Fortalece tu Perfil en Ciberseguridad!</h2>
        <p>
          Accede a contenido especializado, obtén certificaciones reconocidas y forma parte de una comunidad comprometida con la seguridad digital.
        </p>
      </section>
    </div>
  );
};

export default Home;