import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/posts/feed').then(res => setPosts(res.data));
  }, []);

  return (
    <div>
      {posts.map(post => <PostCard key={post._id} post={post} />)}
    </div>
  );
} 