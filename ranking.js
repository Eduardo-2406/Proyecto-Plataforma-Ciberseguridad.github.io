// Sistema de Ranking Interno
class RankingSystem {
    constructor() {
        this.rankingContainer = document.getElementById('ranking-container');
        this.initializeRanking();
    }

    async initializeRanking() {
        if (!this.rankingContainer) return;

        // Obtener todos los usuarios y sus puntos
        const usersRef = firebase.database().ref('users');
        const snapshot = await usersRef.once('value');
        const users = snapshot.val();

        // Convertir a array y ordenar por puntos
        const rankingArray = Object.entries(users).map(([uid, data]) => ({
            uid,
            name: data.name,
            points: data.points || 0,
            level: data.level || 1,
            badges: data.badges || []
        }));

        rankingArray.sort((a, b) => b.points - a.points);

        // Mostrar el ranking
        this.displayRanking(rankingArray);
    }

    displayRanking(rankingArray) {
        this.rankingContainer.innerHTML = `
            <div class="ranking-card">
                <h3>Ranking de Usuarios</h3>
                <div class="ranking-list">
                    ${rankingArray.map((user, index) => `
                        <div class="ranking-item ${index < 3 ? 'top-' + (index + 1) : ''}">
                            <div class="rank-position">${index + 1}</div>
                            <div class="user-info">
                                <div class="user-name">${user.name}</div>
                                <div class="user-level">Nivel ${user.level}</div>
                            </div>
                            <div class="user-points">${user.points} pts</div>
                            <div class="user-badges">
                                ${user.badges.map(badge => `
                                    <span class="badge" title="${badge.name}">
                                        <i class="fas ${badge.icon}"></i>
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Agregar estilos dinámicos para los top 3
        const style = document.createElement('style');
        style.textContent = `
            .top-1 {
                background: linear-gradient(45deg, #FFD700, #FFA500);
                color: white;
            }
            .top-2 {
                background: linear-gradient(45deg, #C0C0C0, #A9A9A9);
                color: white;
            }
            .top-3 {
                background: linear-gradient(45deg, #CD7F32, #8B4513);
                color: white;
            }
            .ranking-item {
                display: flex;
                align-items: center;
                padding: 10px;
                margin: 5px 0;
                border-radius: 5px;
                background: #f5f5f5;
            }
            .rank-position {
                font-size: 1.2em;
                font-weight: bold;
                width: 40px;
                text-align: center;
            }
            .user-info {
                flex-grow: 1;
                margin: 0 15px;
            }
            .user-name {
                font-weight: bold;
            }
            .user-level {
                font-size: 0.9em;
                color: #666;
            }
            .user-points {
                font-weight: bold;
                color: #2ecc71;
            }
            .user-badges {
                margin-left: 15px;
            }
            .badge {
                margin: 0 2px;
                color: #f1c40f;
            }
        `;
        document.head.appendChild(style);
    }

    async updateRanking() {
        await this.initializeRanking();
    }
}

// Inicializar el sistema de ranking
const rankingSystem = new RankingSystem();
window.rankingSystem = rankingSystem; 