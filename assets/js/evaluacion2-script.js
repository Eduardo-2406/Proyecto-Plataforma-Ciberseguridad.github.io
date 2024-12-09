document.addEventListener('DOMContentLoaded', function() {
    const evaluationForm = document.getElementById('evaluation-form');
    const retryButton = document.getElementById('retry-button');

    const answers = {
        q1: 'b', // Respuesta correcta: Un conjunto de procedimientos para manejar incidentes de seguridad.
        q2: 'a', // Respuesta correcta: Contención.
        q6: 'b', // Respuesta correcta: Limitar el daño y prevenir la propagación.
        q7: 'a', // Respuesta correcta: Eliminar la causa raíz del incidente.
        q8: 'b', // Respuesta correcta: Restaurar la funcionalidad del sistema y los datos afectados.
        q9: 'a', // Respuesta correcta: Mejorar la respuesta a futuros incidentes.
        q10: 'a' // Respuesta correcta: Proporcionar capacitación regular y realizar simulacros de incidentes.
    };

    const openQuestionsAnswers = {
        q3: "Ejemplo de respuesta: Los pasos clave en un plan de recuperación ante desastres incluyen la evaluación del impacto, la activación del plan, la comunicación con todas las partes interesadas, la restauración de sistemas críticos, y la revisión y mejora continua del plan.",
        q4: "Ejemplo de respuesta: Al desarrollar un protocolo de seguridad para una empresa, se deben considerar aspectos como la evaluación de riesgos, la implementación de controles de acceso, la capacitación del personal, el uso de tecnologías de seguridad avanzadas, y la actualización y revisión periódica del protocolo.",
        q5: "Ejemplo de respuesta: Para mejorar la respuesta a incidentes en una organización, se pueden implementar medidas como la capacitación continua del personal, la realización de simulacros de incidentes, la mejora de la comunicación interna y externa durante un incidente, y la actualización y revisión constante del plan de respuesta."
    };

    evaluationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let score = 0;
        const formData = new FormData(evaluationForm);

        // Evaluar preguntas de opción múltiple
        for (let key in answers) {
            const questionDiv = document.getElementById(`question${key.replace('q', '')}`);
            const selectedAnswer = formData.get(key);
            const correctAnswer = answers[key];

            if (selectedAnswer === correctAnswer) {
                score++;
                questionDiv.style.borderColor = 'green';
            } else {
                questionDiv.style.borderColor = 'red';
            }
        }

        // Mostrar resultados de preguntas abiertas (simulado)
        for (let key in openQuestionsAnswers) {
            const questionDiv = document.getElementById(`question${key.replace('q', '')}`);
            questionDiv.style.borderColor = 'blue'; // Indicar que son preguntas abiertas

            // Mostrar ejemplo de respuesta en consola (puedes personalizar esta parte según tus necesidades)
            console.log(`Pregunta ${key.replace('q', '')}: ${openQuestionsAnswers[key]}`);
        }

        const totalQuestions = Object.keys(answers).length + Object.keys(openQuestionsAnswers).length; // Incluyendo preguntas abiertas
        alert(`Tu puntuación es: ${score}/${totalQuestions}`);

        retryButton.style.display = 'inline-block';
        retryButton.addEventListener('click', function() {
            location.reload();
        });
    });
});
