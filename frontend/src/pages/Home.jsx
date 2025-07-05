import React, { useState } from "react";
import { searchMedia } from "../api";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";
import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await searchMedia(query, type);
      // Handle the response structure from the backend
      if (response && response.success && response.data) {
        setResult(response.data);
      } else {
        setError("No results found. Try a different search term.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError(error.message || "An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="hero">
        <h1>WhereToFind</h1>
        <p>Search your favorite movies, games, or books and discover where to watch or buy them legally.</p>
      </header>

      <SearchBar
        query={query}
        setQuery={setQuery}
        type={type}
        setType={setType}
        onSearch={handleSearch}
      />

      <main className="results">
        {loading && <p className="loading">Searching...</p>}
        {error && <p className="error">{error}</p>}
        {result ? <ResultCard data={result} /> : !loading && !error && <p className="placeholder">Enter a title to get started.</p>}
      </main>
    </div>
  );
};

export default Home;