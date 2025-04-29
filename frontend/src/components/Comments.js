import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(
        '/api/comments/add',
        { postId, text },
        config
      );

      if (response.data) {
        setText('');
        await fetchComments();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Failed to add comment');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="comments-section">
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleAdd}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a comment..."
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </form>
      <div className="comments-list">
        {comments.map(c => (
          <div key={c._id} className="comment-item">
            <b>{c.user?.username}:</b> {c.text}
          </div>
        ))}
      </div>
    </div>
  );
} 