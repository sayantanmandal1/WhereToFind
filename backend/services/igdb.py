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
    token = await get_igdb_token()
    headers = {
        "Client-ID": TWITCH_CLIENT_ID,
        "Authorization": f"Bearer {token}"
    }
    query = f'''
        search "{title}";
        fields name, summary, cover.url, genres.name, platforms.name, videos.video_id, websites.url;
        limit 1;
    '''
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{IGDB_BASE_URL}/games", data=query, headers=headers)
        resp.raise_for_status()
        results = resp.json()
        if not results:
            return None

        game = results[0]
        game_title = game.get("name", title)

        store_tasks = [search_store(game_title, store) for store in STORE_SOURCES]
        store_links: List[str] = await asyncio.gather(*store_tasks)
        trailer_link = await fetch_best_youtube_trailer(game_title)

        return {
            "type": "game",
            "title": game.get("name"),
            "description": game.get("summary"),
            "poster": f"https:{game['cover']['url']}" if game.get("cover") else None,
            "platforms": [p["name"] for p in game.get("platforms", [])],
            "genres": [g["name"] for g in game.get("genres", [])],
            "stores": [link for link in store_links if link],
            "trailer": trailer_link,
        }


STORE_SOURCES = [
    "https://store.steampowered.com/search/?term=",
    "https://www.epicgames.com/store/en-US/browse?q=",
    "https://store.ubi.com/us/search?q=",
    "https://www.gog.com/en/games?search=",
    "https://www.microsoft.com/en-us/search/shop/games?q=",
    "https://store.playstation.com/en-us/search/",
    "https://www.humblebundle.com/store/search?search=",
]



async def search_store(game_title: str, base_url: str):
    search_url = base_url + game_title.replace(" ", "%20")
    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
        try:
            response = await client.get(search_url)
            soup = BeautifulSoup(response.text, "html.parser")
            links = soup.find_all("a", href=True)
            best_match = None
            best_score = 0

            for link in links:
                text = link.get_text(strip=True)
                href = link["href"]
                score = fuzz.partial_ratio(game_title.lower(), text.lower())

                if score > best_score and score > 75:
                    best_score = score
                    parsed = urlparse(href)
                    if not parsed.netloc:
                        href = urljoin(response.url, href)
                    best_match = href

            return best_match
        except Exception:
            return None

async def fetch_best_youtube_trailer(title: str) -> Optional[str]:
    search_url = f"https://www.youtube.com/results?search_query={title.replace(' ', '+')}+official+trailer"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(search_url)
            matches = re.findall(r"watch\?v=(\S{11})", response.text)
            if matches:
                video_id = matches[0]
                return f"https://www.youtube.com/embed/{video_id}"
        except Exception:
            return None
    return None
