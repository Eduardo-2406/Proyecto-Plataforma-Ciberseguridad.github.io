import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { rtdb } from '../../config/firebase';
import { ref, push, onValue, update, remove, get } from 'firebase/database';
import PostList from './PostList';
import CreatePost from './CreatePost';
import AnimatedText from '../animations/AnimatedText';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/Forum.css';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('todos');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const postsRef = ref(rtdb, 'forum/posts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const postsArray = Object.entries(data)
            .map(([id, post]) => ({
              id,
              ...post,
              timestamp: new Date(post.timestamp)
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
          
          // Filtrar por categoría si no es 'todos'
          const filteredPosts = category === 'todos' 
            ? postsArray 
            : postsArray.filter(post => post.category === category);
            
          setPosts(filteredPosts);
        }
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los posts');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [category]);

  // Efecto para manejar el scroll y mostrar/ocultar el botón
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para hacer scroll hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCreatePost = async (postData) => {
    if (!currentUser) return;

    try {
      // Obtener datos actualizados del usuario incluyendo avatar
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();
      
      const postRef = ref(rtdb, 'forum/posts');
      await push(postRef, {
        ...postData,
        authorId: currentUser.uid,
        authorName: userData?.displayName || currentUser.displayName || 'Usuario',
        authorPhoto: userData?.avatarId || 'circle',
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
      });
    } catch (error) {
      setError('Error al crear el post');
    }
  };

  const handleLike = async (postId) => {
    if (!currentUser) return;

    try {
      const postRef = ref(rtdb, `forum/posts/${postId}`);
      const post = posts.find(p => p.id === postId);
      const userLikes = post.userLikes || {};
      const hasLiked = userLikes[currentUser.uid];

      if (hasLiked) {
        // Quitar like
        const updatedUserLikes = { ...userLikes };
        delete updatedUserLikes[currentUser.uid];
        await update(postRef, {
          likes: Math.max(0, (post.likes || 0) - 1),
          userLikes: updatedUserLikes
        });
      } else {
        // Agregar like
        await update(postRef, {
          likes: (post.likes || 0) + 1,
          userLikes: {
            ...userLikes,
            [currentUser.uid]: true
          }
        });
      }
    } catch (error) {
      setError('Error al dar like');
    }
  };

  const handleDelete = async (postId) => {
    if (!currentUser) return;

    try {
      const postRef = ref(rtdb, `forum/posts/${postId}`);
      await remove(postRef);
    } catch (error) {
      setError('Error al eliminar el post');
    }
  };

  if (loading) {
    return (
      <div className="forum-container" />
    );
  }

  return (
    <div className="forum-container">
      <div className="forum-header">
        <AnimatedText 
          text="Foro de Discusión" 
          className="animated-title"
          type="h1" 
        />
        <div className="category-filters">
          <button 
            className={`filter-button ${category === 'todos' ? 'active' : ''}`}
            onClick={() => setCategory('todos')}
          >
            Todos
          </button>
          <button 
            className={`filter-button ${category === 'dudas' ? 'active' : ''}`}
            onClick={() => setCategory('dudas')}
          >
            Dudas
          </button>
          <button 
            className={`filter-button ${category === 'casos' ? 'active' : ''}`}
            onClick={() => setCategory('casos')}
          >
            Casos
          </button>
          <button 
            className={`filter-button ${category === 'practicas' ? 'active' : ''}`}
            onClick={() => setCategory('practicas')}
          >
            Buenas Prácticas
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {currentUser && (
        <CreatePost onSubmit={handleCreatePost} />
      )}

      <PostList 
        posts={posts}
        onLike={handleLike}
        onDelete={handleDelete}
        currentUser={currentUser}
      />
      
      {/* Botón de scroll hacia arriba */}
      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Volver al inicio"
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </div>
  );
};

export default Forum;