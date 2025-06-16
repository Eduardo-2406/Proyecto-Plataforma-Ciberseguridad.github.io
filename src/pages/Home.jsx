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
    const content = document.querySelector('.home-container'); // Target the main home container
    if (content) {
      gsap.to(content, {
        opacity: 0,
        duration: 0.3, // Adjust duration as needed
        onComplete: () => {
          navigate(navigateLink); // Navigate after fade out
        }
      });
    } else {
      navigate(navigateLink); // Fallback navigation
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

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card {
      width: 95%; /* Adjust width for smaller screens */
      height: auto; /* Allow height to adjust */
      min-height: 300px; /* Minimum height for smaller screens */
      max-width: none; /* Remove max-width on smaller screens */
    }
  }
`;

const StyledHome = styled.div`
  /* Estilos base (desktop) */
  .welcome-section {
    min-height: 100vh;
    padding: 2rem;
    background-color: white;
  }

  .welcome-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
  }

  .text-content {
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #333;
    }

    h2 {
      font-size: 1.8rem;
      color: #666;
    }
  }

  .image-content {
    img {
      width: 100%;
      height: auto;
      max-width: 100%;
    }
  }

  .features-section {
    padding: 4rem 2rem;
    background-color: #f8f9fa;

    h3 {
      font-size: 2rem;
      text-align: center;
      margin-bottom: 2rem;
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .cta-section {
    padding: 4rem 2rem;
    background-color: #2563eb;
    color: white;
    text-align: center;

    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      max-width: 800px;
      margin: 0 auto;
    }
  }

  /* Tablet (1024px y menos) */
  @media (max-width: 1024px) {
    .welcome-content {
      max-width: 90%;
      gap: 1.5rem;
    }

    .text-content {
      h1 {
        font-size: 2.2rem;
      }

      h2 {
        font-size: 1.6rem;
      }
    }

    .features-grid {
      max-width: 90%;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    .cta-section {
      h2 {
        font-size: 1.8rem;
      }

      p {
        font-size: 1.1rem;
        padding: 0 1rem;
      }
    }
  }

  /* Móvil (768px y menos) */
  @media (max-width: 768px) {
    .welcome-section {
      padding: 0.5rem;
      min-height: calc(100vh - 4rem);
      margin-top: 4rem;
    }

    .welcome-content {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 0.5rem;
    }

    .text-content {
      h1 {
        font-size: 1.2rem;
        line-height: 1.2;
      }

      h2 {
        font-size: 1rem;
        line-height: 1.2;
      }
    }

    .image-content {
      order: -1;
      img {
        max-width: 60%;
        margin: 0 auto;
      }
    }

    .features-section {
      padding: 1rem 0.5rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .cta-section {
      padding: 1rem 0.5rem;
    }

    /* Deshabilitar sidebar en móvil */
    .sidebar {
      display: none !important;
      width: 0 !important;
      position: absolute !important;
      visibility: hidden !important;
    }

    /* Ajustar el contenido principal para que ocupe todo el ancho */
    .main-content {
      width: 100% !important;
      margin-left: 0 !important;
      padding: 0 !important;
    }

    /* Ajustar el contenedor principal */
    .home-container {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  }

  /* Móvil pequeño (360px y menos) */
  @media (max-width: 360px) {
    .welcome-section {
      padding: 0.8rem;
    }

    .text-content {
      h1 {
        font-size: 1.3rem;
      }

      h2 {
        font-size: 1rem;
      }
    }

    .image-content img {
      max-width: 85%;
    }

    .features-section h3 {
      font-size: 1.2rem;
    }

    .cta-section {
      h2 {
        font-size: 1.2rem;
      }

      p {
        font-size: 0.85rem;
      }
    }
  }
`;

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-container" style={{ backgroundColor: 'white' }}>
      <section className="welcome-section" style={{ 
        height: 'calc(100vh - 10px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'white'
      }}>
        <div className="welcome-background" style={{ backgroundColor: 'white' }}>
          <div className="welcome-content" style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: '40px', 
            maxWidth: '100%', 
            // padding: '1rem',
            position: 'relative'
          }}>
            <div style={{ 
              flex: 1,
              padding: '4.2rem',
              zIndex: 2
            }}>
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
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              position: 'relative', 
              zIndex: 1 
            }}>
              <img 
                src={heroImage} 
                alt="Ciberseguridad Hero" 
                style={{ 
                  maxWidth: '80%', 
                  height: 'auto',
                  transform: 'scale(1.7)'
                }} 
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