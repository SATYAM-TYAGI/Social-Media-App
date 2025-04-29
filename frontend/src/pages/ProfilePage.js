import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/auth/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setUser(res.data);
      // Fetch posts for this user
      if (res.data.posts && res.data.posts.length > 0) {
        axios.get('/api/posts/feed').then(feedRes => {
          // Filter posts by uploader
          const userPosts = feedRes.data.filter(p => p.uploader?._id === res.data._id);
          setPosts(userPosts);
        });
      }
    });
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    await axios.delete(`/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setPosts(posts.filter(p => p._id !== postId));
  };

  const handleEdit = async (postId) => {
    const post = posts.find(p => p._id === postId);
    // Use a modal or dedicated form component instead of prompt
    const updatedCaption = prompt('Enter new caption:');
    const updatedTags = prompt('Enter new tags (comma separated):');
    if (updatedCaption !== null && updatedTags !== null) {
      const response = await axios.put(`/api/posts/${postId}`, {
        caption: updatedCaption,
        tags: updatedTags
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Update the posts state instead of reloading
      setPosts(posts.map(p => p._id === postId ? response.data : p));
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.profilePic} alt="Profile" className="profile-pic" />
        <h2>{user.username}</h2>
        <p>{user.bio}</p>
      </div>
      <h3>Your Posts</h3>
      <div className="profile-posts">
        {posts.length === 0 && <div>No posts yet.</div>}
        {posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
} 