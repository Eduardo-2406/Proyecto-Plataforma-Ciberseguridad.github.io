import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.8,
        ease: "power2.inOut"
      }
    );

    return () => {
      gsap.to(contentRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power2.inOut"
      });
    };
  }, [location.pathname]);

  return (
    <div ref={contentRef}>
      {children}
    </div>
  );
};

export default PageTransition; 