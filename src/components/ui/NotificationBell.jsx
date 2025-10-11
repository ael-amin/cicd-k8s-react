import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const { notifications, markAsRead } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // 🧠 Filter notifications based on user role
  const filtered = notifications.filter(n =>
    user.role === 'admin'
      ? n.type === 'admin'
      : (n.type === 'user' && n.userId === user.email)
  );

  const unreadCount = filtered.filter(n => !n.read).length;

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotification = (notif) => {
    markAsRead(notif.id); // ✅ Mark as read
    navigate(notif.link);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handler = e => {
      if (!e.target.closest('.notification-bell')) setShowDropdown(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="relative notification-bell">
      <button onClick={handleClick} className="relative p-2 text-gray-600 hover:text-gray-800">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
          <div className="p-4 border-b">
            <strong>Notifications</strong>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="p-4 text-gray-500 text-center">No new notifications</div>
            )}
            {filtered.map(n => (
              <div
                key={n.id}
                onClick={() => handleNotification(n)}
                className={`p-3 hover:bg-gray-50 cursor-pointer ${
                  n.read ? 'bg-white' : 'bg-gray-100 font-medium'
                }`}
              >
                <div className="text-sm">{n.message}</div>
                <div className="text-xs text-gray-400">
                  {new Date(n.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
