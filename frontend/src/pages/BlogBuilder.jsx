import React, { useState, useEffect } from 'react';

export default function BlogBuilder() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const loadPosts = () => {
    fetch('http://localhost:5000/api/blog')
      .then(res => res.json())
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const createPost = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    })
      .then(res => res.json())
      .then(() => {
        setTitle('');
        setContent('');
        loadPosts();
      })
      .catch(err => console.error(err));
  };

  const togglePublish = (id) => {
    fetch(`http://localhost:5000/api/blog/${id}/publish`, { method: 'PUT' })
      .then(res => res.json())
      .then(loadPosts)
      .catch(err => console.error(err));
  };

  const deletePost = (id) => {
    fetch(`http://localhost:5000/api/blog/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(loadPosts)
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-18: Website & Blog Builder</h2>
      <form onSubmit={createPost} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxWidth: '500px' }}>
        <input placeholder="Post title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Post content" value={content} onChange={e => setContent(e.target.value)} rows={5} required />
        <button type="submit">Create Post</button>
      </form>
      {posts.map(p => (
        <div key={p._id} style={{ marginBottom: '12px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <strong>{p.title}</strong>
          {' '}<span style={{ opacity: 0.7 }}>[{p.published ? 'published' : 'draft'}]</span>
          <p style={{ margin: '6px 0', opacity: 0.75 }}>/blog/{p.slug}</p>
          <button onClick={() => togglePublish(p._id)} style={{ marginRight: '8px' }}>
            {p.published ? 'Unpublish' : 'Publish'}
          </button>
          <button onClick={() => deletePost(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}