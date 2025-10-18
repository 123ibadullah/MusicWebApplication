// components/AddToPlaylistDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ThemeContext';

const AddToPlaylistDropdown = ({ songId, isOpen, onClose }) => {
  const { playlists, addSongToPlaylist } = usePlayer();
  const { showToast } = useToast();
  const dropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleAddToPlaylist = async (playlistId) => {
    setIsLoading(true);
    try {
      const result = await addSongToPlaylist(playlistId, songId);
      if (result.success) {
        showToast("Song added to playlist!", "success");
        onClose();
      } else {
        showToast(result.message || "Failed to add song to playlist.", "error");
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      showToast("An unexpected error occurred.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        ref={dropdownRef}
        className="add-to-playlist-modal relative z-10 w-96 max-w-[90vw] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Add to Playlist</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {playlists.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                🎵
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">No playlists available</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">Create a playlist first to add songs</p>
              <button
                onClick={() => {
                  onClose();
                  showToast('Create your first playlist from the sidebar!', 'info');
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Create Playlist
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                      🎵
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {playlist.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {playlist.songs?.length || 0} songs
                      </p>
                    </div>
                  </div>
                  {isLoading && (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistDropdown;