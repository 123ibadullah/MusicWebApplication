// components/AlbumItem.jsx
import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ThemeContext";
import { usePlayer } from "../context/PlayerContext";

const AlbumItem = memo(({ image, name, desc, id }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { playWithId, songsData } = usePlayer();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const defaultImage = "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=300&h=300&fit=crop&crop=center";

  // Data validation and fallbacks
  const safeImage = image && typeof image === 'string' ? image : defaultImage;
  const safeName = name && typeof name === 'string' ? name : "Untitled Album";
  const safeDesc = desc && typeof desc === 'string' ? desc : "No description available";
  const safeId = id && typeof id === 'string' ? id : null;

  const handleClick = () => {
    if (safeId) {
      navigate(`/album/${safeId}`);
    } else {
      showToast("This album is not available", "error");
    }
  };

  const handleImageError = () => {
    setImgError(true);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (safeId) {
      // Find songs from this album
      const albumSongs = songsData.filter(song => song.album === safeName);
      
      if (albumSongs.length > 0) {
        // Navigate to album page and play first song
        navigate(`/album/${safeId}`);
        // Play the first song from the album
        playWithId(albumSongs[0]._id);
        showToast(`Playing album: ${safeName}`, "success");
      } else {
        showToast("No songs found in this album", "error");
      }
    } else {
      showToast("Cannot play this album", "error");
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
          <img 
            src={imgError ? defaultImage : safeImage} 
            onError={handleImageError}
            className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
            alt={safeName}
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          
          {/* Play Button Overlay - Only show if album is available */}
          {safeId && (
            <div className={`absolute bottom-3 right-3 transform transition-all duration-300 z-20 ${ 
              isHovered ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'
            }`}>
              <button 
                onClick={handlePlayClick}
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/play z-20"
              >
                <svg className="w-5 h-5 text-white ml-0.5 group-hover/play:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
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
        
        <div className="space-y-2">
          <h3 className={`font-bold text-lg truncate leading-tight transition-colors duration-300 ${
            safeId 
              ? 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {safeName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
            {safeDesc}
          </p>
        </div>

        {/* Hover Border Effect - Only for available albums */}
        {safeId && (
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 transition-all duration-500 pointer-events-none" />
        )}
      </div>
    </div>
  );
});

export default AlbumItem;