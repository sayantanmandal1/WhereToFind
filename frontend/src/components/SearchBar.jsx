import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('movie');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), type);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="search-container">
      <div className="keyboard-shortcut">⌘↵</div>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search for movies, games, or books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
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
    </div>
  );
};

export default SearchBar;
