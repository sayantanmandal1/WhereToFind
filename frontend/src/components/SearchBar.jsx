import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('movie');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const [filters, setFilters] = useState({
    year: '',
    genre: '',
    rating: '',
    platform: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        fetchSuggestions(query, type);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, type]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
            handleSuggestionClick(suggestions[selectedSuggestion]);
          } else {
            handleSubmit(e);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedSuggestion(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestions, selectedSuggestion]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery, searchType) => {
    try {
      // Simulate API call for suggestions (replace with actual API)
      const mockSuggestions = generateMockSuggestions(searchQuery, searchType);
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
      setSelectedSuggestion(-1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const generateMockSuggestions = (query, type) => {
    const suggestions = [];
    const queryLower = query.toLowerCase();
    
    // Movie suggestions
    if (type === 'movie') {
      const movies = [
        { title: 'Inception', year: 2010, image: 'https://image.tmdb.org/t/p/w92/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', rating: 8.8 },
        { title: 'The Dark Knight', year: 2008, image: 'https://image.tmdb.org/t/p/w92/qJ2tW6WMUDux911r6m7haRef0WH.jpg', rating: 9.0 },
        { title: 'Interstellar', year: 2014, image: 'https://image.tmdb.org/t/p/w92/nCbkOyOMTEwlEV0LtCOvCnwEONA.jpg', rating: 8.6 },
        { title: 'The Matrix', year: 1999, image: 'https://image.tmdb.org/t/p/w92/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', rating: 8.7 },
        { title: 'Pulp Fiction', year: 1994, image: 'https://image.tmdb.org/t/p/w92/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', rating: 8.9 }
      ];
      
      movies.forEach(movie => {
        if (movie.title.toLowerCase().includes(queryLower)) {
          suggestions.push({
            ...movie,
            type: 'movie',
            id: movie.title.toLowerCase().replace(/\s+/g, '-')
          });
        }
      });
    }
    
    // Game suggestions
    if (type === 'game') {
      const games = [
        { title: 'The Witcher 3', year: 2015, image: 'https://images.igdb.com/igdb/image/upload/t_cover_small/co1r7f.jpg', rating: 9.3 },
        { title: 'Red Dead Redemption 2', year: 2018, image: 'https://images.igdb.com/igdb/image/upload/t_cover_small/co1r7f.jpg', rating: 9.7 },
        { title: 'God of War', year: 2018, image: 'https://images.igdb.com/igdb/image/upload/t_cover_small/co1r7f.jpg', rating: 9.4 },
        { title: 'Minecraft', year: 2011, image: 'https://images.igdb.com/igdb/image/upload/t_cover_small/co1r7f.jpg', rating: 8.9 },
        { title: 'Grand Theft Auto V', year: 2013, image: 'https://images.igdb.com/igdb/image/upload/t_cover_small/co1r7f.jpg', rating: 9.2 }
      ];
      
      games.forEach(game => {
        if (game.title.toLowerCase().includes(queryLower)) {
          suggestions.push({
            ...game,
            type: 'game',
            id: game.title.toLowerCase().replace(/\s+/g, '-')
          });
        }
      });
    }
    
    // Book suggestions
    if (type === 'book') {
      const books = [
        { title: 'The Lord of the Rings', year: 1954, image: 'https://books.google.com/books/content?id=Pq4EAAAAMBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', rating: 4.5 },
        { title: 'Harry Potter', year: 1997, image: 'https://books.google.com/books/content?id=Pq4EAAAAMBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', rating: 4.6 },
        { title: 'The Hobbit', year: 1937, image: 'https://books.google.com/books/content?id=Pq4EAAAAMBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', rating: 4.4 },
        { title: '1984', year: 1949, image: 'https://books.google.com/books/content?id=Pq4EAAAAMBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', rating: 4.3 },
        { title: 'To Kill a Mockingbird', year: 1960, image: 'https://books.google.com/books/content?id=Pq4EAAAAMBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', rating: 4.2 }
      ];
      
      books.forEach(book => {
        if (book.title.toLowerCase().includes(queryLower)) {
          suggestions.push({
            ...book,
            type: 'book',
            id: book.title.toLowerCase().replace(/\s+/g, '-')
          });
        }
      });
    }
    
    return suggestions.slice(0, 8); // Limit to 8 suggestions
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    
    // Add to search history
    const newHistory = [
      { query: suggestion.title, type: suggestion.type, timestamp: Date.now() },
      ...searchHistory.filter(item => item.query !== suggestion.title)
    ].slice(0, 10); // Keep only last 10 searches
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    // Perform search
    onSearch(suggestion.title, suggestion.type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Add to search history
      const newHistory = [
        { query: query.trim(), type, timestamp: Date.now() },
        ...searchHistory.filter(item => item.query !== query.trim())
      ].slice(0, 10);
      
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // Update URL with search parameters
      const searchParams = new URLSearchParams();
      searchParams.set('q', query.trim());
      searchParams.set('type', type);
      if (filters.year) searchParams.set('year', filters.year);
      if (filters.genre) searchParams.set('genre', filters.genre);
      if (filters.rating) searchParams.set('rating', filters.rating);
      if (filters.platform) searchParams.set('platform', filters.platform);
      
      window.history.pushState({}, '', `?${searchParams.toString()}`);
      
      onSearch(query.trim(), type, filters);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="search-container">
      <div className="keyboard-shortcut">⌘↵</div>
      
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper" ref={suggestionsRef}>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search for movies, games, or books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            disabled={loading}
          />
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
            <div className="suggestions-dropdown">
              {/* Recent Searches */}
              {searchHistory.length > 0 && suggestions.length === 0 && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <span>Recent Searches</span>
                    <button 
                      type="button" 
                      className="clear-history-btn"
                      onClick={clearSearchHistory}
                    >
                      Clear
                    </button>
                  </div>
                  {searchHistory.map((item, index) => (
                    <div
                      key={index}
                      className={`suggestion-item ${selectedSuggestion === index ? 'selected' : ''}`}
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <span className="suggestion-icon">
                        {item.type === 'movie' ? '🎬' : item.type === 'game' ? '🎮' : '📚'}
                      </span>
                      <span className="suggestion-text">{item.query}</span>
                      <span className="suggestion-type">{item.type}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <span>Suggestions</span>
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      className={`suggestion-item ${selectedSuggestion === index ? 'selected' : ''}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <img 
                        src={suggestion.image} 
                        alt={suggestion.title}
                        className="suggestion-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="suggestion-content">
                        <span className="suggestion-title">{suggestion.title}</span>
                        <span className="suggestion-meta">
                          {suggestion.year} • ⭐ {suggestion.rating}
                        </span>
                      </div>
                      <span className="suggestion-type">
                        {suggestion.type === 'movie' ? '🎬' : suggestion.type === 'game' ? '🎮' : '📚'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="search-type-wrapper">
          <select
            className="search-type-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={loading}
          >
            <option value="movie">🎬 Movie</option>
            <option value="game">🎮 Game</option>
            <option value="book">📚 Book</option>
          </select>
        </div>
        
        <button
          type="button"
          className="filter-button"
          onClick={() => setShowFilters(!showFilters)}
          disabled={loading}
        >
          🔍 Filters
        </button>
        
        <button
          type="submit"
          className={`search-button ${loading ? 'loading' : ''}`}
          disabled={loading || !query.trim()}
        >
          {loading ? '' : (
            <>
              🔍 Search
            </>
          )}
        </button>
      </form>
      
      {/* Advanced Filters */}
      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Year</label>
              <select 
                value={filters.year} 
                onChange={(e) => setFilters({...filters, year: e.target.value})}
              >
                <option value="">Any Year</option>
                {Array.from({length: 30}, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Genre</label>
              <select 
                value={filters.genre} 
                onChange={(e) => setFilters({...filters, genre: e.target.value})}
              >
                <option value="">Any Genre</option>
                {type === 'movie' && ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller'].map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
                {type === 'game' && ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing'].map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
                {type === 'book' && ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy'].map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Min Rating</label>
              <select 
                value={filters.rating} 
                onChange={(e) => setFilters({...filters, rating: e.target.value})}
              >
                <option value="">Any Rating</option>
                {[9, 8, 7, 6, 5].map(rating => (
                  <option key={rating} value={rating}>{rating}+ Stars</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Platform</label>
              <select 
                value={filters.platform} 
                onChange={(e) => setFilters({...filters, platform: e.target.value})}
              >
                <option value="">Any Platform</option>
                {type === 'game' && ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'].map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
                {type === 'movie' && ['Netflix', 'Amazon Prime', 'Disney+', 'Hulu', 'HBO Max'].map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
