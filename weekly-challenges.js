// Sistema de Retos Semanales
class WeeklyChallengeSystem {
    constructor() {
        this.challenges = {
            week1: {
                title: "Identificación de Phishing",
                questions: [
                    {
                        question: "¿Cuál de estos correos es probablemente un intento de phishing?",
                        options: [
                            "Un correo de tu banco solicitando actualizar tu información",
                            "Un correo de confirmación de una compra que realizaste",
                            "Un correo de tu jefe directo sobre una reunión",
                            "Un correo de recursos humanos sobre el próximo evento"
                        ],
                        correct: 0
                    },
                    {
                        question: "¿Qué deberías hacer si recibes un correo sospechoso?",
                        options: [
                            "Hacer clic en los enlaces para verificar",
                            "Responder solicitando más información",
                            "Reportarlo al departamento de IT",
                            "Reenviarlo a tus compañeros para que estén alerta"
                        ],
                        correct: 2
                    },
                    {
                        question: "¿Cuál es una característica común de los correos de phishing?",
                        options: [
                            "Solicitan información personal",
                            "Tienen un diseño profesional",
                            "Incluyen el logo de la empresa",
                            "Vienen de una dirección de correo conocida"
                        ],
                        correct: 0
                    }
                ]
            },
            week2: {
                title: "Gestión de Contraseñas",
                questions: [
                    {
                        question: "¿Cuál es una contraseña segura?",
                        options: [
                            "123456",
                            "password123",
                            "P@ssw0rd2024!",
                            "qwerty"
                        ],
                        correct: 2
                    },
                    {
                        question: "¿Con qué frecuencia deberías cambiar tus contraseñas?",
                        options: [
                            "Nunca",
                            "Cada 6 meses",
                            "Cada año",
                            "Solo cuando sospeches que fueron comprometidas"
                        ],
                        correct: 1
                    },
                    {
                        question: "¿Qué es un gestor de contraseñas?",
                        options: [
                            "Un programa que genera contraseñas débiles",
                            "Una herramienta para almacenar contraseñas de forma segura",
                            "Un método para recordar contraseñas",
                            "Un sistema para compartir contraseñas"
                        ],
                        correct: 1
                    }
                ]
            }
        };
    }

    async loadCurrentChallenge() {
        const challengeContainer = document.getElementById('weekly-challenge');
        if (!challengeContainer) return;

        // Obtener la semana actual
        const currentWeek = this.getCurrentWeek();
        const challenge = this.challenges[`week${currentWeek}`];

        if (!challenge) {
            challengeContainer.innerHTML = '<p>No hay retos disponibles esta semana.</p>';
            return;
        }

        challengeContainer.innerHTML = `
            <div class="challenge-card">
                <h3>Reto Semanal: ${challenge.title}</h3>
                <form id="challenge-form">
                    ${challenge.questions.map((q, qIndex) => `
                        <div class="question">
                            <p>${qIndex + 1}. ${q.question}</p>
                            ${q.options.map((option, oIndex) => `
                                <label>
                                    <input type="radio" name="q${qIndex}" value="${oIndex}" required>
                                    ${option}
                                </label>
                            `).join('')}
                        </div>
                    `).join('')}
                    <button type="submit">Enviar Respuestas</button>
                </form>
            </div>
        `;

        // Configurar el evento de envío
        document.getElementById('challenge-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.checkAnswers(currentWeek, e.target);
        });
    }

    getCurrentWeek() {
        const startDate = new Date('2024-01-01'); // Fecha de inicio del programa
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.floor(diffDays / 7) + 1;
    }

    async checkAnswers(week, form) {
        const challenge = this.challenges[`week${week}`];
        let correctAnswers = 0;

        challenge.questions.forEach((q, index) => {
            const selected = form[`q${index}`].value;
            if (parseInt(selected) === q.correct) {
                correctAnswers++;
            }
        });

        const score = (correctAnswers / challenge.questions.length) * 100;
        
        if (score >= 80) {
            // Otorgar puntos y actualizar el ranking
            const userRef = firebase.database().ref(`users/${auth.currentUser.uid}`);
            const snapshot = await userRef.once('value');
            const userData = snapshot.val();

            // Verificar si ya completó el reto esta semana
            const weekKey = `week${week}`;
            if (!userData.weeklyChallenges[weekKey]) {
                userData.points += 30; // Puntos por completar el reto
                userData.weeklyChallenges[weekKey] = {
                    completed: true,
                    score: score,
                    date: new Date().toISOString()
                };

                await userRef.update(userData);
                updateUserDashboard(userData);
                alert('¡Felicidades! Has completado el reto semanal y ganado 30 puntos.');
            } else {
                alert('Ya has completado este reto semanal.');
            }
        } else {
            alert('No has alcanzado el puntaje mínimo. Inténtalo de nuevo.');
        }
    }
}

// Inicializar el sistema de retos semanales
const weeklyChallenges = new WeeklyChallengeSystem();
window.weeklyChallenges = weeklyChallenges; 