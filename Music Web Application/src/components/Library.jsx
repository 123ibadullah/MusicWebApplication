// components/Library.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SongItem from "./SongItem";
import AlbumItem from "./AlbumItem";
import PlaylistItem from "./PlaylistItem";
import SkeletonLoader from "./SkeletonLoader";
import { usePlayer } from "../context/PlayerContext";
import { useToast } from "../context/ThemeContext";

const Library = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { 
    songsData, 
    albumsData, 
    playlists, 
    likedSongs, 
    recentlyPlayed,
    playWithId 
  } = usePlayer();
  
  const [activeTab, setActiveTab] = useState("songs");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort data based on active tab
  const filteredData = useMemo(() => {
    let data = [];
    let filtered = [];

    switch (activeTab) {
      case "songs":
        data = songsData;
        break;
      case "albums":
        data = albumsData;
        break;
      case "playlists":
        data = playlists;
        break;
      case "liked":
        // Handle both cases: likedSongs as IDs or as full objects
        if (likedSongs.length > 0 && typeof likedSongs[0] === 'string') {
          data = songsData.filter(song => likedSongs.includes(song._id));
        } else {
          data = likedSongs.filter(song => song && song._id);
        }
        break;
      case "recent":
        data = recentlyPlayed;
        break;
      default:
        data = songsData;
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = data.filter(item => {
        const name = item?.name || '';
        const desc = item?.desc || '';
        const album = item?.album || '';
        return name.toLowerCase().includes(query) ||
               desc.toLowerCase().includes(query) ||
               album.toLowerCase().includes(query);
      });
    } else {
      filtered = data;
    }

    return filtered;
  }, [activeTab, searchQuery, songsData, albumsData, playlists, likedSongs, recentlyPlayed]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePlayAll = () => {
    if (filteredData.length > 0) {
      if (activeTab === "songs" || activeTab === "liked" || activeTab === "recent") {
        playWithId(filteredData[0]._id, filteredData);
        showToast(`Playing all ${filteredData.length} ${activeTab}`, "success");
      } else {
        showToast(`Cannot play ${activeTab} directly`, "info");
      }
    } else {
      showToast(`No ${activeTab} to play`, "info");
    }
  };

  const tabs = [
    { id: "songs", label: "All Songs", count: songsData.length, icon: "🎧" },
    { id: "albums", label: "Albums", count: albumsData.length, icon: "💿" },
    { id: "playlists", label: "Playlists", count: playlists.length, icon: "🎵" },
    { 
      id: "liked", 
      label: "Liked Songs", 
      count: likedSongs.length > 0 && typeof likedSongs[0] === 'string' 
        ? likedSongs.length 
        : likedSongs.filter(song => song && song._id).length, 
      icon: "❤️" 
    },
    { id: "recent", label: "Recently Played", count: recentlyPlayed.length, icon: "🕒" },
  ].filter(tab => tab.count > 0);

  // Format last played date
  const formatLastPlayed = (dateString) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";
    
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <SkeletonLoader 
          type="card" 
          count={12} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" 
        />
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            {activeTab === "songs" ? "🎧" : activeTab === "albums" ? "💿" : activeTab === "playlists" ? "🎵" : activeTab === "liked" ? "❤️" : "🕒"}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {searchQuery ? `No ${activeTab} found` : `No ${activeTab} yet`}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {searchQuery 
              ? `No ${activeTab} match your search "${searchQuery}"`
              : `Start adding ${activeTab} to see them here`
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Music
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredData.map((item, index) => (
          <div key={item._id || index} className="animate-slide-up relative" style={{ animationDelay: `${index * 0.1}s` }}>
            {activeTab === "songs" || activeTab === "liked" || activeTab === "recent" ? (
              <>
                <SongItem
                  image={item.image}
                  name={item.name}
                  desc={item.desc}
                  id={item._id}
                  duration={item.duration}
                  album={item.album}
                />
                {/* Show date badge only for recently played songs */}
                {activeTab === "recent" && (
                  <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {formatLastPlayed(item.playedAt)}
                  </div>
                )}
              </>
            ) : activeTab === "albums" ? (
              <AlbumItem
                image={item.image}
                name={item.name}
                desc={item.desc}
                id={item._id}
              />
            ) : (
              <PlaylistItem
                id={item._id}
                name={item.name}
                songCount={item.songs?.length || 0}
                image={item.image}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700"
            title="Go back"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Your Library</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {filteredData.length} {filteredData.length === 1 ? 'item' : 'items'} in {tabs.find(t => t.id === activeTab)?.label}
            </p>
          </div>
        </div>

        {(activeTab === "songs" || activeTab === "liked" || activeTab === "recent") && (
          <button
            onClick={handlePlayAll}
            disabled={filteredData.length === 0}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Play All
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="relative">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 transform ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-blue-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl'
              }`}
            >
              <span className={`text-xl transition-transform duration-300 ${
                activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {tab.icon}
              </span>
              <span className="text-sm font-bold tracking-wide">
                {tab.label}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white/25 text-white backdrop-blur-sm'
                  : 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-600 dark:to-gray-500 text-gray-700 dark:text-gray-200'
              }`}>
                {tab.count}
              </span>
              
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full opacity-80"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default Library;


