import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedText from '../components/animations/AnimatedText';
import { gsap } from 'gsap';
import { FaArrowUp } from 'react-icons/fa';
import heroImage from '../assets/images/hero-image.jpg';
import '../styles/Home.css';

const Card = ({ title, description, navigateLink }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleButtonClick = () => {
    // Si no hay usuario y es una ruta protegida, abrir LoginModal
    const protectedRoutes = ['/modules', '/evaluations', '/progress', '/certificates', '/forum', '/resources'];
    
    if (!currentUser && protectedRoutes.includes(navigateLink)) {
      // Abrir LoginModal usando evento personalizado
      window.dispatchEvent(new CustomEvent('openLoginModal'));
      return;
    }

    // Si hay usuario o es una ruta pública, navegar normalmente
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
    <motion.div 
      className="home-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="home-card-details">
        <p className="home-text-title">{title}</p>
        <p className="home-text-body">{description}</p>
      </div>
      <button className="home-card-button" onClick={handleButtonClick}>Ver más</button>
    </motion.div>
  );
};

const Home = () => {
  const { currentUser } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
          <div className="welcome-arrow" style={{
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

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className={`home-scroll-to-top ${showScrollTop ? 'visible' : ''}`}
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;