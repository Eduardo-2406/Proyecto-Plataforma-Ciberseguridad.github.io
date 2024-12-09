document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('quiz-form');
    const retryButton = document.getElementById('retry-button');

    const answers = {
        q1: 'a',
        q2: 'c',
        q3: 'b',
        q4: 'a',
        q5: 'b',
        q6: 'a',
        q7: 'b',
        q8: 'a',
        q9: 'a',
        q10: 'a'
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
