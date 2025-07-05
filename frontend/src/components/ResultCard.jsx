import React from "react";
import "./ResultCard.css";

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  // Handle both watch URLs and embed URLs
  const match = url.match(/(?:v=|\/embed\/|\.be\/|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

const ResultCard = ({ data }) => {
  if (!data) return null;

  const {
    title,
    description,
    image,
    poster,
    trailer,
    platforms,
    genres,
    links,
    stores
  } = data;

  // Use poster if image is not available
  const displayImage = image || poster;
  
  // Handle different data structures from different APIs
  const displayLinks = links || stores || [];
  const displayPlatforms = platforms || [];

  // Get YouTube video ID for embedding
  const youtubeVideoId = getYouTubeVideoId(trailer);

  return (
    <div className="result-card">
      <div className="result-image">
        <img
          src={displayImage && displayImage.startsWith("http") ? displayImage : "https://placehold.co/300x450/cccccc/666666?text=No+Image"}
          alt={title}
          onError={(e) => {
            e.target.src = "https://placehold.co/300x450/cccccc/666666?text=No+Image";
          }}
        />
      </div>

      <div className="result-content">
        <h2>{title}</h2>
        <p className="genres">{genres?.join(", ")}</p>
        <p className="description">{description}</p>

        {youtubeVideoId && (
          <div className="trailer">
            <h4>Trailer:</h4>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
              width="100%"
              height="315"
            />
          </div>
        )}

        <div className="platforms">
          {displayPlatforms && displayPlatforms.length > 0 && (
            <>
              <h4>Available On:</h4>
              <ul>
                {displayPlatforms.map((platform, index) => (
                  <li key={index}>
                    {typeof platform === 'object' ? platform.platform : platform}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="links">
          {displayLinks && displayLinks.length > 0 && (
            <>
              <h4>Buy/Stream:</h4>
              <ul>
                {displayLinks.map((link, index) => {
                  // Handle different link formats
                  if (typeof link === 'string') {
                    return (
                      <li key={index}>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          {link}
                        </a>
                      </li>
                    );
                  } else if (typeof link === 'object' && link.link) {
                    return (
                      <li key={index}>
                        <a href={link.link} target="_blank" rel="noopener noreferrer">
                          {link.platform || link.name || link.link}
                        </a>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
