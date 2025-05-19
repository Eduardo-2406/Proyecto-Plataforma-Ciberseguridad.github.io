import React, { useState, useEffect } from 'react';
import { auth, rtdb } from '../config/firebase';
import { ref, push, onValue, remove } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/Comments.css';

const Comments = ({ moduleId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadComments(moduleId);
      }
    });

    return () => unsubscribe();
  }, [moduleId]);

  const loadComments = (moduleId) => {
    const commentsRef = ref(rtdb, `modules/${moduleId}/comments`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const commentsArray = Object.entries(data)
        .map(([id, comment]) => ({
          id,
          ...comment,
          timestamp: new Date(comment.timestamp)
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      setComments(commentsArray);
    });

    return () => unsubscribe();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const commentRef = ref(rtdb, `modules/${moduleId}/comments`);
    await push(commentRef, {
      text: newComment.trim(),
      userId: user.uid,
      userName: user.displayName || 'Usuario',
      userPhoto: user.photoURL || null,
      timestamp: new Date().toISOString()
    });

    setNewComment('');
  };

  const handleDelete = async (commentId) => {
    if (!user) return;

    const commentRef = ref(rtdb, `modules/${moduleId}/comments/${commentId}`);
    await remove(commentRef);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'ahora mismo';
  };

  return (
    <div className="comments-container">
      <h3>Comentarios</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            rows="3"
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
          >
            Comentar
          </button>
        </form>
      ) : (
        <p className="login-prompt">
          Inicia sesión para dejar un comentario
        </p>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No hay comentarios aún</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="user-info">
                  {comment.userPhoto ? (
                    <img 
                      src={comment.userPhoto} 
                      alt={comment.userName}
                      className="user-avatar"
                    />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {comment.userName[0]}
                    </div>
                  )}
                  <div>
                    <span className="user-name">{comment.userName}</span>
                    <span className="comment-time">
                      {formatTimestamp(comment.timestamp)}
                    </span>
                  </div>
                </div>
                {user && user.uid === comment.userId && (
                  <button
                    className="delete-comment"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <i className="fas fa-trash" />
                  </button>
                )}
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments; 