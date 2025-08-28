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
      
      // Configurar el tamaño responsivo del canvas
      const isSmallScreen = window.innerWidth < 768;
      canvas.width = isSmallScreen ? 1200 : 1600; // Responsivo
      canvas.height = isSmallScreen ? 850 : 1150;
      
      // Crear un fondo moderno con degradado diagonal
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ffffff'); // Blanco puro
      gradient.addColorStop(0.3, '#f8fbff'); // Azul muy sutil
      gradient.addColorStop(0.7, '#e8f4fd'); // Azul claro elegante
      gradient.addColorStop(1, '#dbeafe'); // Azul suave al final
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Elementos decorativos modernos - Círculos sutiles en las esquinas
      ctx.fillStyle = 'rgba(59, 130, 246, 0.03)'; // Azul muy transparente
      ctx.beginPath();
      ctx.arc(0, 0, 150, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(canvas.width, 0, 120, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(0, canvas.height, 100, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(canvas.width, canvas.height, 130, 0, 2 * Math.PI);
      ctx.fill();
      
      // Borde principal moderno con esquinas redondeadas simuladas
      ctx.strokeStyle = '#3b82f6'; // Azul moderno
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      
      // Borde interior elegante
      ctx.strokeStyle = '#1e40af'; // Azul más intenso
      ctx.lineWidth = 3;
      ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);
      
      // Línea decorativa superior
      ctx.strokeStyle = '#6366f1'; // Índigo elegante
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.25, 120);
      ctx.lineTo(canvas.width * 0.75, 120);
      ctx.stroke();

      // Configurar texto centrado
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Título principal moderno
      ctx.fillStyle = '#1e3a8a'; // Azul naval profundo
      ctx.font = `bold ${isSmallScreen ? '55px' : '75px'} Arial, sans-serif`;
      ctx.fillText('CERTIFICADO DE EXCELENCIA', canvas.width / 2, isSmallScreen ? 160 : 180);
      
      // Subtítulo elegante
      ctx.fillStyle = '#374151'; // Gris elegante
      ctx.font = `${isSmallScreen ? '28px' : '35px'} Arial, sans-serif`;
      ctx.fillText('EN CIBERSEGURIDAD', canvas.width / 2, isSmallScreen ? 200 : 230);
      
      // Texto de otorgamiento con estilo
      ctx.fillStyle = '#4b5563';
      ctx.font = `${isSmallScreen ? '32px' : '42px'} Arial, sans-serif`;
      ctx.fillText('Se otorga con orgullo a', canvas.width / 2, isSmallScreen ? 280 : 320);

      // Nombre del destinatario con letras CURSIVAS y estilo elegante
      ctx.fillStyle = '#1e40af'; // Azul profundo para el nombre
      ctx.font = `italic bold ${isSmallScreen ? '58px' : '78px'} cursive`;
      ctx.fillText(certificate.recipientName, canvas.width / 2, isSmallScreen ? 350 : 400);
      
      // Línea decorativa bajo el nombre
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const nameWidth = ctx.measureText(certificate.recipientName).width;
      ctx.moveTo((canvas.width - nameWidth) / 2 - 50, isSmallScreen ? 375 : 430);
      ctx.lineTo((canvas.width + nameWidth) / 2 + 50, isSmallScreen ? 375 : 430);
      ctx.stroke();

      // Texto intermedio elegante
      ctx.fillStyle = '#374151';
      ctx.font = `${isSmallScreen ? '28px' : '36px'} Arial, sans-serif`;
      ctx.fillText('por demostrar competencia excepcional en', canvas.width / 2, isSmallScreen ? 420 : 480);

      // Título de la evaluación destacado
      ctx.fillStyle = '#1e40af';
      ctx.font = `bold ${isSmallScreen ? '36px' : '48px'} Arial, sans-serif`;
      const maxWidth = canvas.width * 0.8;
      const words = certificate.evaluationTitle.split(' ');
      let line = '';
      const lines = [];
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      const startY = isSmallScreen ? 470 : 540;
      lines.forEach((line, index) => {
        ctx.fillText(line.trim(), canvas.width / 2, startY + (index * (isSmallScreen ? 35 : 45)));
      });

      // Sección de detalles con diseño moderno
      const detailsStartY = isSmallScreen ? 580 : 680;
      ctx.fillStyle = '#6b7280';
      ctx.font = `${isSmallScreen ? '24px' : '30px'} Arial, sans-serif`;
      
      // Crear cajas de detalles con fondo sutil
      const detailBoxWidth = canvas.width * 0.7;
      const detailBoxHeight = isSmallScreen ? 80 : 100;
      const detailBoxX = (canvas.width - detailBoxWidth) / 2;
      
      // Fondo para la sección de detalles
      ctx.fillStyle = 'rgba(249, 250, 251, 0.8)';
      ctx.fillRect(detailBoxX, detailsStartY - 20, detailBoxWidth, detailBoxHeight);
      
      // Detalles del certificado
      ctx.fillStyle = '#374151';
      ctx.font = `${isSmallScreen ? '22px' : '28px'} Arial, sans-serif`;
      
      const detailLines = [
        `Puntuación obtenida: ${certificate.score}%`,
        `Emitido por: ${certificate.issuer}`,
        `Fecha de emisión: ${new Date(certificate.issueDate).toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`
      ];
      
      detailLines.forEach((detail, index) => {
        ctx.fillText(detail, canvas.width / 2, detailsStartY + 10 + (index * (isSmallScreen ? 25 : 30)));
      });

      // Código de verificación con estilo moderno
      ctx.fillStyle = '#9ca3af';
      ctx.font = `${isSmallScreen ? '18px' : '22px'} monospace`;
      ctx.fillText(`Código de verificación: ${certificate.verificationCode}`, canvas.width / 2, canvas.height - (isSmallScreen ? 30 : 50));

      // Elementos decorativos finales - Estrellas o iconos
      ctx.fillStyle = '#fbbf24'; // Dorado para las estrellas
      ctx.font = `${isSmallScreen ? '20px' : '24px'} serif`;
      
      // Estrella izquierda
      ctx.fillText('★', canvas.width * 0.15, isSmallScreen ? 350 : 400);
      // Estrella derecha
      ctx.fillText('★', canvas.width * 0.85, isSmallScreen ? 350 : 400);
      
      // Sello/Badge de calidad en la esquina
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.beginPath();
      ctx.arc(canvas.width - 100, 100, 40, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#10b981';
      ctx.font = `bold ${isSmallScreen ? '12px' : '14px'} Arial, sans-serif`;
      ctx.fillText('CERTIFICADO', canvas.width - 100, 95);
      ctx.fillText('OFICIAL', canvas.width - 100, 110);

      // Líneas decorativas modernas en los laterales
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 2;
      
      // Línea izquierda
      ctx.beginPath();
      ctx.moveTo(80, canvas.height * 0.3);
      ctx.lineTo(80, canvas.height * 0.7);
      ctx.stroke();
      
      // Línea derecha
      ctx.beginPath();
      ctx.moveTo(canvas.width - 80, canvas.height * 0.3);
      ctx.lineTo(canvas.width - 80, canvas.height * 0.7);
      ctx.stroke();

      // Firma o logo (opcional)
      // const logo = new Image();
      // logo.src = 'https://cdn.statically.io/gh/Eduardo-2406/Proyecto-Plataforma-Ciberseguridad.github.io/main/public/images/Logo.png?format=webp&w=200'; // Logo optimizado con Statically
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