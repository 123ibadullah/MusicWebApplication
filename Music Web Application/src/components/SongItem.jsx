import React, { useState, useCallback, useMemo, useEffect } from "react";
import { usePlayer } from "../context/PlayerContext";
import { useToast } from "../context/ThemeContext";
import ErrorBoundary from "./ErrorBoundary";
import AddToPlaylistDropdown from "./AddToPlaylistDropdown";

/**
 * SongItem Component
 * Displays an individual song with play, like, and interaction controls
 * 
 * @param {Object} props
 * @param {string} props.image - URL of the song's cover image
 * @param {string} props.name - Name of the song
 * @param {string} props.desc - Description or artist name
 * @param {string} props.id - Unique identifier for the song
 * @param {string} props.duration - Song duration in MM:SS format
 * @param {string} props.album - Album name
 */
const SongItem = ({ image, name, desc, id, duration, album }) => {
  // Context hooks for playback and like state
  const {
    playWithId,
    isSongLiked,
    toggleLikeSong,
    songsData,
    track,
    playStatus,
    pause,
    play,
    togglePlay
  } = usePlayer();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  // Validate and fallback song data
  const safeValues = useMemo(() => ({
    image: image && typeof image === "string" ? image : "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=300&h=300&fit=crop&crop=center",
    name: name && typeof name === "string" ? name : "Unknown Song",
    desc: desc && typeof desc === "string" ? desc : "Unknown Artist",
    id: id && typeof id === "string" ? id : null,
    duration: duration && typeof duration === "string" ? duration : "0:00",
    album: album && typeof album === "string" ? album : "Unknown Album"
  }), [image, name, desc, id, duration, album]);

  const { image: safeImage, name: safeName, desc: safeDesc, id: safeId, duration: safeDuration, album: safeAlbum } = safeValues;

  // Determine if this song is liked and currently playing
  const isLiked = safeId ? isSongLiked(safeId) : false;
  const isCurrentlyPlaying = track && track._id === safeId && playStatus;

  // Play button handler: ensures only one song plays at a time
  const handlePlay = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      if (!safeId) {
        showToast("This song is not available", "error");
        return;
      }
      
      setIsLoading(true);
      
      try {
        // If already playing, pause; else play this song
        if (isCurrentlyPlaying) {
          pause();
          showToast(`Paused: ${safeName}`, "info");
        } else {
          playWithId(safeId, songsData);
        }
      } catch (error) {
        console.error('Play error:', error);
        showToast("Failed to play song", "error");
      } finally {
        // Reset loading state after a short delay
        setTimeout(() => setIsLoading(false), 500);
      }
    },
    [safeId, safeName, isCurrentlyPlaying, playWithId, songsData, pause, showToast]
  );

  // Keyboard accessibility for play
  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePlay(e);
    }
  }, [handlePlay]);

  // Like button handler: toggles like/unlike and updates UI instantly
  const handleLike = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      if (!safeId) {
        showToast("Cannot like unavailable song", "error");
        return;
      }
      
      try {
        toggleLikeSong(safeId);
      } catch (error) {
        console.error('Like error:', error);
        showToast("Failed to update like status", "error");
      }
    },
    [safeId, toggleLikeSong, showToast]
  );

  // Image error fallback
  const handleImageError = useCallback(() => {
    setImgError(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsLoading(false);
      setIsHovered(false);
    };
  }, []);

  // Loading indicator
  if (isLoading) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="rounded-xl mb-4 aspect-square bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="article"
      aria-label={`Song: ${safeName} by ${safeDesc}`}
      className={`group relative glass-card-premium rounded-3xl p-6 shadow-premium hover:shadow-glow transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 ${
        !safeId ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover-glow-premium"
      } ${isLoading ? "animate-pulse" : ""}`}
    >
      <div className="relative overflow-hidden rounded-xl mb-4 aspect-square">
        <img
          src={imgError ? "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=300&h=300&fit=crop&crop=center" : safeImage}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={safeName}
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {/* Play Button Overlay - Only one song plays at a time */}
        {safeId && (
          <div
            className={`absolute bottom-3 right-3 transform transition-all duration-300 z-10 ${
              isHovered ? "translate-y-0 opacity-100 scale-100" : "translate-y-0 opacity-90 scale-100"
            }`}
          >
            <button
              onClick={handlePlay}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
                isCurrentlyPlaying ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
              title={isCurrentlyPlaying ? "Pause" : "Play"}
              aria-label={isCurrentlyPlaying ? `Pause ${safeName}` : `Play ${safeName}`}
              role="button"
              tabIndex={0}
            >
              {isCurrentlyPlaying ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Like Button Overlay - instant UI update */}
        {safeId && (
          <div
            className={`absolute top-3 right-3 transform transition-all duration-300 z-10 ${
              isHovered ? "translate-y-0 opacity-100 scale-100" : "translate-y-0 opacity-90 scale-100"
            }`}
          >
            <button
              onClick={handleLike}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 ${
                isLiked
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/30 text-gray-800 hover:bg-white/50 dark:bg-gray-700/30 dark:text-gray-200 dark:hover:bg-gray-700/50"
              }`}
              title={isLiked ? "Remove from liked songs" : "Add to liked songs"}
              aria-label={isLiked ? `Remove ${safeName} from liked songs` : `Add ${safeName} to liked songs`}
              role="button"
              aria-pressed={isLiked}
              tabIndex={0}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Add to Playlist Button Overlay */}
        {safeId && (
          <div
            className={`absolute top-3 left-3 transform transition-all duration-300 z-20 ${
              isHovered ? "translate-y-0 opacity-100 scale-100" : "translate-y-0 opacity-90 scale-100"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowAddToPlaylist(true);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 bg-white/30 text-gray-800 hover:bg-white/50 dark:bg-gray-700/30 dark:text-gray-200 dark:hover:bg-gray-700/50"
              title="Add to playlist"
              aria-label={`Add ${safeName} to playlist`}
              role="button"
              tabIndex={0}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Add to Playlist Modal (mounted outside hover visual stack) */}
        {safeId && (
          <AddToPlaylistDropdown
            songId={safeId}
            isOpen={showAddToPlaylist}
            onClose={() => setShowAddToPlaylist(false)}
          />
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
            ? "text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
            : "text-gray-500 dark:text-gray-400"
        }`}>
          {safeName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
          {safeDesc}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="truncate">{safeAlbum}</span>
          <span className="ml-2 flex-shrink-0">{safeDuration}</span>
        </div>
      </div>

      {/* Hover Border Effect - Only for available songs */}
      {safeId && (
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 transition-all duration-500 pointer-events-none" />
      )}
    </div>
  );
};

// Wrap with Error Boundary
const WrappedSongItem = (props) => (
  <ErrorBoundary onReset={() => window.location.reload()}>
    <SongItem {...props} />
  </ErrorBoundary>
);

export default React.memo(WrappedSongItem);
