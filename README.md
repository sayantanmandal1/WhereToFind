
# WhereToFind 🎮📚🎬

WhereToFind is a full-stack web application that helps users find **where to watch, buy, or stream** their favorite **games, movies, or books** — all through legal platforms.  
This version primarily focuses on **video game discovery** using data from **IGDB (via Twitch API)** and YouTube for trailers.

---

## 🌐 Live Preview

[Click here](https://wheretofind.vercel.app/)

---

## 📦 Features

- 🔎 Search any game title.
- 🧠 Retrieves metadata (summary, genres, platforms).
- 🖼️ Displays official game covers.
- 🎥 Embeds the best YouTube trailer.
- 🛍️ Crawls multiple stores to find where to buy or download.
- 💡 Clean and responsive UI.

---

## 🖥️ Tech Stack

### Frontend
- React (with functional components)
- CSS Modules

### Backend
- Python 3.10+
- FastAPI or Flask (compatible)
- IGDB API (via Twitch)
- YouTube scraping with `httpx` and `BeautifulSoup`
- Store link scraping from major platforms

---

## 📁 Project Structure

```
/frontend
  /components
    SearchBar.jsx
    ResultCard.jsx
  /pages
    Home.jsx
  /api.js
  /App.jsx
  /index.js

/backend
  main.py
  utils.py
  .env
  requirements.txt

README.md
```

---

## 🧪 Prerequisites

- Node.js (v18+)
- Python 3.10+
- Twitch account with dev credentials
- Git

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/wheretofind.git
cd wheretofind
```

---

### 2. Backend Setup

#### 📁 Navigate to backend:

```bash
cd backend
```

#### 📦 Create virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 📄 Create a `.env` file:

```
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
```

You can obtain these from [Twitch Developer Console](https://dev.twitch.tv/console/apps).

---

### 3. Start the Backend Server

Using FastAPI:

```bash
uvicorn main:app --reload
```

It should be running at `http://127.0.0.1:8000`.

---

### 4. Frontend Setup

#### 📁 Navigate to frontend:

```bash
cd ../frontend
```

#### Install dependencies:

```bash
npm install
```

#### Start React app:

```bash
npm start
```

It runs by default on `http://localhost:3000`.

---

## 🔗 Supported Store Platforms

- Steam
- Epic Games
- Ubisoft Store
- GOG
- Microsoft Store
- PlayStation Store
- Humble Bundle

---

## 🔒 Environment Variables

### Backend `.env`

```env
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
```

---

## 📤 API Endpoint

### `GET /search?query=your_game&type=game`

Returns:

```json
{
  "type": "game",
  "title": "Cyberpunk 2077",
  "description": "Futuristic open-world RPG...",
  "image": "https://cdn.igdb.com/...",
  "trailer": "https://www.youtube.com/embed/abc123",
  "platforms": ["PC", "Xbox One"],
  "genres": ["RPG", "Action"],
  "stores": ["https://store.steampowered.com/app/1091500/"]
}
```

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/f0ca43fa-555f-4673-af0f-b19a76f64dc4)

---

## 🐞 Troubleshooting

- **No results:** Ensure your Twitch credentials are correct.
- **Images not loading:** Check if the `image` field is mapped correctly in frontend.
- **YouTube trailer not showing:** Some browsers/extensions block embedded content. Try disabling ad blockers.

---

## 📃 License

MIT License. Use freely with attribution.

---

## 🤝 Contributing

PRs welcome! Please fork the repo and submit a pull request for review.

---

## 📬 Contact

Created by **Sayantan**  
Email: [msayantan05@gmail.com](mailto:msayantan05@gmail.com)

---

Happy Searching 🎮🎬📚
