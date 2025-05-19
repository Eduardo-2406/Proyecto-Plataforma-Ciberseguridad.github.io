import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/AnimatedText.css';

const AnimatedText = ({ text, className, type = 'h1' }) => {
  const words = text.split(' ');

  // Configuración de animación para el título principal
  const titleContainer = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.1 * i,
      },
    }),
  };

  // Configuración de animación para el subtítulo
  const subtitleContainer = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.5 + (0.04 * i),
      },
    }),
  };

  // Animación para palabras del título
  const titleChild = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // Animación para palabras del subtítulo
  const subtitleChild = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
      },
    },
  };

  const Tag = type;
  const containerVariants = className.includes('title') ? titleContainer : subtitleContainer;
  const childVariants = className.includes('title') ? titleChild : subtitleChild;

  return (
    <motion.div
      className={`animated-text-container ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Tag>
        {words.map((word, index) => (
          <motion.span
            key={index}
            className="split-word"
            variants={childVariants}
          >
            {word}{' '}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
};

export default AnimatedText; 