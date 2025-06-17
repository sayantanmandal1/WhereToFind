import React from "react";
import "./SearchBar.css";

const SearchBar = ({ query, setQuery, type, setType, onSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a movie, game, or book..."
        className="search-input"
      />

      <select
        className="type-selector"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="auto">Auto</option>
        <option value="movie">Movie</option>
        <option value="game">Game</option>
        <option value="book">Book</option>
      </select>

      <button onClick={onSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
