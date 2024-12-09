// Funciones de interactividad y animaciones
document.addEventListener('DOMContentLoaded', function() {
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
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('foro-form');
    const messagesContainer = document.getElementById('messages-container');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const consulta = document.getElementById('consulta').value;

        if (nombre && consulta) {
            const message = document.createElement('div');
            message.className = 'message';
            message.innerHTML = `
                <h3>${nombre}</h3>
                <p>${consulta}</p>
                <button class="reply-button">Responder</button>
                <div class="reply-form">
                    <input type="text" placeholder="Tu nombre">
                    <textarea placeholder="Tu respuesta"></textarea>
                    <button type="button" class="send-reply-button">Enviar</button>
                </div>
            `;

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
                    const replyMessage = document.createElement('div');
                    replyMessage.className = 'message reply';
                    replyMessage.innerHTML = `
                        <h3>${replyName}</h3>
                        <p>${replyText}</p>
                    `;
                    message.appendChild(replyMessage);
                    replyForm.style.display = 'none';
                    replyForm.querySelector('input').value = '';
                    replyForm.querySelector('textarea').value = '';
                }
            });

            messagesContainer.appendChild(message);

            form.reset();
        }
    });
});

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
