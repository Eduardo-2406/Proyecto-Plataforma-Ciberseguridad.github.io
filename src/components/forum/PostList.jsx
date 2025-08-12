import React, { useState } from 'react';
import Post from './Post';

const PostList = ({ posts, onLike, onDelete, currentUser }) => {
  const [expandedPost, setExpandedPost] = useState(null);

  const handleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  if (posts.length === 0) {
    return (
      <div className="no-posts">
        <p>No hay publicaciones en esta categoría.</p>
        <p>Sé el primero en compartir algo.</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <Post
          key={post.id}
          post={post}
          onLike={() => onLike(post.id)}
          onDelete={() => onDelete(post.id)}
          isExpanded={expandedPost === post.id}
          onExpand={() => handleExpandPost(post.id)}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default PostList;