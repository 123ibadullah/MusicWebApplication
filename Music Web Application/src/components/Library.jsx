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
        data = songsData.filter(song => likedSongs.includes(song._id));
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
    { id: "liked", label: "Liked Songs", count: likedSongs.length, icon: "❤️" },
    { id: "recent", label: "Recently Played", count: recentlyPlayed.length, icon: "🕒" },
  ].filter(tab => tab.count > 0);

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
          <div key={item._id || index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            {activeTab === "songs" || activeTab === "liked" || activeTab === "recent" ? (
              <SongItem
                image={item.image}
                name={item.name}
                desc={item.desc}
                id={item._id}
                duration={item.duration}
                album={item.album}
              />
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
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className="bg-white/20 dark:bg-gray-600/20 text-xs px-2 py-1 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
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


