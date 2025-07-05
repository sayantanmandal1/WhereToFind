import os
import re
import asyncio
import httpx
from typing import Optional, List
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from rapidfuzz import fuzz
import yt_dlp
from urllib.parse import urljoin, urlparse

load_dotenv()

TWITCH_CLIENT_ID = os.getenv("TWITCH_CLIENT_ID")
TWITCH_CLIENT_SECRET = os.getenv("TWITCH_CLIENT_SECRET")
IGDB_TOKEN_URL = "https://id.twitch.tv/oauth2/token"
IGDB_BASE_URL = "https://api.igdb.com/v4"

access_token: Optional[str] = None


async def get_igdb_token():
    global access_token
    if access_token:
        return access_token

    if not TWITCH_CLIENT_ID or not TWITCH_CLIENT_SECRET:
        return None

    async with httpx.AsyncClient() as client:
        resp = await client.post(IGDB_TOKEN_URL, data={
            "client_id": TWITCH_CLIENT_ID,
            "client_secret": TWITCH_CLIENT_SECRET,
            "grant_type": "client_credentials"
        })
        resp.raise_for_status()
        access_token = resp.json()["access_token"]
        return access_token


async def get_game_data(title: str):
    if not TWITCH_CLIENT_ID or not TWITCH_CLIENT_SECRET:
        return {
            "type": "game",
            "title": title,
            "description": "IGDB API credentials not configured. Please add TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET to your .env file.",
            "image": None,
            "trailer": None,
            "platforms": [],
            "genres": [],
            "links": []
        }

    try:
        token = await get_igdb_token()
        if not token:
            return None
            
        headers = {
            "Client-ID": TWITCH_CLIENT_ID,
            "Authorization": f"Bearer {token}"
        }
        query = f'''
            search "{title}";
            fields name, summary, cover.url, genres.name, platforms.name, videos.video_id, websites.url;
            limit 1;
        '''
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(f"{IGDB_BASE_URL}/games", data=query, headers=headers)
            resp.raise_for_status()
            results = resp.json()
            if not results:
                return None

            game = results[0]
            game_title = game.get("name", title)

            # Simplified store links without web scraping for speed
            links = generate_store_links(game_title)
            
            # Get trailer (simplified)
            trailer_link = await fetch_best_youtube_trailer(game_title)

            return {
                "type": "game",
                "title": game.get("name"),
                "description": game.get("summary") or "No description available.",
                "image": f"https:{game['cover']['url']}" if game.get("cover") else None,
                "platforms": [p["name"] for p in game.get("platforms", [])],
                "genres": [g["name"] for g in game.get("genres", [])],
                "links": links,
                "trailer": trailer_link,
            }
    except Exception as e:
        print(f"Error fetching game data: {e}")
        return {
            "type": "game",
            "title": title,
            "description": f"Error fetching game data: {str(e)}",
            "image": None,
            "trailer": None,
            "platforms": [],
            "genres": [],
            "links": []
        }


def generate_store_links(game_title: str) -> List[dict]:
    """Generate store links without web scraping for better performance"""
    encoded = game_title.replace(" ", "+")
    return [
        {"platform": "Steam", "link": f"https://store.steampowered.com/search/?term={encoded}"},
        {"platform": "Epic Games", "link": f"https://www.epicgames.com/store/en-US/browse?q={encoded}"},
        {"platform": "GOG", "link": f"https://www.gog.com/en/games?search={encoded}"},
        {"platform": "Microsoft Store", "link": f"https://www.microsoft.com/en-us/search/shop/games?q={encoded}"},
        {"platform": "PlayStation Store", "link": f"https://store.playstation.com/en-us/search/{encoded}"},
    ]


async def fetch_best_youtube_trailer(title: str) -> Optional[str]:
    search_url = f"https://www.youtube.com/results?search_query={title.replace(' ', '+')}+official+trailer"
    async with httpx.AsyncClient(timeout=3.0) as client:
        try:
            response = await client.get(search_url)
            matches = re.findall(r"watch\?v=(\S{11})", response.text)
            if matches:
                video_id = matches[0]
                return f"https://www.youtube.com/watch?v={video_id}"
        except Exception:
            return None
    return None
