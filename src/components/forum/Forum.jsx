import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { rtdb } from '../../config/firebase';
import { ref, push, onValue, update, remove } from 'firebase/database';
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

  const handleCreatePost = async (postData) => {
    if (!currentUser) return;

    try {
      const postRef = ref(rtdb, 'forum/posts');
      await push(postRef, {
        ...postData,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Usuario',
        authorPhoto: currentUser.photoURL || null,
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
      await update(postRef, {
        likes: (post.likes || 0) + 1
      });
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
    </div>
  );
};

export default Forum;