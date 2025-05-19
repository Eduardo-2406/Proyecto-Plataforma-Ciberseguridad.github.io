import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';

const BaseModule = ({ 
  title, 
  description, 
  sections, 
  videos, 
  quiz, 
  moduleId,
  nextModuleId,
  prevModuleId 
}) => {
  const { completeModule, addPoints } = useStore();

  const handleModuleComplete = () => {
    completeModule(moduleId);
    addPoints(50); // 50 puntos por completar el módulo
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>

        {/* Secciones del módulo */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 mb-4">{section.content}</p>
              
              {section.points && (
                <ul className="list-disc list-inside mb-4 text-gray-600">
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {section.image && (
                <div className="relative w-full h-64 mb-4">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}

              {section.link && (
                <a
                  href={section.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Leer más
                </a>
              )}
            </motion.section>
          ))}
        </div>

        {/* Videos del módulo */}
        {videos && videos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Videos Educativos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((video, index) => (
                <div key={index} className="aspect-video">
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz del módulo */}
        {quiz && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Quiz del Módulo
            </h2>
            <Link
              to={`/quiz/${quiz.id}`}
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Comenzar Quiz
            </Link>
          </div>
        )}

        {/* Navegación entre módulos */}
        <div className="flex justify-between mt-8">
          {prevModuleId && (
            <Link
              to={`/module/${prevModuleId}`}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Módulo Anterior
            </Link>
          )}
          {nextModuleId && (
            <Link
              to={`/module/${nextModuleId}`}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Siguiente Módulo
            </Link>
          )}
        </div>

        {/* Botón de completar módulo */}
        <button
          onClick={handleModuleComplete}
          className="mt-8 w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Completar Módulo
        </button>
      </motion.div>
    </div>
  );
};

export default BaseModule; 