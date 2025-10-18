// components/PlaylistItem.jsx
import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ThemeContext";
import { usePlayer } from "../context/PlayerContext";

const PlaylistItem = memo(({ id, name, songCount = 0, image }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { playPlaylist } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);

  // Data validation and fallbacks
  const safeName = name && typeof name === 'string' ? name : "Untitled Playlist";
  const safeId = id && typeof id === 'string' ? id : null;
  const safeSongCount = typeof songCount === 'number' ? songCount : 0;
  
  // Default playlist image with gradient
  const defaultImage = `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;

  const handleClick = () => {
    if (safeId) {
      navigate(`/playlist/${safeId}`);
    } else {
      showToast("This playlist is not available", "error");
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (safeId && safeSongCount > 0) {
      playPlaylist(safeId);
    } else if (safeSongCount === 0) {
      showToast("This playlist is empty", "info");
    } else {
      showToast("Cannot play this playlist", "error");
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group cursor-pointer transition-all duration-500 ${
        !safeId ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <div className="relative glass-card-premium rounded-3xl p-6 shadow-premium hover:shadow-glow transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 hover-glow-premium">
        <div className="relative overflow-hidden rounded-xl mb-4">
          {/* Playlist Image/Icon */}
          <div 
            className="w-full aspect-square rounded-xl flex items-center justify-center text-white text-6xl font-bold relative overflow-hidden"
            style={{
              background: image && typeof image === 'string' 
                ? `url(${image}) center/cover` 
                : defaultImage
            }}
          >
            {!image && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-6xl">🎵</span>
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            
            {/* Play Button Overlay - Only show if playlist is available and has songs */}
            {safeId && safeSongCount > 0 && (
              <div className={`absolute bottom-3 right-3 transform transition-all duration-300 ${
                isHovered ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'
              }`}>
                <button 
                  onClick={handlePlayClick}
                  className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/play"
                >
                  <svg className="w-5 h-5 text-gray-800 ml-0.5 group-hover/play:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* Empty Playlist Badge */}
            {safeSongCount === 0 && (
              <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                Empty
              </div>
            )}

            {/* Unavailable Badge */}
            {!safeId && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                Unavailable
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className={`font-bold text-lg truncate leading-tight transition-colors duration-300 ${
            safeId 
              ? 'text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {safeName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {safeSongCount === 0 
              ? 'No songs yet' 
              : `${safeSongCount} ${safeSongCount === 1 ? 'song' : 'songs'}`
            }
          </p>
        </div>

        {/* Hover Border Effect - Only for available playlists */}
        {safeId && (
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-500/20 transition-all duration-500 pointer-events-none" />
        )}
      </div>
    </div>
  );
});

export default PlaylistItem;