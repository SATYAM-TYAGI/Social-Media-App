import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TrendingTags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    axios.get('/api/tags/trending').then(res => setTags(res.data));
  }, []);

  return (
    <div>
      <h3>Trending Tags</h3>
      <ul>
        {tags.map(tag => (
          <li key={tag._id}>#{tag.name} ({tag.usageCount})</li>
        ))}
      </ul>
    </div>
  );
} 