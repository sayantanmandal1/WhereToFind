
# WhereToFind - Full Stack Media Search Application

A full-stack web application that helps users find where to watch movies, play games, or read books legally. The application searches across multiple platforms and provides direct links to streaming services and stores.

## Features

- **Multi-platform Search**: Search for movies, games, and books
- **Streaming Links**: Direct links to Netflix, Prime Video, Apple TV, and more
- **YouTube Trailers**: Embedded YouTube trailers for movies and games
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Search**: Fast search results with loading states

## Tech Stack

### Frontend
- React.js
- CSS3
- Axios for API calls

### Backend
- FastAPI (Python)
- TMDB API for movies and TV shows
- IGDB API for games
- Google Books API for books
- BeautifulSoup for web scraping

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables (optional):
   Create a `.env` file in the backend directory with:
   ```
   TMDB_API_KEY=your_tmdb_api_key_here
   TWITCH_CLIENT_ID=your_twitch_client_id_here
   TWITCH_CLIENT_SECRET=your_twitch_client_secret_here
   ```

6. Start the backend server:
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Keys (Optional)

For full functionality, you can obtain API keys from:

- **TMDB API**: https://www.themoviedb.org/settings/api (for movies and TV shows)
- **Twitch API**: https://dev.twitch.tv/console (for IGDB games database)

Without these keys, the application will still work but with limited functionality.

## Usage

1. Open the application in your browser
2. Select the type of media (Movie or Game)
3. Enter the title you want to search for
4. Click "Search" to find results
5. View streaming platforms, trailers, and purchase links

## Project Structure

```
WhereToFind/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── services/
│       ├── tmdb.py         # Movie/TV show service
│       ├── igdb.py         # Game service
│       └── books.py        # Book service
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── api.js          # API client
│   │   ├── components/     # React components
│   │   └── pages/          # Page components
│   └── package.json        # Node.js dependencies
└── README.md
```

## Deployment

### Backend Deployment
The backend is configured for deployment on Render.com with the provided Dockerfile.

### Frontend Deployment
The frontend can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
