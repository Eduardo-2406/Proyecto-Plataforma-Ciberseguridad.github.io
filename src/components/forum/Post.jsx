import React, { useState } from 'react';
import { rtdb } from '../../config/firebase';
import { ref, push } from 'firebase/database';
import '../../styles/Post.css';

const Post = ({ post, onLike, onDelete, isExpanded, onExpand, currentUser }) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      const commentsRef = ref(rtdb, `forum/posts/${post.id}/comments`);
      await push(commentsRef, {
        text: newComment.trim(),
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Usuario',
        authorPhoto: currentUser.photoURL || null,
        timestamp: new Date().toISOString()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      onExpand();
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      dudas: 'Dudas',
      casos: 'Casos',
      practicas: 'Buenas Prácticas'
    };
    return labels[category] || category;
  };

  return (
    <div className={`post ${isExpanded ? 'expanded' : ''}`}>
      <div className="post-header">
        <div className="post-author">
          <img 
            src={post.authorPhoto || '/default-avatar.png'} 
            alt={post.authorName}
            className="author-avatar"
          />
          <div className="author-info">
            <span className="author-name">{post.authorName}</span>
            <span className="post-date">{formatDate(post.timestamp)}</span>
          </div>
        </div>
        <div className="post-category">
          {getCategoryLabel(post.category)}
        </div>
      </div>

      <div className="post-content">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>

      <div className="post-actions">
        <button 
          className="action-button like-button"
          onClick={onLike}
          disabled={!currentUser}
        >
          <span className="icon">👍</span>
          <span className="count">{post.likes || 0}</span>
        </button>

        <button 
          className="action-button comment-button"
          onClick={toggleComments}
        >
          <span className="icon">💬</span>
          <span className="count">
            {post.comments ? Object.keys(post.comments).length : 0}
          </span>
        </button>

        {currentUser && currentUser.uid === post.authorId && (
          <button 
            className="action-button delete-button"
            onClick={onDelete}
          >
            <span className="icon">🗑️</span>
          </button>
        )}
      </div>

      {showComments && (
        <div className="comments-section">
          {currentUser && (
            <form onSubmit={handleComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                rows="3"
                required
              />
              <button type="submit" className="submit-comment">
                Comentar
              </button>
            </form>
          )}

          <div className="comments-list">
            {post.comments && Object.entries(post.comments)
              .sort(([, a], [, b]) => new Date(b.timestamp) - new Date(a.timestamp))
              .map(([id, comment]) => (
                <div key={id} className="comment">
                  <div className="comment-header">
                    <img 
                      src={comment.authorPhoto || '/default-avatar.png'} 
                      alt={comment.authorName}
                      className="comment-avatar"
                    />
                    <div className="comment-info">
                      <span className="comment-author">{comment.authorName}</span>
                      <span className="comment-date">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post; 