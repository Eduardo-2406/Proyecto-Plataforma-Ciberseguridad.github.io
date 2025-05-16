// Sistema de Gamificación
if (!window.GamificationSystem) {
    class GamificationSystem {
        constructor() {
            this.points = 0;
            this.level = 1;
            this.badges = [];
            this.weeklyChallenges = [];
            this.init();
        }

        init() {
            // Inicializar Firebase Auth
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.loadUserData(user.uid);
                }
            });
        }

        async loadUserData(userId) {
            const userRef = firebase.database().ref(`users/${userId}`);
            const snapshot = await userRef.once('value');
            const userData = snapshot.val() || {};

            this.points = userData.points || 0;
            this.level = userData.level || 1;
            this.badges = userData.badges || [];
            this.weeklyChallenges = userData.weeklyChallenges || [];

            this.updateDashboard();
        }

        addPoints(amount) {
            this.points += amount;
            this.checkLevelUp();
            this.checkBadges();
            this.updateUserData();
        }

        checkLevelUp() {
            const newLevel = Math.floor(this.points / 100) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.checkLevelUpBadges();
            }
        }

        checkBadges() {
            this.checkLevelUpBadges();
            this.checkAchievementBadges();
        }

        checkLevelUpBadges() {
            const levelBadges = {
                5: 'Bronze',
                10: 'Silver',
                20: 'Gold',
                50: 'Platinum'
            };

            if (levelBadges[this.level] && !this.badges.includes(`Level ${levelBadges[this.level]}`)) {
                this.badges.push(`Level ${levelBadges[this.level]}`);
                this.showBadgeNotification(`Level ${levelBadges[this.level]}`);
            }
        }

        checkAchievementBadges() {
            const achievements = {
                'First Post': this.points >= 10,
                'Active User': this.points >= 50,
                'Community Leader': this.points >= 100
            };

            Object.entries(achievements).forEach(([badge, condition]) => {
                if (condition && !this.badges.includes(badge)) {
                    this.badges.push(badge);
                    this.showBadgeNotification(badge);
                }
            });
        }

        showBadgeNotification(badge) {
            const notification = document.createElement('div');
            notification.className = 'badge-notification';
            notification.innerHTML = `
                <i class="fas fa-medal"></i>
                <p>¡Nueva insignia desbloqueada: ${badge}!</p>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }

        async updateUserData() {
            const user = firebase.auth().currentUser;
            if (!user) return;

            const userRef = firebase.database().ref(`users/${user.uid}`);
            await userRef.update({
                points: this.points,
                level: this.level,
                badges: this.badges,
                weeklyChallenges: this.weeklyChallenges
            });

            this.updateDashboard();
            if (window.rankingSystem) {
                window.rankingSystem.updateRanking();
            }
        }

        updateDashboard() {
            const pointsElement = document.getElementById('user-points');
            const levelElement = document.getElementById('user-level');
            const badgesElement = document.getElementById('user-badges');

            if (pointsElement) pointsElement.textContent = this.points;
            if (levelElement) levelElement.textContent = this.level;
            if (badgesElement) {
                badgesElement.innerHTML = this.badges
                    .map(badge => `<span class="badge">${badge}</span>`)
                    .join('');
            }
        }
    }

    // Inicializar el sistema de gamificación
    window.gamificationSystem = new GamificationSystem();
}

// Función para actualizar el dashboard del usuario
function updateUserDashboard(userData) {
    const dashboard = document.getElementById('user-dashboard');
    if (!dashboard) return;

    const level = gamificationSystem.level;
    const progress = gamificationSystem.calculateProgress(gamificationSystem.points);
    const newBadges = gamificationSystem.checkBadges(gamificationSystem.points, gamificationSystem.badges);

    dashboard.innerHTML = `
        <div class="dashboard-section">
            <h2>Tu Progreso</h2>
            <div class="level-info">
                <h3>Nivel: ${level}</h3>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
                <p>${gamificationSystem.points} puntos</p>
            </div>
        </div>
        <div class="dashboard-section">
            <h2>Tus Insignias</h2>
            <div class="badges-container">
                ${gamificationSystem.badges.map(badge => `
                    <div class="badge">
                        <span class="badge-icon">${gamificationSystem.badges[badge].icon}</span>
                        <span class="badge-name">${gamificationSystem.badges[badge].name}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="dashboard-section">
            <h2>Ranking Mensual</h2>
            <div class="ranking-list">
                ${userData.ranking.map((user, index) => `
                    <div class="ranking-item ${user.id === userData.id ? 'current-user' : ''}">
                        <span class="rank">#${index + 1}</span>
                        <span class="name">${user.name}</span>
                        <span class="points">${user.points} pts</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Mostrar notificación de nuevas insignias
    if (newBadges.length > 0) {
        newBadges.forEach(badge => {
            showBadgeNotification(badge);
        });
    }
}

// Función para mostrar notificación de nueva insignia
function showBadgeNotification(badge) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
        <div class="badge-notification-content">
            <span class="badge-icon">${gamificationSystem.badges[badge].icon}</span>
            <div class="badge-info">
                <h4>¡Nueva Insignia!</h4>
                <p>${gamificationSystem.badges[badge].name}</p>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Exportar funciones y objetos necesarios
window.gamificationSystem = gamificationSystem;
window.updateUserDashboard = updateUserDashboard; 