// components/CreatePlaylistModal.jsx
import React, { useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { useTheme } from "../context/ThemeContext";

const CreatePlaylistModal = () => {
  const { showPlaylistModal, setShowPlaylistModal, createPlaylist } = usePlayer();
  const { isDark } = useTheme();
  const [playlistName, setPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!playlistName.trim()) return;
    
    setLoading(true);
    const result = await createPlaylist(playlistName.trim());
    setLoading(false);
    
    if (result.success) {
      setPlaylistName("");
      setShowPlaylistModal(false);
    }
  };

  const handleClose = () => {
    setPlaylistName("");
    setShowPlaylistModal(false);
  };

  if (!showPlaylistModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Playlist</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Playlist Name
          </label>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="My Awesome Playlist"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!playlistName.trim() || loading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              'Create Playlist'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;