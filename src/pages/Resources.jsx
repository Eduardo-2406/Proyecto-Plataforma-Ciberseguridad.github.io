import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import AnimatedText from '../components/animations/AnimatedText';
import '../styles/Resources.css';

const resources = [
	{
		title: 'INCIBE - Gestores de contraseñas',
		description: 'Recomendaciones sobre gestores de contraseñas, antivirus y más.',
		url: 'https://www.incibe.es/protege-tu-empresa/herramientas',
		type: 'Recurso',
	},
	{
		title: 'Noticias de Ciberseguridad - CSO España',
		description: 'Actualidad y noticias sobre ciberseguridad.',
		url: 'https://cso.computerworld.es/',
		type: 'Noticias',
	},
	{
		title: 'Curso gratuito de Ciberseguridad - Google Actívate',
		description: 'Curso online gratuito para aprender los fundamentos de ciberseguridad.',
		url: 'https://learndigital.withgoogle.com/activate/course/cybersecurity',
		type: 'Curso',
	},
	{
		title: 'Consejos de Seguridad - OSI',
		description: 'Consejos prácticos para protegerte en Internet.',
		url: 'https://www.osi.es/es/consejos',
		type: 'Consejos',
	},
];

const resourceImages = {
	Recurso: '/images/recursos/gestores.avif',
	Noticias: '/images/recursos/noticias.avif',
	Curso: '/images/recursos/cursos.avif',
	Consejos: '/images/recursos/gestores.avif',
};

const Card = ({ title, description, url, type }) => {
	const handleButtonClick = () => {
		window.open(url, '_blank', 'noopener noreferrer');
	};

	return (
		<motion.div 
			className="resource-card"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			whileHover={{ y: -5 }}
		>
			<div className="resource-type-badge">{type}</div>
			<div className="card-image">
				<img
					src={resourceImages[type]}
					alt={type}
					loading="lazy"
				/>
			</div>
			<div className="card-details">
				<p className="text-title">{title}</p>
				<p className="text-body">{description}</p>
			</div>
			<button className="card-button" onClick={handleButtonClick}>
				Ver más
			</button>
		</motion.div>
	);
};

const Resources = () => {
	const [showScrollTop, setShowScrollTop] = useState(false);

	// Scroll to top functionality
	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.pageYOffset > 300);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className="resources-page">
			<AnimatedText text="Recursos de Ciberseguridad" className="animated-title" type="h1" />
			<div className="resources-grid">
				{resources.map((resource, idx) => (
					<Card key={idx} {...resource} />
				))}
			</div>

			{/* Scroll to top button */}
			<AnimatePresence>
				{showScrollTop && (
					<motion.button
						className="scroll-to-top"
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

export default Resources;
