// components/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext"; // Import usePlayer hook
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowPlaylistModal, likedSongs, songsData, albumsData, playlists, recentlyPlayed } = usePlayer(); // Use usePlayer hook
  const { isDark } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Only show functional menu items that have data or purpose
  const mainMenu = [
    { id: 'home', path: '/', label: 'Home', icon: '🏠', functional: true },
    { id: 'search', path: '/search', label: 'Search', icon: '🔍', functional: true },
    { id: 'songs', path: '/songs', label: 'All Songs', icon: '🎧', functional: songsData.length > 0 },
    { id: 'library', path: '/library', label: 'Your Library', icon: '📚', functional: songsData.length > 0 },
  ].filter(item => item.functional);

  // Only show library sections that have data
  const libraryMenu = [
    { 
      id: 'recent', 
      path: '/recent', 
      label: 'Recently Played', 
      icon: '🕒', 
      count: recentlyPlayed.length,
      functional: recentlyPlayed.length > 0 
    },
    { 
      id: 'liked', 
      path: '/liked', 
      label: 'Liked Songs', 
      icon: '❤️', 
      count: likedSongs.length,
      functional: likedSongs.length > 0 
    },
    { 
      id: 'playlists', 
      path: '/playlists', 
      label: 'Playlists', 
      icon: '🎵',
      count: playlists.length,
      functional: playlists.length > 0 
    },
    { 
      id: 'albums', 
      path: '/albums', 
      label: 'Albums', 
      icon: '💿',
      count: albumsData.length,
      functional: albumsData.length > 0 
    },
  ].filter(item => item.functional);

  const handleCreatePlaylist = () => {
    setShowPlaylistModal(true);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`hidden lg:flex flex-col w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 ${
      isCollapsed ? 'w-16' : 'w-72'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100/50 dark:border-gray-700/50 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              MusicFlow
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {mainMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                location.pathname === item.path
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Library Section - Only show if there are functional items */}
        {libraryMenu.length > 0 && (
          <div className="px-6 py-6 mt-6 border-t border-gray-100/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              {!isCollapsed && (
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Your Library
                </h3>
              )}
              {!isCollapsed && (
                <button
                  onClick={handleCreatePlaylist}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 hover:scale-105"
                  title="Create playlist"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {libraryMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 group hover:scale-105 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-700'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </div>
                  {!isCollapsed && item.count > 0 && (
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      location.pathname === item.path
                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Create Playlist Card */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Create your first playlist</h3>
              <p className="text-blue-100 text-sm mb-4">It's easy, we'll help you</p>
              <button
                onClick={handleCreatePlaylist}
                className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold text-sm hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
              >
                Create Playlist
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100/50 dark:border-gray-700/50">
        <UserSection isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default Sidebar;

// UserSection component placed here to avoid creating new files

const UserSection = ({ isCollapsed }) => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 transition-all duration-300">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full" />
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">Guest</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Sign in to save your library</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 transition-all duration-300">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
      </div>
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name || user?.email}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Member</p>
        </div>
      )}
      {!isCollapsed && (
        <button onClick={logout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
      )}
    </div>
  );
};