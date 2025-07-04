import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import { Power } from 'lucide-react';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  // Get logged in user from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const loggedInEmail = loggedInUser?.email || "employee@company.com";

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await API.get('/users/employees');
        const user = res.data.find(u => u.email === loggedInUser?.email);
        if (user) {
          setUserName(user.name);
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    };

    // Only fetch if userName is not already set
    if (!userName) {
      fetchUserName();
    }
  }, []); // Removed loggedInEmail from dependencies to prevent auto-refresh

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();

    if (onLogout) onLogout();

    navigate('/');
  };

  // Get first letter of username or email
  const displayInitial = (userName || loggedInEmail.split('@')[0]).charAt(0).toUpperCase();

  return (
    <header className="w-full bg-white/90 backdrop-blur-lg border-b border-gray-200/80 py-4 px-6 sm:px-8 rounded-lg shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-xl font-bold">{displayInitial}</span>
          </div>
          <div>
            <h1 className="text-sm text-gray-500 font-medium">Welcome back,</h1>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {userName || loggedInEmail.split('@')[0]}
              <span className="text-blue-500" role="img" aria-label="wave">👋</span>
            </h2>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm hover:shadow-md"
          onClick={handleLogoutClick}
        >
          <Power className="w-4 h-4" />
          Log out
        </button>
      </div>
    </header>
  );
};

export default Header;