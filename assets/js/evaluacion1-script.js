document.addEventListener('DOMContentLoaded', function() {
    const evaluationForm = document.getElementById('evaluation-form');
    const retryButton = document.getElementById('retry-button');

    const answers = {
        q1: 'a', // Respuesta correcta: Protección de datos digitales.
        q2: 'c', // Respuesta correcta: Ransomware.
        q6: 'b', // Respuesta correcta: Un ataque que busca obtener información personal a través de engaños.
        q7: 'a', // Respuesta correcta: Un dispositivo de hardware que filtra el tráfico de red no autorizado.
        q8: 'b', // Respuesta correcta: Detectar y eliminar software malicioso.
        q9: 'b', // Respuesta correcta: Un tipo de malware que restringe el acceso a la información y pide un rescate a cambio.
        q10: 'a' // Respuesta correcta: Una medida de seguridad que requiere más de una forma de verificación para acceder a un sistema.
    };

    const openQuestionsAnswers = {
        q3: "Ejemplo de respuesta: Para proteger una red doméstica, se pueden utilizar contraseñas seguras para el Wi-Fi, habilitar el cifrado WPA3, actualizar el firmware del router regularmente, y usar firewalls.",
        q4: "Ejemplo de respuesta: Las principales amenazas cibernéticas que enfrentan las organizaciones hoy en día incluyen el ransomware, el phishing, los ataques DDoS, y las brechas de datos.",
        q5: "Ejemplo de respuesta: Para proteger los datos personales, se pueden implementar medidas como el uso de contraseñas fuertes, el cifrado de datos, la autenticación multifactor y las políticas de privacidad estrictas."
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
