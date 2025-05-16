// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAaaTmb8t8dnNmBYVq1quzsr2F1HtW0r4Y",
    authDomain: "base-de-datos-foro-f82b6.firebaseapp.com",
    databaseURL: "https://base-de-datos-foro-f82b6-default-rtdb.firebaseio.com",
    projectId: "base-de-datos-foro-f82b6",
    storageBucket: "base-de-datos-foro-f82b6.firebasestorage.app",
    messagingSenderId: "815598812065",
    appId: "1:815598812065:web:19137de0979df1b549a9e0",
    measurementId: "G-K28KG87S5G"
  };

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Variables globales para la paginación
let mensajesMostrados = 3;
let todosLosMensajes = [];

// Funciones de interactividad y animaciones
document.addEventListener('DOMContentLoaded', function() {
    // Código de las noticias (comentado temporalmente por el error de API key)
    /*
    fetch('https://newsapi.org/v2/everything?q=ciberseguridad&language=es&apiKey=TU_API_KEY')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.card-container');
            data.articles.forEach(article => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${article.urlToImage}" alt="Noticia de Ciberseguridad">
                    <div class="card-content">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <a href="${article.url}" target="_blank" class="read-more">Seguir leyendo</a>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error al cargar las noticias:', error));
    */

    // Código del foro
    const form = document.getElementById('foro-form');
    const messagesContainer = document.getElementById('messages-container');
    const loadMoreButton = document.getElementById('load-more');

    if (!form || !messagesContainer) {
        console.error('No se encontraron los elementos necesarios del foro');
        return;
    }

    // Cargar mensajes existentes
    database.ref('mensajes').on('value', (snapshot) => {
        messagesContainer.innerHTML = ''; // Limpiar contenedor
        const mensajes = snapshot.val();
        if (mensajes) {
            todosLosMensajes = Object.entries(mensajes).map(([id, mensaje]) => ({
                id,
                ...mensaje
            })).sort((a, b) => b.timestamp - a.timestamp);

            mostrarMensajesPaginados();
        }
    });

    // Configurar botón de cargar más
    if (loadMoreButton) {
        loadMoreButton.style.display = 'block';
        loadMoreButton.addEventListener('click', function() {
            mensajesMostrados += 3;
            mostrarMensajesPaginados();
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const consulta = document.getElementById('consulta').value;

        // Validar longitud de la consulta
        if (consulta.length > 500) {
            alert('La consulta no puede tener más de 500 caracteres');
            return;
        }

        if (nombre && consulta) {
            // Guardar mensaje en Firebase
            const nuevoMensaje = {
                nombre: nombre,
                consulta: consulta,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                respuestas: {}
            };

            database.ref('mensajes').push(nuevoMensaje);
            form.reset();
        }
    });
});

// Función para mostrar mensajes paginados
function mostrarMensajesPaginados() {
    const messagesContainer = document.getElementById('messages-container');
    const loadMoreButton = document.getElementById('load-more');
    
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';
    const mensajesAMostrar = todosLosMensajes.slice(0, mensajesMostrados);

    mensajesAMostrar.forEach(mensaje => {
        crearMensajeEnDOM(mensaje.id, mensaje, messagesContainer);
    });

    // Mostrar/ocultar botón de cargar más
    if (loadMoreButton) {
        loadMoreButton.style.display = mensajesMostrados < todosLosMensajes.length ? 'block' : 'none';
    }

    // Agregar botón de mostrar menos si hay más de 3 mensajes
    if (mensajesMostrados > 3) {
        const showLessButton = document.createElement('button');
        showLessButton.textContent = 'Mostrar menos';
        showLessButton.className = 'show-less-button';
        showLessButton.onclick = function() {
            mensajesMostrados = 3;
            mostrarMensajesPaginados();
        };
        messagesContainer.appendChild(showLessButton);
    }
}

// Función para crear mensaje en el DOM
function crearMensajeEnDOM(mensajeId, mensaje, container) {
    if (!container) {
        console.error('Container no definido');
        return;
    }

    const message = document.createElement('div');
    message.className = 'message';
    message.innerHTML = `
        <h3>${mensaje.nombre}</h3>
        <p>${mensaje.consulta}</p>
        <button class="reply-button">Responder</button>
        <div class="reply-form">
            <input type="text" placeholder="Tu nombre" maxlength="50">
            <textarea placeholder="Tu respuesta" maxlength="300"></textarea>
            <button type="button" class="send-reply-button">Enviar</button>
        </div>
        <div class="replies"></div>
    `;

    // Agregar respuestas existentes
    if (mensaje.respuestas) {
        Object.keys(mensaje.respuestas).forEach((respuestaId) => {
            const respuesta = mensaje.respuestas[respuestaId];
            const replyMessage = document.createElement('div');
            replyMessage.className = 'message reply';
            replyMessage.innerHTML = `
                <h3>${respuesta.nombre}</h3>
                <p>${respuesta.texto}</p>
            `;
            message.querySelector('.replies').appendChild(replyMessage);
        });
    }

    const replyButton = message.querySelector('.reply-button');
    replyButton.addEventListener('click', function() {
        const replyForm = message.querySelector('.reply-form');
        replyForm.style.display = replyForm.style.display === 'block' ? 'none' : 'block';
    });

    const sendReplyButton = message.querySelector('.send-reply-button');
    sendReplyButton.addEventListener('click', function() {
        const replyForm = message.querySelector('.reply-form');
        const replyName = replyForm.querySelector('input').value;
        const replyText = replyForm.querySelector('textarea').value;

        if (replyName && replyText) {
            const nuevaRespuesta = {
                nombre: replyName,
                texto: replyText,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };

            database.ref(`mensajes/${mensajeId}/respuestas`).push(nuevaRespuesta);
            replyForm.style.display = 'none';
            replyForm.querySelector('input').value = '';
            replyForm.querySelector('textarea').value = '';
        }
    });

    container.appendChild(message);
}

    // Animación de aparición al desplazarse
    const tarjetas = document.querySelectorAll('.card, .resource-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    tarjetas.forEach(tarjeta => {
        observer.observe(tarjeta);
    });
