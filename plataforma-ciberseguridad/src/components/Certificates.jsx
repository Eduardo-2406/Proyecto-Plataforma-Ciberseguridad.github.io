import React, { useState, useEffect } from 'react';
import { rtdb } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import '../styles/Certificates.css';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleDownload = async (certificate) => {
    try {
      // Crear un elemento canvas para el certificado
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Configurar el tamaño del canvas
      canvas.width = 1200;
      canvas.height = 800;
      
      // Fondo del certificado
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Borde decorativo
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 20;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      
      // Título
      ctx.fillStyle = '#1a202c';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Certificado de Ciberseguridad', canvas.width / 2, 120);
      
      // Subtítulo
      ctx.font = '32px Arial';
      ctx.fillText(certificate.title, canvas.width / 2, 180);
      
      // Contenido
      ctx.font = '24px Arial';
      ctx.fillText(`Otorgado a: ${certificate.recipientName}`, canvas.width / 2, 300);
      ctx.fillText(`Por completar exitosamente: ${certificate.evaluationTitle}`, canvas.width / 2, 350);
      ctx.fillText(`Con una puntuación de: ${certificate.score}%`, canvas.width / 2, 400);
      ctx.fillText(`Fecha de emisión: ${new Date(certificate.issueDate).toLocaleDateString()}`, canvas.width / 2, 450);
      
      // Código de verificación
      ctx.font = '20px Arial';
      ctx.fillText(`Código de verificación: ${certificate.verificationCode}`, canvas.width / 2, 550);
      
      // Convertir canvas a imagen y descargar
      const link = document.createElement('a');
      link.download = `certificado-${certificate.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error al generar el certificado:', error);
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
      <div className="certificates-container">
        <div className="loading">Cargando certificados...</div>
      </div>
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
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Mis Certificados
      </motion.h1>

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
    </div>
  );
};

export default Certificates; 