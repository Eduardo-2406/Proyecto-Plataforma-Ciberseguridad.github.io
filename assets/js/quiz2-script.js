document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('quiz-form');
    const retryButton = document.getElementById('retry-button');

    const answers = {
        q1: 'b', // Respuesta correcta: Usar combinaciones de letras, números y símbolos.
        q2: 'b', // Respuesta correcta: Google Docs.
        q3: 'b', // Respuesta correcta: Una contraseña compleja y única para cada cuenta.
        q4: 'b', // Respuesta correcta: Cada 90 días.
        q5: 'b', // Respuesta correcta: Usar una contraseña y un segundo método de verificación.
        q6: 'b', // Respuesta correcta: Escribirlas en un papel.
        q7: 'a', // Respuesta correcta: Un ataque donde se usan contraseñas comunes en muchas cuentas.
        q8: 'a', // Respuesta correcta: Una contraseña corta y fácil de adivinar.
        q9: 'a', // Respuesta correcta: Un software que almacena y gestiona contraseñas de forma segura.
        q10: 'a' // Respuesta correcta: Una contraseña basada en características físicas, como huellas dactilares.
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
