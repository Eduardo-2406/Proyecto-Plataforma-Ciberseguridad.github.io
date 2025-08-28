import React, { useState, useRef, useEffect } from 'react';

const OptimizedVideoFrame = ({ src, title, onLoad, className = "video-iframe" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);

  // Extraer el ID del video de YouTube de la URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Construir URL optimizada para YouTube
  const getOptimizedUrl = (originalUrl, useNoCookie = true) => {
    const videoId = getYouTubeVideoId(originalUrl);
    if (!videoId) return originalUrl;
    
    // Parámetros para reducir tracking y mejorar rendimiento
    const params = new URLSearchParams({
      rel: '0',          // No mostrar videos relacionados
      modestbranding: '1', // Branding mínimo de YouTube
      iv_load_policy: '3', // No mostrar anotaciones
      fs: '1',           // Permitir pantalla completa
      cc_load_policy: '0', // No cargar subtítulos por defecto
      disablekb: '0',    // Permitir controles de teclado
      playsinline: '1',  // Reproducir inline en móviles
      origin: window.location.origin // Dominio de origen
    });

    const domain = useNoCookie ? 'www.youtube-nocookie.com' : 'www.youtube.com';
    return `https://${domain}/embed/${videoId}?${params.toString()}`;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    // Intentar con YouTube normal si nocookie falla
    if (iframeRef.current && iframeRef.current.src.includes('youtube-nocookie')) {
      iframeRef.current.src = getOptimizedUrl(src, false);
    }
  };

  const optimizedSrc = getOptimizedUrl(src, true);

  if (hasError) {
    return (
      <div className={`${className} video-error`} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <p>⚠️ Error al cargar el video</p>
          <button onClick={() => window.open(src, '_blank')} style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Ver en YouTube
          </button>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={optimizedSrc}
      title={title}
      className={className}
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups"
      onLoad={handleLoad}
      onError={handleError}
      style={{
        border: 'none',
        opacity: isLoaded ? 1 : 0.7,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

export default OptimizedVideoFrame;
