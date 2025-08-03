import React, { useState, useEffect } from 'react';
import { rtdb } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import AnimatedText from './animations/AnimatedText';
import '../styles/Certificates.css';
import LoadingSpinner from './common/LoadingSpinner';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const certificatesRef = ref(rtdb, `users/${currentUser.uid}/certificates`);
    const unsubscribe = onValue(certificatesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const certificatesArray = Object.entries(data).map(([id, certificate]) => ({
            id,
            ...certificate
          }));
          setCertificates(certificatesArray);
        }
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los certificados');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Efecto para manejar el scroll y mostrar/ocultar el botón
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para hacer scroll hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDownload = async (certificate) => {
    try {
      // Crear un elemento canvas para el certificado
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Configurar el tamaño del canvas (tamaño estándar de certificado)
      canvas.width = 1400; // Ancho para un certificado apaisado más grande
      canvas.height = 1000;
      
      // Fondo del certificado (un degradado suave con colores de la paleta)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#e0f7fa'); // Un celeste muy claro
      gradient.addColorStop(0.5, '#e0f2f7'); // Azul claro
      gradient.addColorStop(1, '#cce9f1'); // Azul aún más claro
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Borde decorativo (diseño más elaborado)
      ctx.strokeStyle = '#0077cc'; // Azul vibrante
      ctx.lineWidth = 25; // Borde más notorio
      ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

      ctx.strokeStyle = '#005599'; // Azul más oscuro para un segundo borde
      ctx.lineWidth = 5;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      
      // Fuente principal para títulos (considerar fuentes personalizadas si están disponibles)
      const titleFontFamily = '' // Aquí podrías especificar una fuente personalizada si la tienes cargada

      // Título principal
      ctx.fillStyle = '#003366'; // Azul muy oscuro
      ctx.font = `bold 70px 'Arial, sans-serif'`; // Tamaño y peso
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICADO DE RECONOCIMIENTO', canvas.width / 2, 180);
      
      // Texto de otorgamiento
      ctx.fillStyle = '#1a202c';
      ctx.font = `40px 'Arial, sans-serif'`;
      ctx.fillText('Este certificado se otorga a', canvas.width / 2, 280);

      // Nombre del destinatario (resaltado y estilizado)
      ctx.fillStyle = '#001f3f'; // Casi negro, un azul muy oscuro
      ctx.font = `bold 65px 'Georgia, serif'`; // Fuente con serifa para distinción
      ctx.fillText(certificate.recipientName.toUpperCase(), canvas.width / 2, 380);

      // Texto intermedio
      ctx.fillStyle = '#1a202c';
      ctx.font = `35px 'Arial, sans-serif'`;
      ctx.fillText('por la exitosa completación de la evaluación', canvas.width / 2, 460);

      // Título de la evaluación (resaltado)
      ctx.fillStyle = '#001f3f';
      ctx.font = `bold 45px 'Arial, sans-serif'`;
      ctx.fillText(certificate.evaluationTitle, canvas.width / 2, 530);

      // Detalles adicionales (organizados)
      ctx.fillStyle = '#4a5568';
      ctx.font = `30px 'Arial, sans-serif'`;
      
      // Calcular posiciones para los detalles centrados
      const detailYStart = 650;
      const detailLineHeight = 40;

      ctx.fillText(`Puntuación obtenida: ${certificate.score}%`, canvas.width / 2, detailYStart);
      ctx.fillText(`Emitido por: ${certificate.issuer}`, canvas.width / 2, detailYStart + detailLineHeight);
      ctx.fillText(`Fecha de emisión: ${new Date(certificate.issueDate).toLocaleDateString()}`, canvas.width / 2, detailYStart + detailLineHeight * 2);

      // Código de verificación (más pequeño y discreto en la parte inferior)
      ctx.fillStyle = '#718096';
      ctx.font = `22px 'Arial, sans-serif'`;
      ctx.fillText(`Código de verificación: ${certificate.verificationCode}`, canvas.width / 2, canvas.height - 40);

      // Firma o logo (opcional)
      // const logo = new Image();
      // logo.src = '/images/logo.png'; // Asegúrate de tener un logo
      // logo.onload = () => { // Dibujar logo una vez cargado
      //   ctx.drawImage(logo, 100, canvas.height - 150, 100, 100); // Ajustar posición y tamaño
      //   // Convertir canvas a imagen y descargar (mover esto dentro del onload si usas logo)
      //   const link = document.createElement('a');
      //   link.download = `certificado-${certificate.id}.png`;
      //   link.href = canvas.toDataURL('image/png');
      //   link.click();
      // };

      // Convertir canvas a imagen y descargar
      const link = document.createElement('a');
      link.download = `certificado-${certificate.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error) {
      console.error('Error al generar el certificado en canvas:', error);
      alert('Error al generar el certificado');
    }
  };

  const handleShare = async (certificate) => {
    try {
      const shareData = {
        title: certificate.title,
        text: `¡He obtenido el certificado de ${certificate.evaluationTitle} en la Plataforma de Ciberseguridad!`,
        url: window.location.origin
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para navegadores que no soportan la API Web Share
        const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(text);
        alert('Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  if (loading) {
    return (
      <div className="certificates-container" />
    );
  }

  if (error) {
    return (
      <div className="certificates-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="certificates-container">
      <AnimatedText 
        text="Mis Certificados" 
        className="animated-title"
        type="h1" 
      />

      {certificates.length === 0 ? (
        <motion.div
          className="no-certificates"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="no-certificates-icon">
            <i className="fas fa-certificate" />
          </div>
          <h3>Aún no tienes certificados</h3>
          <p>
            Completa los módulos de aprendizaje y sus evaluaciones para obtener
            certificados que validen tus conocimientos en ciberseguridad.
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="certificates-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              className="certificate-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="certificate-header">
                <div className="certificate-icon">
                  <i className="fas fa-certificate" />
                </div>
                <div className="certificate-info">
                  <h3>{certificate.title}</h3>
                  <p className="issue-date">
                    Emitido el {new Date(certificate.issueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="certificate-details">
                <div className="detail-item">
                  <i className="fas fa-user" />
                  <span>{certificate.recipientName}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-graduation-cap" />
                  <span>{certificate.issuer}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-check-circle" />
                  <span>Puntuación: {certificate.score}%</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-shield-alt" />
                  <span>Código: {certificate.verificationCode}</span>
                </div>
              </div>

              <div className="certificate-actions">
                <button
                  className="download-button"
                  onClick={() => handleDownload(certificate)}
                >
                  <i className="fas fa-download" />
                  Descargar
                </button>
                <button
                  className="share-button"
                  onClick={() => handleShare(certificate)}
                >
                  <i className="fas fa-share-alt" />
                  Compartir
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Botón de scroll hacia arriba */}
      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Volver al inicio"
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </div>
  );
};

export default Certificates;