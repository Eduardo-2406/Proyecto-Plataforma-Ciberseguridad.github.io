import React from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Ranking = ({ data }) => {
  const chartData = {
    labels: data.map(user => user.name),
    datasets: [
      {
        label: 'Puntos',
        data: data.map(user => user.points),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top 5 - Ranking Mensual',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Puntos',
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ranking Mensual</h2>
        <p className="text-gray-600">
          Los 5 colaboradores más activos este mes
        </p>
      </div>

      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Colaboradores</h3>
        <div className="space-y-4">
          {data.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-blue-600">#{index + 1}</span>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">{user.points} pts</p>
                <p className="text-sm text-gray-600">
                  {user.completedModules} módulos completados
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Ranking; 