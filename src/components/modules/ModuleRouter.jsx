import React from 'react';
import { useParams } from 'react-router-dom';
import Module1 from './Module1';
import Module2 from './Module2';
import Module3 from './Module3';
import Module4 from './Module4';
import Module5 from './Module5';
import Module6 from './Module6';

const ModuleRouter = () => {
  const { id } = useParams();

  const modules = {
    '1': Module1,
    '2': Module2,
    '3': Module3,
    '4': Module4,
    '5': Module5,
    '6': Module6
  };

  const ModuleComponent = modules[id];

  if (!ModuleComponent) {
    return <div>Módulo no encontrado</div>;
  }

  return <ModuleComponent />;
};

export default ModuleRouter; 