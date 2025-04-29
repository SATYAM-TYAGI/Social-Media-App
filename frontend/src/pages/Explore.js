import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Voting from '../components/Voting';
import TrendingTags from '../components/TrendingTags';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';

export default function Explore() {
  const [tag, setTag] = useState('');
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/posts/feed').then(res => setPosts(res.data));
    // Fetch liked posts for the current user
    axios.get('/api/likes/user', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setLikedPosts(res.data.map(like => like.post)));
  }, []);

  const handleVote = async (postId) => {
    try {
      await axios.post('/api/likes/like', { postId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLikedPosts([...likedPosts, postId]);
      // Update post likes in UI
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: p.likes + 1 } : p));
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handlePostUpdate = (updatedPost, deletedPostId = null) => {
    if (!updatedPost && deletedPostId) {
      // Post was deleted
      setPosts(prevPosts => prevPosts.filter(p => p._id !== deletedPostId));
      setTrendingPosts(prevPosts => prevPosts.filter(p => p._id !== deletedPostId));
    } else if (updatedPost) {
      // Post was edited
      setPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
      setTrendingPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
    }
  };

  // Filter and sort posts by tag and likes
  const filteredPosts = tag
    ? posts
        .filter(post => post.tags && post.tags.includes(tag))
        .sort((a, b) => b.likes - a.likes)
    : posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Add function to calculate trending posts
  const calculateTrending = () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    
    const trending = posts.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate > threeHoursAgo;
    }).sort((a, b) => b.likes - a.likes);

    // Group by tags and find most trending for each tag
    const trendingByTag = {};
    trending.forEach(post => {
      post.tags.forEach(tag => {
        if (!trendingByTag[tag] || trendingByTag[tag].likes < post.likes) {
          trendingByTag[tag] = post;
        }
      });
    });

    setTrendingPosts(Object.values(trendingByTag));
  };

  return (
    <div className="explore-page">
      <div className="main-content">
        <TrendingTags />
        <div className="explore-content">
          <h2>Explore Posts</h2>
          <input
            value={tag}
            onChange={e => setTag(e.target.value)}
            placeholder="Enter tag (without #)"
            className="tag-input"
          />
          {tag && <h3>Posts Related To {tag}.</h3>}
          <div>
            {filteredPosts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                liked={likedPosts.includes(post._id)}
                onVote={handleVote}
                onPostUpdate={handlePostUpdate}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="trending-section">
        <h2>Trending Posts</h2>
        {trendingPosts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            liked={likedPosts.includes(post._id)}
            onVote={handleVote}
            onPostUpdate={handlePostUpdate}
          />
        ))}
      </div>
    </div>
  );
} 