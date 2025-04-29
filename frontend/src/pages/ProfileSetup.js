import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ProfileSetup() {
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const res = await axios.post('/api/auth/profile-setup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update the auth context with the new user data
      login(localStorage.getItem('token'), res.data.user);
      
      // Redirect to explore page
      navigate('/explore');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Complete Your Profile</h2>
        <p>Welcome {user?.username}! Let's set up your profile.</p>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setProfilePic(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows="4"
          />
        </div>

        <button type="submit">Complete Setup</button>
      </form>
    </div>
  );
} 