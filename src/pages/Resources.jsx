import React from 'react';
import AnimatedText from '../components/animations/AnimatedText';
import styled from 'styled-components';

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

const StyledResourcesContainer = styled.div`
	.resources-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.animated-title {
		margin-bottom: 2.5rem;
		text-align: center;
		max-width: 100%;
		font-size: 1rem !important;
		line-height: 1.2;
		font-weight: 500;
		letter-spacing: -0.01em;
		white-space: normal;
		overflow-wrap: break-word;
	}
	.features-grid {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
		gap: 32px;
		justify-content: center;
	}
`;

const resourceImages = {
	Recurso: '/images/recursos/gestores.avif',
	Noticias: '/images/recursos/noticias.avif',
	Curso: '/images/recursos/cursos.avif',
	Consejos: '/images/recursos/gestores.avif', // Puedes cambiar si tienes otra imagen
};

const Card = ({ title, description, url, type }) => {
	const handleButtonClick = () => {
		window.open(url, '_blank', 'noopener noreferrer');
	};
	return (
		<StyledWrapper>
			<div className="card">
				<div
					className="card-image"
					style={{
						height: '120px',
						background: '#e0e7ef',
						borderRadius: '12px',
						marginBottom: '1rem',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						overflow: 'hidden',
					}}
				>
					<img
						src={resourceImages[type]}
						alt={type}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'contain',
							borderRadius: '12px',
						}}
					/>
				</div>
				<div className="card-details">
					<p className="text-title">{title}</p>
					<p className="text-body">{description}</p>
				</div>
				<button className="card-button" onClick={handleButtonClick}>
					Ver más
				</button>
			</div>
		</StyledWrapper>
	);
};

const StyledWrapper = styled.div`
	.card {
		width: 340px;
		height: 420px;
		border-radius: 20px;
		background: #f5f5f5;
		position: relative;
		padding: 1.8rem;
		border: 2px solid #c3c6ce;
		transition: 0.5s ease-out;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding-bottom: 4rem;
	}
	.card-image {
		width: 100%;
		height: 120px;
		background: #e0e7ef;
		border-radius: 12px;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.card-details {
		color: black;
		gap: 0.5em;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		margin-bottom: 1rem;
		overflow: hidden;
	}
	.card-button {
		transform: translate(-50%, 125%);
		width: 80%;
		border-radius: 1rem;
		border: none;
		background-color: #008bf8;
		color: #fff;
		font-size: 1rem;
		padding: 0.75rem 1rem;
		position: absolute;
		left: 50%;
		bottom: 0;
		opacity: 0;
		transition: 0.3s ease-out;
		cursor: pointer;
		z-index: 10;
	}
	.text-body {
		color: #555;
		flex-grow: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.text-title {
		font-size: 1.5em;
		font-weight: bold;
		margin-bottom: 0.5em;
	}
	.card:hover {
		border-color: #008bf8;
		box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
	}
	.card:hover .card-button {
		transform: translate(-50%, -10%);
		opacity: 1;
	}
	@media (max-width: 768px) {
		.card {
			width: 95%;
			height: auto;
			min-height: 300px;
			max-width: none;
		}
	}
`;

const Resources = () => (
	<StyledResourcesContainer>
		<div className="resources-page">
			<AnimatedText text="Recursos de Ciberseguridad" className="animated-title" type="h1" />
			<div className="features-grid">
				{resources.map((resource, idx) => (
					<Card key={idx} {...resource} />
				))}
			</div>
		</div>
	</StyledResourcesContainer>
);

export default Resources;
