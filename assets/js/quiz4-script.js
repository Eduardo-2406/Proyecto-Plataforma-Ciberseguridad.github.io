document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('quiz-form');
    const retryButton = document.getElementById('retry-button');

    const answers = {
        q1: 'a', // Respuesta correcta: Preparación.
        q2: 'b', // Respuesta correcta: Detectar y reportar incidentes de seguridad.
        q3: 'a', // Respuesta correcta: Limitar el alcance y el daño del incidente.
        q4: 'b', // Respuesta correcta: Eliminar la causa raíz del incidente.
        q5: 'c', // Respuesta correcta: Restaurar la funcionalidad del sistema afectado.
        q6: 'a', // Respuesta correcta: Documentar las lecciones aprendidas y mejorar la respuesta futura.
        q7: 'a', // Respuesta correcta: Políticas y procedimientos claros, equipo de respuesta, evaluaciones de riesgos.
        q8: 'a', // Respuesta correcta: Un análisis realizado para entender el incidente y mejorar futuras respuestas.
        q9: 'b', // Respuesta correcta: Monitorización.
        q10: 'a' // Respuesta correcta: Desarrollar un plan de respuesta y realizar simulacros.
    };

    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let score = 0;
        const formData = new FormData(quizForm);

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

        const totalQuestions = Object.keys(answers).length;
        alert(`Tu puntuación es: ${score}/${totalQuestions}`);

        retryButton.style.display = 'inline-block';
        retryButton.addEventListener('click', function() {
            location.reload();
        });
    });
});
