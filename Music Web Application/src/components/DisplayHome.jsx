// components/DisplayHome.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import PlaylistItem from "./PlaylistItem";
import SkeletonLoader from "./SkeletonLoader";
import { usePlayer } from "../context/PlayerContext";
import { useToast } from "../context/ThemeContext";

const DisplayHome = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { 
    songsData, 
    albumsData, 
    playlists, 
    searchQuery, 
    searchResults, 
    likedSongs, 
    recentlyPlayed 
  } = usePlayer();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [sectionPages, setSectionPages] = useState({
    recentlyPlayed: 0,
    likedSongs: 0,
    playlists: 0,
    featuredCharts: 0,
    biggestHits: 0
  });

  const ITEMS_PER_PAGE = 8;

  // Format last played date
  const formatLastPlayed = (dateString) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";
    
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Memoized filtered data
  const likedSongsData = useMemo(() => 
    songsData.filter(song => likedSongs.includes(song._id)),
    [songsData, likedSongs]
  );

  // Data availability checks
  const hasData = {
    recentlyPlayed: recentlyPlayed.length > 0,
    likedSongs: likedSongs.length > 0,
    playlists: playlists.length > 0,
    featuredCharts: albumsData.length > 0,
    biggestHits: songsData.length > 0,
    searchResults: searchResults.songs.length > 0 || searchResults.albums.length > 0 || searchResults.playlists.length > 0
  };

  // Pagination functions
  const getPaginatedData = (data, section) => {
    const startIndex = sectionPages[section] * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const hasNextPage = (data, section) => {
    return (sectionPages[section] + 1) * ITEMS_PER_PAGE < data.length;
  };

  const hasPreviousPage = (section) => {
    return sectionPages[section] > 0;
  };

  const handleNextPage = (section, data) => {
    if (hasNextPage(data, section)) {
      setSectionPages(prev => ({
        ...prev,
        [section]: prev[section] + 1
      }));
    }
  };

  const handlePreviousPage = (section) => {
    if (hasPreviousPage(section)) {
      setSectionPages(prev => ({
        ...prev,
        [section]: prev[section] - 1
      }));
    }
  };

  // Section Header Component with Navigation
  const SectionHeader = ({ 
    title, 
    data = [], 
    section, 
    onSeeAll,
    showSeeAll = true,
    showNavigation = false 
  }) => (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        {data.length > 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {data.length} {data.length === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Navigation Buttons - Only show if there are multiple pages */}
        {showNavigation && data.length > ITEMS_PER_PAGE && (
          <div className="flex items-center space-x-2 mr-4">
            <button
              onClick={() => handlePreviousPage(section)}
              disabled={!hasPreviousPage(section)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
              title="Previous page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleNextPage(section, data)}
              disabled={!hasNextPage(data, section)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
              title="Next page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* See All Button - Only show if there are more items than displayed */}
        {showSeeAll && data.length > ITEMS_PER_PAGE && (
          <button 
            onClick={onSeeAll}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 px-4 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            See all ({data.length})
          </button>
        )}
      </div>
    </div>
  );

  // Empty State Component
  const EmptyState = ({ 
    title = "No items available", 
    description = "Check back later for new content",
    icon = "🎵",
    action 
  }) => (
    <div className="text-center py-12 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{description}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );

  // Search Results View
  if (searchQuery) {
    return (
      <div className="space-y-12 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Search results for "{searchQuery}"
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {hasData.searchResults 
                ? `Found ${searchResults.songs.length + searchResults.albums.length + searchResults.playlists.length} results`
                : 'No results found'
              }
            </p>
          </div>
        </div>
        
        {/* Songs Results - Only show if there are songs */}
        {searchResults.songs.length > 0 && (
          <section>
            <SectionHeader 
              title="Songs" 
              data={searchResults.songs}
              showSeeAll={false}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {searchResults.songs.map((song) => (
                <SongItem
                  key={song._id}
                  image={song.image}
                  name={song.name}
                  desc={song.desc}
                  id={song._id}
                  duration={song.duration}
                  album={song.album}
                />
              ))}
            </div>
          </section>
        )}

        {/* Albums Results - Only show if there are albums */}
        {searchResults.albums.length > 0 && (
          <section>
            <SectionHeader 
              title="Albums" 
              data={searchResults.albums}
              showSeeAll={false}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {searchResults.albums.map((album) => (
                <AlbumItem
                  key={album._id}
                  image={album.image}
                  name={album.name}
                  desc={album.desc}
                  id={album._id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Playlists Results - Only show if there are playlists */}
        {searchResults.playlists.length > 0 && (
          <section>
            <SectionHeader 
              title="Playlists" 
              data={searchResults.playlists}
              showSeeAll={false}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {searchResults.playlists.map((playlist) => (
                <PlaylistItem
                  key={playlist._id}
                  id={playlist._id}
                  name={playlist.name}
                  songCount={playlist.songs?.length || 0}
                />
              ))}
            </div>
          </section>
        )}

        {/* No Results State - Only show if no results */}
        {!hasData.searchResults && (
          <EmptyState
            title="No results found"
            description={`We couldn't find any matches for "${searchQuery}". Try searching with different keywords.`}
            icon="🔍"
            action={
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors duration-300"
              >
                Go Back
              </button>
            }
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section - Always Visible */}
      <section className="relative glass-card-premium rounded-3xl p-8 sm:p-12 text-white overflow-hidden animate-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient-premium">Welcome to MusicFlow</h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
            {songsData.length > 0 
              ? `Discover ${songsData.length} songs across ${albumsData.length} albums`
              : 'Start adding music to your library'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => songsData.length > 0 
                ? showToast('Starting your music journey!', 'success')
                : showToast('No songs available yet', 'info')
              }
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                songsData.length > 0
                  ? 'glass-button-premium text-white hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={songsData.length === 0}
            >
              {songsData.length > 0 ? 'Start Listening' : 'No Songs Available'}
            </button>
            <button 
              onClick={() => showToast('Premium features coming soon!', 'info')}
              className="glass-button-premium text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition-all duration-300"
            >
              Explore Premium
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent" />
      </section>

      {/* Recently Played Section - Only show if there's data */}
      {hasData.recentlyPlayed && (
        <section className="animate-slide-up">
          <SectionHeader 
            title="Recently Played" 
            data={recentlyPlayed}
            section="recentlyPlayed"
            showNavigation={true}
            onSeeAll={() => navigate('/recent')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {getPaginatedData(recentlyPlayed, 'recentlyPlayed').map((song) => (
              <div key={song._id} className="relative">
                <SongItem
                  image={song.image}
                  name={song.name}
                  desc={song.desc}
                  id={song._id}
                  duration={song.duration}
                  album={song.album}
                />
                {/* Last Played Badge */}
                <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  {formatLastPlayed(song.playedAt)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Access Grid - Always show but conditionally enable */}
      <section className="animate-slide-up">
        <SectionHeader title="Quick Access" showSeeAll={false} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Liked Songs Card */}
          <div 
            className={`glass-card-premium rounded-3xl p-8 text-white cursor-pointer transition-all duration-500 group hover-glow-premium ${
              hasData.likedSongs
                ? 'hover:scale-105 hover:-translate-y-2'
                : 'opacity-60 cursor-not-allowed'
            }`}
            onClick={() => hasData.likedSongs 
              ? navigate('/liked')
              : showToast('No liked songs yet', 'info')
            }
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 opacity-90 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="font-bold text-xl mb-2">Liked Songs</h3>
              <p className="text-green-100 text-sm">
                {hasData.likedSongs ? `${likedSongs.length} songs` : 'Like songs to see them here'}
              </p>
            </div>
          </div>

          {/* Playlists Card */}
          <div 
            className={`glass-card-premium rounded-3xl p-8 text-white cursor-pointer transition-all duration-500 group hover-glow-premium ${
              hasData.playlists
                ? 'hover:scale-105 hover:-translate-y-2'
                : 'opacity-60 cursor-not-allowed'
            }`}
            onClick={() => hasData.playlists 
              ? navigate('/playlists')
              : showToast('Create your first playlist', 'info')
            }
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-90 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="font-bold text-xl mb-2">Your Playlists</h3>
              <p className="text-purple-100 text-sm">
                {hasData.playlists ? `${playlists.length} playlists` : 'Create your first playlist'}
              </p>
            </div>
          </div>

          {/* Albums Card */}
          <div 
            className={`glass-card-premium rounded-3xl p-8 text-white cursor-pointer transition-all duration-500 group hover-glow-premium ${
              hasData.featuredCharts
                ? 'hover:scale-105 hover:-translate-y-2'
                : 'opacity-60 cursor-not-allowed'
            }`}
            onClick={() => hasData.featuredCharts 
              ? navigate('/albums')
              : showToast('No albums available', 'info')
            }
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-90 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">💿</div>
              <h3 className="font-bold text-xl mb-2">Albums</h3>
              <p className="text-orange-100 text-sm">
                {hasData.featuredCharts ? `${albumsData.length} albums` : 'No albums available'}
              </p>
            </div>
          </div>

          {/* All Songs Card */}
          <div 
            className={`glass-card-premium rounded-3xl p-8 text-white cursor-pointer transition-all duration-500 group hover-glow-premium ${
              hasData.biggestHits
                ? 'hover:scale-105 hover:-translate-y-2'
                : 'opacity-60 cursor-not-allowed'
            }`}
            onClick={() => hasData.biggestHits 
              ? navigate('/songs')
              : showToast('No songs available', 'info')
            }
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-90 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">🎧</div>
              <h3 className="font-bold text-xl mb-2">All Songs</h3>
              <p className="text-blue-100 text-sm">
                {hasData.biggestHits ? `${songsData.length} songs` : 'Add songs to get started'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Charts - Only show if there are albums */}
      {hasData.featuredCharts && (
        <section className="animate-slide-up">
          <SectionHeader 
            title="Featured Charts" 
            data={albumsData}
            section="featuredCharts"
            showNavigation={true}
            onSeeAll={() => navigate('/albums')}
          />
          {isLoading ? (
            <SkeletonLoader type="card" count={8} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {getPaginatedData(albumsData, 'featuredCharts').map((item, index) => (
                <AlbumItem
                  key={item._id || index}
                  image={item.image}
                  name={item.name}
                  desc={item.desc}
                  id={item._id}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Today's Biggest Hits - Only show if there are songs */}
      {hasData.biggestHits && (
        <section className="animate-slide-up">
          <SectionHeader 
            title="Today's Biggest Hits" 
            data={songsData}
            section="biggestHits"
            showNavigation={true}
            onSeeAll={() => navigate('/songs')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {getPaginatedData(songsData, 'biggestHits').map((item, index) => (
              <SongItem
                key={item._id || index}
                image={item.image}
                name={item.name}
                desc={item.desc}
                id={item._id}
                duration={item.duration}
                album={item.album}
              />
            ))}
          </div>
        </section>
      )}

      {/* Your Playlists - Only show if there are playlists */}
      {hasData.playlists && (
        <section className="animate-slide-up">
          <SectionHeader 
            title="Your Playlists" 
            data={playlists}
            section="playlists"
            showNavigation={true}
            onSeeAll={() => navigate('/playlists')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {getPaginatedData(playlists, 'playlists').map((playlist) => (
              <PlaylistItem
                key={playlist._id}
                id={playlist._id}
                name={playlist.name}
                songCount={playlist.songs?.length || 0}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DisplayHome;