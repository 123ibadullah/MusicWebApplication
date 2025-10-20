// components/DisplayPlaylist.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { usePlayer } from "../context/PlayerContext";
import { useToast } from "../context/ThemeContext";

const DisplayPlaylist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    playWithId, 
    playPlaylist,
    deletePlaylist, 
    removeSongFromPlaylist,
    playlists
  } = usePlayer();
  
  const { showToast } = useToast();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRemoveSong, setShowRemoveSong] = useState(null);

  const getPlaylistData = async () => {
    try {
      // First try to find playlist in local data
      const localPlaylist = playlists.find(p => p._id === id);
      if (localPlaylist) {
        setPlaylist(localPlaylist);
        setLoading(false);
        return;
      }

      // If not found locally, try backend
      const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/playlist/${id}`);
      if (response.data.success) {
        setPlaylist(response.data.playlist);
      } else {
        showToast("Playlist not found", "error");
      }
    } catch (error) {
      console.error("Error fetching playlist:", error);
      showToast("Failed to load playlist", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    const result = await deletePlaylist(id);
    if (result.success) {
      navigate('/');
    }
    setShowDeleteConfirm(false);
  };

  const handleRemoveSong = async (songId) => {
    const result = await removeSongFromPlaylist(id, songId);
    if (result.success) {
      // Update local state immediately for reactive rendering
      setPlaylist(prevPlaylist => ({
        ...prevPlaylist,
        songs: prevPlaylist.songs.filter(song => song._id !== songId)
      }));
      // Toast is already shown by removeSongFromPlaylist function
    } else {
      showToast("Failed to remove song", "error");
    }
    setShowRemoveSong(null);
  };

  const handlePlayPlaylist = () => {
    if (playlist?.songs?.length > 0) {
      playPlaylist(playlist._id);
    } else {
      showToast("No songs in this playlist", "info");
    }
  };

  useEffect(() => {
    if (id) {
      getPlaylistData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl mb-6">
          🎵
        </div>
        <p className="text-xl text-gray-900 dark:text-gray-100 mb-4">Playlist not found</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Playlist Header */}
      <div className="flex gap-6 items-end mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center">
          <span className="text-white text-6xl">♫</span>
        </div>
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">PLAYLIST</p>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">{playlist.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {playlist.description || "Your personalized playlist"}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {playlist.songs?.length || 0} {playlist.songs?.length === 1 ? 'song' : 'songs'}
          </p>
          
          {/* Playlist Actions */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handlePlayPlaylist}
              disabled={!playlist.songs || playlist.songs.length === 0}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                playlist.songs?.length > 0 
                  ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 hover:shadow-lg' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {playlist.songs?.length > 0 ? 'Play' : 'No Songs'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              Delete Playlist
            </button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        {!playlist.songs || playlist.songs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🎵
            </div>
            <p className="text-gray-900 dark:text-gray-100 text-lg mb-4">This playlist is empty</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add songs from the home page to get started</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Browse Songs
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-4 p-3 text-gray-600 dark:text-gray-400 text-sm font-medium border-b border-gray-300 dark:border-gray-700 pb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-4">Album</div>
              <div className="col-span-1 text-center">Duration</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
            
            {playlist.songs.map((song, index) => (
              <div
                key={song._id}
                className="grid grid-cols-12 gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group items-center"
              >
                <div className="col-span-1 text-center text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  {index + 1}
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <img 
                    src={song.image} 
                    alt={song.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-900 dark:text-gray-100 font-medium truncate">{song.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{song.desc}</p>
                  </div>
                </div>
                <div className="col-span-4 text-gray-600 dark:text-gray-400 truncate">
                  {song.album}
                </div>
                <div className="col-span-1 text-center text-gray-600 dark:text-gray-400 text-sm">
                  {song.duration}
                </div>
                <div className="col-span-1 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      playWithId(song._id, playlist.songs);
                      showToast(`Playing: ${song.name}`, "success");
                    }}
                    className="opacity-0 group-hover:opacity-100 bg-green-500 text-white p-2 rounded-full hover:scale-105 transition-all"
                    title="Play song"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowRemoveSong(song._id)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:scale-105 transition-all"
                    title="Remove from playlist"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Delete Playlist</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "<span className="font-bold">{playlist.name}</span>"? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors duration-300"
              >
                Delete Playlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Song Confirmation Modal */}
      {showRemoveSong && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Remove Song</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove this song from the playlist?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRemoveSong(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveSong(showRemoveSong)}
                className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors duration-300"
              >
                Remove Song
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayPlaylist;