import React from 'react';
import './App.css';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Home />
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>WhereToFind</h3>
            <p>Your ultimate guide to discovering where to watch, play, or read your favorite media legally.</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>🎬 Movie streaming platforms</li>
              <li>🎮 Game store availability</li>
              <li>📚 Book retailer links</li>
              <li>✅ Verified availability</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Data Sources</h4>
            <ul>
              <li>TMDB for movies</li>
              <li>IGDB for games</li>
              <li>Google Books API</li>
              <li>JustWatch integration</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>DMCA</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 WhereToFind. All rights reserved. Made with ❤️ for media enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
