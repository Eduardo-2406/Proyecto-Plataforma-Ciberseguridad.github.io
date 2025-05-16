// Sistema de Autenticación
class AuthSystem {
    constructor() {
        this.loginBtn = document.getElementById('login-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        this.userProfile = document.getElementById('user-profile');
        this.userName = document.getElementById('user-name');
        this.userAvatar = document.getElementById('user-avatar');
        this.init();
    }

    init() {
        // Verificar que Firebase esté inicializado
        if (!firebase.apps.length) {
            console.error('Firebase no está inicializado');
            return;
        }

        // Escuchar cambios en el estado de autenticación
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.onLogin(user).catch(error => {
                    console.error('Error en onLogin:', error);
                    this.onLogout();
                });
            } else {
                this.onLogout();
            }
        });

        // Configurar botones
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => this.showAuthModal());
        }
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.logout());
        }

        // Verificar la conexión a la base de datos
        const connectedRef = firebase.database().ref('.info/connected');
        connectedRef.on('value', (snap) => {
            if (snap.val() === true) {
                console.log('Conectado a la base de datos');
            } else {
                console.log('Desconectado de la base de datos');
            }
        });
    }

    showAuthModal() {
        // Remover modal existente si hay uno
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Avatares por defecto
        const avatars = [
            './assets/images/avatar1.png',
            './assets/images/avatar2.png',
            './assets/images/avatar3.png',
            './assets/images/avatar4.png'
        ];

        const avatarOptions = avatars.map((src, idx) => `
            <label class="avatar-option">
                <input type="radio" name="avatar" value="${src}" ${idx === 0 ? 'checked' : ''}>
                <img src="${src}" alt="Avatar ${idx + 1}" class="avatar-img">
            </label>
        `).join('');

        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <div class="auth-tabs">
                    <button class="tab-btn active" data-tab="login">Iniciar Sesión</button>
                    <button class="tab-btn" data-tab="register">Registrarse</button>
                </div>
                
                <div class="tab-content" id="login-tab">
                    <form id="login-form">
                        <input type="email" placeholder="Correo electrónico" required>
                        <input type="password" placeholder="Contraseña" required>
                        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                    </form>
                </div>
                
                <div class="tab-content hidden" id="register-tab">
                    <form id="register-form">
                        <input type="text" placeholder="Nombre completo" required>
                        <input type="email" placeholder="Correo electrónico" required>
                        <input type="password" placeholder="Contraseña" required>
                        <input type="password" placeholder="Confirmar contraseña" required>
                        <div class="avatar-selector">
                            <p>Elige tu avatar:</p>
                            <div class="avatar-options">${avatarOptions}</div>
                        </div>
                        <button type="submit" class="btn btn-primary">Registrarse</button>
                    </form>
                </div>
                
                <button class="close-modal">&times;</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Configurar eventos
        const tabs = modal.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const contents = modal.querySelectorAll('.tab-content');
                contents.forEach(content => content.classList.add('hidden'));
                modal.querySelector(`#${tab.dataset.tab}-tab`).classList.remove('hidden');
            });
        });

        // Cerrar modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Login
        modal.querySelector('#login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target[0].value;
            const password = e.target[1].value;
            
            try {
                await this.login(email, password);
                modal.remove();
            } catch (error) {
                console.error('Error en login:', error);
                alert('Error al iniciar sesión: ' + error.message);
            }
        });

        // Register
        modal.querySelector('#register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = e.target[0].value;
            const email = e.target[1].value;
            const password = e.target[2].value;
            const confirmPassword = e.target[3].value;
            const avatar = modal.querySelector('input[name="avatar"]:checked').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            try {
                await this.register(name, email, password, avatar);
                modal.remove();
            } catch (error) {
                console.error('Error en registro:', error);
                alert('Error al registrarse: ' + error.message);
            }
        });
    }

    async login(email, password) {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al iniciar sesión: ' + error.message);
        }
    }

    async register(name, email, password, avatar) {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({
                displayName: name,
                photoURL: avatar
            });
        } catch (error) {
            console.error('Error al registrarse:', error);
            alert('Error al registrarse: ' + error.message);
        }
    }

    async logout() {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
        }
    }

    async onLogin(user) {
        try {
            // Verificar que el usuario esté autenticado
            if (!user || !user.uid) {
                throw new Error('Usuario no autenticado');
            }

            // Actualizar UI
            this.loginBtn.classList.add('hidden');
            this.logoutBtn.classList.remove('hidden');
            this.userProfile.classList.remove('hidden');

            // Mostrar nombre y avatar
            this.userName.textContent = user.displayName || '';
            this.userAvatar.src = user.photoURL || avatars[0];

            // Mostrar dashboard
            const dashboard = document.getElementById('user-dashboard');
            if (dashboard) {
                dashboard.classList.remove('hidden');
            }

            // Inicializar datos del usuario en la base de datos
            await this.initializeUserData(user);
            
            console.log('Login exitoso');
        } catch (error) {
            console.error('Error en onLogin:', error);
            this.onLogout();
            alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
    }

    onLogout() {
        // Actualizar UI
        this.loginBtn.classList.remove('hidden');
        this.logoutBtn.classList.add('hidden');
        this.userProfile.classList.add('hidden');

        // Ocultar dashboard
        const dashboard = document.getElementById('user-dashboard');
        if (dashboard) {
            dashboard.classList.add('hidden');
        }

        // Limpiar información del usuario
        this.userName.textContent = '';
        this.userAvatar.src = './assets/images/default-avatar.png';
    }

    async initializeUserData(user) {
        try {
            if (!user || !user.uid) {
                throw new Error('Usuario no autenticado');
            }
            const userRef = firebase.database().ref(`users/${user.uid}`);
            const snapshot = await userRef.once('value');
            if (!snapshot.exists()) {
                const userData = {
                    name: user.displayName || '',
                    email: user.email,
                    photoURL: user.photoURL,
                    points: 0,
                    level: 1,
                    badges: [],
                    weeklyChallenges: [],
                    createdAt: Date.now()
                };
                await userRef.set(userData);
                console.log('Usuario creado exitosamente');
            } else {
                const userData = snapshot.val();
                const updates = {};
                if (!userData.name && user.displayName) {
                    updates.name = user.displayName;
                }
                if (!userData.email) {
                    updates.email = user.email;
                }
                if (!userData.photoURL && user.photoURL) {
                    updates.photoURL = user.photoURL;
                }
                if (Object.keys(updates).length > 0) {
                    await userRef.update(updates);
                    console.log('Datos del usuario actualizados');
                } else {
                    console.log('Usuario existente encontrado');
                }
            }
        } catch (error) {
            console.error('Error al inicializar datos del usuario:', error);
            if (error.code === 'PERMISSION_DENIED') {
                alert('Error de permisos. Por favor, contacta al administrador.');
            } else {
                alert('Error al crear tu perfil. Por favor, intenta de nuevo.');
            }
        }
    }
}

// Inicializar el sistema de autenticación
const authSystem = new AuthSystem();
window.authSystem = authSystem; 