// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Configuración de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyD8U2mW0QfX5QfX5QfX5QfX5QfX5QfX5QfX",
        authDomain: "plataforma-ciberseguridad.firebaseapp.com",
        projectId: "plataforma-ciberseguridad",
        storageBucket: "plataforma-ciberseguridad.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef1234567890",
        databaseURL: "https://plataforma-ciberseguridad-default-rtdb.firebaseio.com"
    };

    // Inicializar Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Referencias a elementos del DOM
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');

    // Manejar el estado de autenticación
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // Usuario ha iniciado sesión
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            userProfile.classList.remove('hidden');
            userName.textContent = user.displayName || user.email;
            userAvatar.src = user.photoURL || 'default-avatar.png';

            // Inicializar componentes
            initializeComponents();
        } else {
            // Usuario ha cerrado sesión
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            userProfile.classList.add('hidden');
        }
    });

    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut();
    });

    // Función para inicializar componentes
    function initializeComponents() {
        // Inicializar el sistema de gamificación
        // if (window.gamificationSystem) {
        //     window.gamificationSystem.initializeSystem();
        // }

        // Inicializar el sistema de retos semanales
        if (window.weeklyChallenges) {
            window.weeklyChallenges.loadCurrentChallenge();
        }

        // Inicializar el sistema de ranking
        if (window.rankingSystem) {
            window.rankingSystem.initializeRanking();
        }
    }

    // Agregar estilos globales
    const style = document.createElement('style');
    style.textContent = `
        .hidden {
            display: none !important;
        }

        #user-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 5px 10px;
            background: #f8f9fa;
            border-radius: 20px;
        }

        #user-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }

        #login-btn, #logout-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #login-btn {
            background: #2ecc71;
            color: white;
        }

        #logout-btn {
            background: #e74c3c;
            color: white;
        }

        #login-btn:hover {
            background: #27ae60;
        }

        #logout-btn:hover {
            background: #c0392b;
        }
    `;
    document.head.appendChild(style);
}); 