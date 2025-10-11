import React, { useContext, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../ui/NotificationBell';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const initial = user?.fullName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="flex justify-end items-center px-6 py-3 bg-white border-b relative">
      {/* 🔔 Notification */}
      <NotificationBell />

      {/* 👤 Avatar */}
      <div className="relative ml-4">
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full cursor-pointer font-semibold relative"
        >
          {initial}
          {user?.role === 'admin' && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 py-0.5 rounded-full">admin</span>
          )}
        </div>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
            <button
              onClick={() => {
                navigate('/profile');
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Profil
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNav;
