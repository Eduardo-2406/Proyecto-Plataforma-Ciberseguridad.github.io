// Sistema de Foro
class ForumSystem {
    constructor() {
        this.postsContainer = document.querySelector('.forum-posts');
        this.newPostForm = document.querySelector('.new-post-form');
        this.init();
    }

    init() {
        if (!this.postsContainer) {
            console.log('No se encontraron los elementos necesarios del foro');
            return;
        }

        // Mostrar el formulario de nuevo post si el usuario está autenticado
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.newPostForm.classList.remove('hidden');
            } else {
                this.newPostForm.classList.add('hidden');
            }
        });

        // Cargar posts
        this.loadPosts();

        // Configurar el formulario de nuevo post
        const postForm = document.getElementById('post-form');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createPost(e.target);
            });
        }
    }

    async loadPosts() {
        const postsRef = firebase.database().ref('posts');
        const snapshot = await postsRef.once('value');
        const posts = snapshot.val() || {};

        this.postsContainer.innerHTML = Object.entries(posts)
            .sort(([, a], [, b]) => b.timestamp - a.timestamp)
            .map(([id, post]) => this.createPostElement(id, post))
            .join('');
    }

    createPostElement(id, post) {
        return `
            <div class="post-card" data-id="${id}">
                <div class="post-header">
                    <div class="post-author">
                        <img src="${post.authorPhoto || 'assets/images/default-avatar.png'}" alt="Avatar">
                        <span>${post.authorName}</span>
                    </div>
                    <div class="post-date">${new Date(post.timestamp).toLocaleDateString()}</div>
                </div>
                <div class="post-content">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                </div>
                <div class="post-actions">
                    <button class="btn btn-primary" onclick="forumSystem.likePost('${id}')">
                        <i class="fas fa-thumbs-up"></i> ${post.likes || 0}
                    </button>
                    <button class="btn btn-primary" onclick="forumSystem.showComments('${id}')">
                        <i class="fas fa-comments"></i> ${post.comments ? Object.keys(post.comments).length : 0}
                    </button>
                </div>
            </div>
        `;
    }

    async createPost(form) {
        const user = firebase.auth().currentUser;
        if (!user) return;

        const post = {
            title: form['post-title'].value,
            content: form['post-content'].value,
            authorId: user.uid,
            authorName: user.displayName || user.email,
            authorPhoto: user.photoURL,
            timestamp: Date.now(),
            likes: 0,
            comments: {}
        };

        const postsRef = firebase.database().ref('posts');
        await postsRef.push(post);

        // Limpiar el formulario
        form.reset();

        // Recargar posts
        this.loadPosts();

        // Otorgar puntos por crear un post
        if (window.gamificationSystem) {
            window.gamificationSystem.addPoints(10);
        }
    }

    async likePost(postId) {
        const user = firebase.auth().currentUser;
        if (!user) return;

        const postRef = firebase.database().ref(`posts/${postId}`);
        const snapshot = await postRef.once('value');
        const post = snapshot.val();

        if (!post.likes) post.likes = 0;
        post.likes++;

        await postRef.update({ likes: post.likes });
        this.loadPosts();
    }

    async showComments(postId) {
        const postRef = firebase.database().ref(`posts/${postId}`);
        const snapshot = await postRef.once('value');
        const post = snapshot.val();

        const commentsContainer = document.createElement('div');
        commentsContainer.className = 'comments-container';
        commentsContainer.innerHTML = `
            <h4>Comentarios</h4>
            <div class="comments-list">
                ${post.comments ? Object.entries(post.comments)
                    .map(([id, comment]) => this.createCommentElement(id, comment))
                    .join('') : ''}
            </div>
            <form class="comment-form" onsubmit="forumSystem.addComment(event, '${postId}')">
                <textarea placeholder="Escribe un comentario..." required></textarea>
                <button type="submit" class="btn btn-primary">Comentar</button>
            </form>
        `;

        const postCard = document.querySelector(`[data-id="${postId}"]`);
        const existingComments = postCard.querySelector('.comments-container');
        if (existingComments) {
            existingComments.remove();
        } else {
            postCard.appendChild(commentsContainer);
        }
    }

    createCommentElement(id, comment) {
        return `
            <div class="comment">
                <div class="comment-author">
                    <img src="${comment.authorPhoto || 'assets/images/default-avatar.png'}" alt="Avatar">
                    <span>${comment.authorName}</span>
                </div>
                <p>${comment.content}</p>
                <small>${new Date(comment.timestamp).toLocaleDateString()}</small>
            </div>
        `;
    }

    async addComment(event, postId) {
        event.preventDefault();
        const user = firebase.auth().currentUser;
        if (!user) return;

        const form = event.target;
        const comment = {
            content: form.querySelector('textarea').value,
            authorId: user.uid,
            authorName: user.displayName || user.email,
            authorPhoto: user.photoURL,
            timestamp: Date.now()
        };

        const postRef = firebase.database().ref(`posts/${postId}/comments`);
        await postRef.push(comment);

        // Limpiar el formulario
        form.reset();

        // Recargar los comentarios
        this.showComments(postId);

        // Otorgar puntos por comentar
        if (window.gamificationSystem) {
            window.gamificationSystem.addPoints(5);
        }
    }
}

// Inicializar el sistema de foro
const forumSystem = new ForumSystem();
window.forumSystem = forumSystem; 