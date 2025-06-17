import React, { useState } from "react";
import { searchMedia } from "../api";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";
import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("auto");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const data = await searchMedia(query, type);
    setResult(data || null);
    setLoading(false);
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
        {loading && <p>Loading...</p>}
        {result ? <ResultCard data={result} /> : <p className="placeholder">Enter a title to get started.</p>}
      </main>
    </div>
  );
};

export default Home;