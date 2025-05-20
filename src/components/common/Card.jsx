import React from 'react';
import '../../styles/Card.css';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  onClick
}) => {
  const cardClasses = ['card', className].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card; 