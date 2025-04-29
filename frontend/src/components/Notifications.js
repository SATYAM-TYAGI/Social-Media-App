import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Notifications() {
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Show unread notifications as toasts
      res.data
        .filter(n => !n.read)
        .forEach(n => {
          toast.info(n.message, {
            onClose: async () => {
              await axios.post(`/api/notifications/read/${n._id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              });
            }
          });
        });
    };
    fetchNotifications();
    // Optionally, poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return null; // No visible UI, just triggers toasts
} 