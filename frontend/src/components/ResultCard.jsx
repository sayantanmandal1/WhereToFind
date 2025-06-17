import React from "react";
import "./ResultCard.css";

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:v=|\/embed\/|\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

const ResultCard = ({ data }) => {
  if (!data) return null;

  const {
    title,
    description,
    image,
    trailer,
    platforms,
    genres,
    links
  } = data;

  return (
    <div className="result-card">
      <div className="result-image">
        <img
          src={image && image.startsWith("http") ? image : "https://via.placeholder.com/300x450?text=No+Image"}
          alt={title}
        />
      </div>

      <div className="result-content">
        <h2>{title}</h2>
        <p className="genres">{genres?.join(", ")}</p>
        <p className="description">{description}</p>

        {trailer && (
          <div className="trailer">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(trailer)}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            />
          </div>
        )}

        <div className="platforms">
          {platforms && platforms.length > 0 && (
            <>
              <h4>Available On:</h4>
              <ul>
                {platforms.map((p, index) => (
                  <li key={index}>{p}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="links">
          {links && links.length > 0 && (
            <>
              <h4>Buy/Stream:</h4>
              <ul>
                {links.map((l, index) => (
                  <li key={index}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.name || l.url}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
