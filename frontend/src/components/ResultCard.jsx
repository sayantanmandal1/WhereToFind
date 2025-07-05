import React, { useState } from "react";
import "./ResultCard.css";

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  // Handle both watch URLs and embed URLs
  const match = url.match(/(?:v=|\/embed\/|\.be\/|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

const ResultCard = ({ data }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!data) return null;

  const {
    title,
    description,
    image,
    poster,
    backdrop,
    trailer,
    platforms,
    genres,
    links,
    stores
  } = data;

  // Create array of image options with fallbacks
  const imageOptions = [
    image,
    poster,
    backdrop,
    `https://via.placeholder.com/300x450/cccccc/666666?text=${encodeURIComponent(title || 'No Image')}`,
    `https://placehold.co/300x450/cccccc/666666?text=${encodeURIComponent(title || 'No Image')}`
  ].filter(Boolean);

  const currentImage = imageOptions[currentImageIndex];
  
  // Handle different data structures from different APIs
  const displayLinks = links || stores || [];
  const displayPlatforms = platforms || [];

  // Determine if this is a mobile game
  const isMobileGame = displayPlatforms.some(platform => 
    typeof platform === 'string' ? 
      platform.toLowerCase().includes('android') || platform.toLowerCase().includes('ios') :
      platform.platform?.toLowerCase().includes('android') || platform.platform?.toLowerCase().includes('ios')
  );

  // Get YouTube video ID for embedding
  const youtubeVideoId = getYouTubeVideoId(trailer);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
    
    // Try next image in fallback chain
    if (currentImageIndex < imageOptions.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setImageError(false);
    }
  };

  return (
    <div className="result-card">
      <div className="result-image">
        {!imageLoaded && !imageError && (
          <div className="skeleton" style={{ width: '100%', height: '450px', borderRadius: '12px' }} />
        )}
        <img
          src={currentImage}
          alt={title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
        {imageError && currentImageIndex >= imageOptions.length - 1 && (
          <div style={{ 
            width: '100%', 
            height: '450px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#f1f5f9',
            color: '#64748b',
            fontSize: '1.1rem',
            borderRadius: '12px'
          }}>
            🖼️ Image not available
          </div>
        )}
      </div>

      <div className="result-content">
        <div className="result-header">
          <h2 className="result-title">{title}</h2>
          {genres && genres.length > 0 && (
            <div className="genres">
              {genres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        {description && (
          <p className="description">{description}</p>
        )}

        {youtubeVideoId && (
          <div className="trailer">
            <h4>Official Trailer</h4>
            <div className="trailer-container">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Trailer"
              />
            </div>
          </div>
        )}

        {displayPlatforms && displayPlatforms.length > 0 && (
          <div className="platforms">
            <h4>Available On</h4>
            <ul>
              {displayPlatforms.map((platform, index) => (
                <li key={index}>
                  <span className="platform-tag">
                    {typeof platform === 'object' ? platform.platform : platform}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {displayLinks && displayLinks.length > 0 && (
          <div className="links">
            <h4>{isMobileGame ? 'Download On' : 'Where to Buy/Stream'}</h4>
            <ul>
              {displayLinks.map((link, index) => {
                // Handle different link formats
                if (typeof link === 'string') {
                  return (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="store-link">
                        View on Store
                      </a>
                    </li>
                  );
                } else if (typeof link === 'object' && link.link) {
                  const isVerified = link.verified === true;
                  return (
                    <li key={index}>
                      <a 
                        href={link.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`store-link ${isVerified ? 'verified' : 'unverified'}`}
                        title={isVerified ? 'Verified availability' : 'Search results only'}
                      >
                        {link.platform || link.name || 'View on Store'}
                        {isVerified && <span className="verified-badge">✓</span>}
                      </a>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
