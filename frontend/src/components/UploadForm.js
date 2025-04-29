import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UploadForm() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('caption', caption);
      formData.append('tags', tags);

      await axios.post('/api/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      navigate('/explore');
    } catch (err) {
      setError('Failed to upload post');
    }
  };

  return (
    <div className="upload-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleSubmit} className="upload-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 400 }}>
        <h2>Create New Post</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group" style={{ width: '100%', marginBottom: 16 }}>
          <label>Choose Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        {preview && (
          <div style={{ marginBottom: 16 }}>
            <img src={preview} alt="Preview" style={{ maxWidth: 300, maxHeight: 300, borderRadius: 8 }} />
          </div>
        )}
        <div className="form-group" style={{ width: '100%', marginBottom: 16 }}>
          <label>Caption</label>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Write a caption..."
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group" style={{ width: '100%', marginBottom: 16 }}>
          <label>Tags</label>
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Enter tags (comma separated)"
            required
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" style={{ width: '100%' }}>Share Post</button>
      </form>
    </div>
  );
} 