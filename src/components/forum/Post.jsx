import React, { useState } from 'react';
import { rtdb } from '../../config/firebase';
import { ref, push } from 'firebase/database';
import { 
  FaUserAstronaut, FaUserNinja, FaUserSecret, FaUserTie,
  FaUserGraduate, FaUserShield, FaUserCog, FaUserAlt,
  FaUserCircle, FaUserCheck
} from 'react-icons/fa';
import '../../styles/Post.css';

const AVATAR_OPTIONS = [
  { id: 'astronaut', icon: FaUserAstronaut, name: 'Astronauta' },
  { id: 'ninja', icon: FaUserNinja, name: 'Ninja' },
  { id: 'secret', icon: FaUserSecret, name: 'Agente Secreto' },
  { id: 'tie', icon: FaUserTie, name: 'Ejecutivo' },
  { id: 'graduate', icon: FaUserGraduate, name: 'Graduado' },
  { id: 'shield', icon: FaUserShield, name: 'Guardián' },
  { id: 'cog', icon: FaUserCog, name: 'Ingeniero' },
  { id: 'alt', icon: FaUserAlt, name: 'Alternativo' },
  { id: 'circle', icon: FaUserCircle, name: 'Círculo' },
  { id: 'check', icon: FaUserCheck, name: 'Verificado' }
];

const Post = ({ post, onLike, onDelete, isExpanded, onExpand, currentUser }) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const getAvatarIcon = (avatarId) => {
    const avatarOption = AVATAR_OPTIONS.find(option => option.id === avatarId);
    return avatarOption ? avatarOption.icon : FaUserCircle;
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      // Obtener datos actualizados del usuario incluyendo avatar
      const { get } = await import('firebase/database');
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      const commentsRef = ref(rtdb, `forum/posts/${post.id}/comments`);
      await push(commentsRef, {
        text: newComment.trim(),
        authorId: currentUser.uid,
        authorName: userData?.displayName || currentUser.displayName || 'Usuario',
        authorPhoto: userData?.avatarId || 'circle',
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
          <div className="author-avatar">
            {React.createElement(getAvatarIcon(post.authorPhoto || 'circle'), {
              className: 'avatar-icon'
            })}
          </div>
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
          className={`action-button like-button ${
            currentUser && post.userLikes && post.userLikes[currentUser.uid] ? 'liked' : ''
          }`}
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
                    <div className="comment-avatar">
                      {React.createElement(getAvatarIcon(comment.authorPhoto || 'circle'), {
                        className: 'avatar-icon'
                      })}
                    </div>
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