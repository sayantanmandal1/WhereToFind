import React, { useState, useEffect } from 'react';
import './TrendingSection.css';

const TrendingSection = ({ onSearchSelect }) => {
  const [trendingData, setTrendingData] = useState({
    movies: [],
    games: [],
    books: []
  });
  const [activeTab, setActiveTab] = useState('movies');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const fetchTrendingData = async () => {
    setIsLoading(true);
    try {
      // Simulate trending data - in production, this would come from your backend
      const mockTrendingData = {
        movies: [
          { title: 'Inception', searches: 2847, change: '+23%', image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
          { title: 'The Dark Knight', searches: 2156, change: '+15%', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
          { title: 'Interstellar', searches: 1892, change: '+8%', image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
          { title: 'The Matrix', searches: 1654, change: '+12%', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
          { title: 'Pulp Fiction', searches: 1432, change: '+5%', image: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' }
        ],
        games: [
          { title: 'The Witcher 3', searches: 3421, change: '+45%', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg' },
          { title: 'Red Dead Redemption 2', searches: 2987, change: '+32%', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg' },
          { title: 'God of War', searches: 2654, change: '+18%', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg' },
          { title: 'Minecraft', searches: 2341, change: '+7%', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg' },
          { title: 'Grand Theft Auto V', searches: 2187, change: '+11%', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg' }
        ],
        books: [
          { title: 'The Lord of the Rings', searches: 1876, change: '+25%', image: 'https://books.google.com/books/content?id=PJgBAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
          { title: 'Harry Potter', searches: 1654, change: '+19%', image: 'https://books.google.com/books/content?id=5MQFrgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api' },
          { title: 'The Hobbit', searches: 1432, change: '+12%', image: 'https://books.google.com/books/content?id=5MQFrgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api' },
          { title: '1984', searches: 1234, change: '+8%', image: 'https://books.google.com/books/content?id=5MQFrgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api' },
          { title: 'To Kill a Mockingbird', searches: 1098, change: '+6%', image: 'https://books.google.com/books/content?id=5MQFrgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api' }
        ]
      };

      setTrendingData(mockTrendingData);
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item) => {
    onSearchSelect(item.title, activeTab.slice(0, -1)); // Remove 's' from end
  };

  const getTrendingIcon = (change) => {
    const changeValue = parseInt(change.replace('%', ''));
    if (changeValue > 20) return '🔥';
    if (changeValue > 10) return '📈';
    if (changeValue > 0) return '↗️';
    return '➡️';
  };

  if (isLoading) {
    return (
      <div className="trending-section">
        <div className="trending-header">
          <h2>🔥 Trending Now</h2>
          <p>See what everyone is searching for</p>
        </div>
        <div className="trending-loading">
          <div className="loading-spinner"></div>
          <p>Loading trending content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-section">
      <div className="trending-header">
        <h2>🔥 Trending Now</h2>
        <p>See what everyone is searching for</p>
      </div>

      <div className="trending-tabs">
        <button 
          className={`trending-tab ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          🎬 Movies
        </button>
        <button 
          className={`trending-tab ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          🎮 Games
        </button>
        <button 
          className={`trending-tab ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
        >
          📚 Books
        </button>
      </div>

      <div className="trending-content">
        <div className="trending-grid">
          {trendingData[activeTab].map((item, index) => (
            <div 
              key={index} 
              className="trending-item"
              onClick={() => handleItemClick(item)}
            >
              <div className="trending-rank">
                #{index + 1}
              </div>
              <div className="trending-image">
                <img 
                  src={item.image} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x200/475569/ffffff?text=No+Image';
                  }}
                />
              </div>
              <div className="trending-info">
                <h3>{item.title}</h3>
                <div className="trending-stats">
                  <span className="searches">{item.searches.toLocaleString()} searches</span>
                  <span className={`change ${item.change.startsWith('+') ? 'positive' : 'neutral'}`}>
                    {getTrendingIcon(item.change)} {item.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="trending-footer">
        <p>💡 <strong>Pro Tip:</strong> Click any trending item to search for it instantly!</p>
      </div>
    </div>
  );
};

export default TrendingSection; 