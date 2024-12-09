document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('quiz-form');
    const retryButton = document.getElementById('retry-button');

    const answers = {
        q1: 'b', // Respuesta correcta: Proteger la información digital contra accesos no autorizados.
        q2: 'a', // Respuesta correcta: Usar cifrado.
        q3: 'a', // Respuesta correcta: Reglamento General de Protección de Datos.
        q4: 'a', // Respuesta correcta: Usar cifrado SSL/TLS.
        q5: 'a', // Respuesta correcta: Un método de cifrado donde solo el emisor y el receptor pueden leer los mensajes.
        q6: 'b', // Respuesta correcta: Limitar la cantidad de datos recopilados a lo estrictamente necesario.
        q7: 'a', // Respuesta correcta: La pérdida o exposición no autorizada de datos confidenciales.
        q8: 'a', // Respuesta correcta: El proceso de eliminar o modificar información de manera que no pueda vincularse con una persona específica.
        q9: 'a', // Respuesta correcta: Una política que determina cuánto tiempo se deben conservar los datos.
        q10: 'a' // Respuesta correcta: La protección de datos almacenados contra accesos no autorizados mediante el uso de cifrado.
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
