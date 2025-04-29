import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './PostCard.css';
import Comments from './Comments';

export default function PostCard({ post, liked, onVote, onPostUpdate }) {
  const { user } = useAuth();
  const isOwner = user && post.uploader && (user.id === post.uploader._id || user._id === post.uploader._id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption);
  const [editedTags, setEditedTags] = useState(post.tags.join(', '));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `/api/posts/${post._id}`,
        { caption: editedCaption, tags: editedTags },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setIsEditing(false);
      if (onPostUpdate) onPostUpdate(response.data);
    } catch (err) {
      console.error('Failed to update post:', err);
      setError('Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple delete requests
    
    try {
      setIsDeleting(true);
      await axios.delete(`/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Pass null and the post ID to indicate deletion
      if (onPostUpdate) onPostUpdate(null, post._id);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Failed to delete post');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // If running frontend and backend separately, you may need to prefix with backend URL:
  // const imageUrl = post.imageUrl.startsWith('/uploads') ? `http://localhost:5000${post.imageUrl}` : post.imageUrl;
  const imageUrl = post.imageUrl;

  return (
    <div className="post-card">
      {error && <div className="error-message">{error}</div>}
      <img src={imageUrl} alt="post" className="post-image" />
      <div className="post-info">
        <div className="post-user">{post.uploader?.username}</div>
        
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editedCaption}
              onChange={e => setEditedCaption(e.target.value)}
              placeholder="Caption"
            />
            <input
              value={editedTags}
              onChange={e => setEditedTags(e.target.value)}
              placeholder="Tags (comma separated)"
            />
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <div className="post-caption">{post.caption}</div>
            <div className="post-tags">
              {(post.tags || []).map(tag => <span key={tag}>#{tag} </span>)}
            </div>
          </>
        )}

        <div className="post-votes">
          <span className="vote-count">▲ {post.likes}</span>
          <button
            onClick={() => onVote && onVote(post._id)}
            disabled={liked}
            className="vote-button"
          >
            {liked ? "Voted" : "Vote"}
          </button>
        </div>

        {isOwner && !isEditing && (
          <div className="post-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            {showDeleteConfirm ? (
              <div className="delete-confirm">
                <span>Are you sure?</span>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes'}
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  No
                </button>
              </div>
            ) : (
              <button onClick={() => setShowDeleteConfirm(true)}>Delete</button>
            )}
          </div>
        )}
      </div>
      <Comments postId={post._id} />
    </div>
  );
} 