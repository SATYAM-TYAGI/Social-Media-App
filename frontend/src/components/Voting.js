import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

export default function Voting({ tag }) {
  const [posts, setPosts] = useState([]);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    axios.get(`/api/posts/tag/${tag}`).then(res => {
      // Randomly select 2-4 posts
      const shuffled = res.data.sort(() => 0.5 - Math.random());
      setPosts(shuffled.slice(0, Math.min(4, shuffled.length)));
    });
  }, [tag]);

  const handleVote = async (postId) => {
    await axios.post('/api/likes/like', { postId, tag }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setVoted(true);
  };

  if (voted) return <div>Thank you for voting!</div>;

  return (
    <div>
      <h3>Vote for the best #{tag} post!</h3>
      <div style={{ display: 'flex', gap: 16 }}>
        {posts.map(post => (
          <div key={post._id} style={{ flex: 1 }}>
            <PostCard post={post} />
            <button onClick={() => handleVote(post._id)}>Vote</button>
          </div>
        ))}
      </div>
    </div>
  );
} 