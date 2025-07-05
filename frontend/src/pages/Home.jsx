import React, { useState, useEffect } from "react";
import { searchMedia } from "../api";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";
import "./Home.css";

const Home = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState(null);

  // Handle URL-based search on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const type = urlParams.get('type') || 'movie';
    const year = urlParams.get('year');
    const genre = urlParams.get('genre');
    const rating = urlParams.get('rating');
    const platform = urlParams.get('platform');

    if (query) {
      const filters = { year, genre, rating, platform };
      setSearchParams({ query, type, filters });
      handleSearch(query, type, filters);
    }
  }, []);

  const handleSearch = async (query, type, filters = {}) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Update URL with search parameters
      const searchParams = new URLSearchParams();
      searchParams.set('q', query.trim());
      searchParams.set('type', type);
      if (filters.year) searchParams.set('year', filters.year);
      if (filters.genre) searchParams.set('genre', filters.genre);
      if (filters.rating) searchParams.set('rating', filters.rating);
      if (filters.platform) searchParams.set('platform', filters.platform);
      
      window.history.pushState({}, '', `?${searchParams.toString()}`);
      
      const response = await searchMedia(query, type, filters);
      
      // Handle the response structure from the backend
      if (response && response.success && response.data) {
        setResult(response.data);
      } else {
        setError("No results found. Try a different search term or adjust your filters.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError(error.message || "An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setResult(null);
    setError(null);
    setSearchParams(null);
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="home-container">
      <header className="hero">
        <h1>WhereToFind</h1>
        <p>Search your favorite movies, games, or books and discover where to watch or buy them legally.</p>
        
        {/* Search Stats */}
        <div className="search-stats">
          <div className="stat-item">
            <span className="stat-number">10M+</span>
            <span className="stat-label">Movies</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Games</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100M+</span>
            <span className="stat-label">Books</span>
          </div>
        </div>
      </header>

      <SearchBar
        onSearch={handleSearch}
        loading={loading}
      />

      <main className="results">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading">Searching...</p>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error">{error}</p>
            <button onClick={handleClearSearch} className="clear-search-btn">
              Clear Search
            </button>
          </div>
        )}
        
        {result ? (
          <div className="result-wrapper">
            <div className="result-header">
              <h2>Search Results</h2>
              <button onClick={handleClearSearch} className="new-search-btn">
                New Search
              </button>
            </div>
            <ResultCard data={result} />
          </div>
        ) : !loading && !error && (
          <div className="placeholder-container">
            <div className="placeholder-icon">🔍</div>
            <p className="placeholder">Enter a title to get started</p>
            <p className="placeholder-subtitle">Try searching for "Inception", "Minecraft", or "Harry Potter"</p>
            
            {/* Popular Searches */}
            <div className="popular-searches">
              <h3>Popular Searches</h3>
              <div className="popular-tags">
                <button onClick={() => handleSearch("Inception", "movie")} className="popular-tag">
                  🎬 Inception
                </button>
                <button onClick={() => handleSearch("The Witcher 3", "game")} className="popular-tag">
                  🎮 The Witcher 3
                </button>
                <button onClick={() => handleSearch("Harry Potter", "book")} className="popular-tag">
                  📚 Harry Potter
                </button>
                <button onClick={() => handleSearch("Breaking Bad", "movie")} className="popular-tag">
                  🎬 Breaking Bad
                </button>
                <button onClick={() => handleSearch("Red Dead Redemption 2", "game")} className="popular-tag">
                  🎮 RDR2
                </button>
                <button onClick={() => handleSearch("The Lord of the Rings", "book")} className="popular-tag">
                  📚 LOTR
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;