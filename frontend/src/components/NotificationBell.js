import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    const res = await axios.get('/api/notifications', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      for (const notification of unreadNotifications) {
        await axios.post(`/api/notifications/read/${notification._id}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      // Update local state to mark all as read
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const handleDropdown = async () => {
    const newState = !showDropdown;
    setShowDropdown(newState);
    if (newState && notifications.some(n => !n.read)) {
        try {
            await axios.post('/api/notifications/mark-all-read', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        }
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <FaBell 
        size={24} 
        onClick={handleDropdown} 
        style={{ cursor: 'pointer', color: unreadCount > 0 ? '#1976d2' : '#666' }} 
      />
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: -5,
          right: -5,
          background: '#ff4444',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px',
          minWidth: '20px',
          textAlign: 'center'
        }}>
          {unreadCount}
        </span>
      )}
      {showDropdown && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 30,
          background: '#fff',
          border: '1px solid #dbdbdb',
          borderRadius: 8,
          minWidth: 300,
          maxWidth: 400,
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No notifications
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {notifications.map(n => (
                  <li key={n._id} style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #efefef',
                    backgroundColor: n.read ? '#fff' : '#f8f9fa'
                  }}>
                    <div style={{ fontSize: '14px' }}>{n.message}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 