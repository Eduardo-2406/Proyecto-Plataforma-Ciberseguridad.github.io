import React, { useState } from 'react';
import '../../styles/CreatePost.css';

const CreatePost = ({ onSubmit }) => {
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: 'dudas'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (post.title.trim() && post.content.trim()) {
      onSubmit(post);
      setPost({
        title: '',
        content: '',
        category: 'dudas'
      });
    }
  };

  return (
    <div className="create-post">
      <h2>Crear Nueva Publicación</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            placeholder="Escribe un título descriptivo"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            value={post.category}
            onChange={(e) => setPost({ ...post, category: e.target.value })}
          >
            <option value="dudas">Dudas</option>
            <option value="casos">Casos</option>
            <option value="practicas">Buenas Prácticas</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Contenido</label>
          <textarea
            id="content"
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            placeholder="Describe tu duda, caso o buena práctica..."
            rows="6"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Publicar
        </button>
      </form>
    </div>
  );
};

export default CreatePost; 