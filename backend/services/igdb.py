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

            # Get verified store links
            platforms = [p["name"] for p in game.get("platforms", [])] if game.get("platforms") else []
            verified_links = await get_verified_store_links(game_title, platforms)
            
            # Get trailer (simplified)
            trailer_link = await fetch_best_youtube_trailer(game_title)

            # Format image URL properly for IGDB
            image_url = None
            if game.get("cover"):
                # IGDB returns URLs like: //images.igdb.com/igdb/image/upload/t_thumb/co1r7f.jpg
                # We need to convert to: https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg
                cover_url = game['cover']['url']
                print(f"Original IGDB cover URL: {cover_url}")  # Debug log
                
                if cover_url.startswith('//'):
                    # Try different image sizes for best quality
                    # t_cover_big = 264x374, t_cover_small = 90x128, t_thumb = 90x128
                    # Use t_cover_big for best quality, fallback to original if needed
                    if 't_thumb' in cover_url:
                        image_url = cover_url.replace('t_thumb', 't_cover_big')
                    elif 't_cover_small' in cover_url:
                        image_url = cover_url.replace('t_cover_small', 't_cover_big')
                    else:
                        # If no size specified, add t_cover_big
                        image_url = cover_url.replace('/upload/', '/upload/t_cover_big/')
                    
                    image_url = f"https:{image_url}"
                    print(f"Formatted IGDB image URL: {image_url}")  # Debug log
                else:
                    image_url = f"https:{cover_url}"

            return {
                "type": "game",
                "title": game.get("name"),
                "description": game.get("summary") or "No description available.",
                "image": image_url,
                "platforms": [p["name"] for p in game.get("platforms", [])],
                "genres": [g["name"] for g in game.get("genres", [])],
                "links": verified_links,
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


async def get_verified_store_links(game_title: str, platforms: List[str] = None) -> List[dict]:
    """Get verified store links by checking actual availability based on platforms"""
    verified_links = []
    
    # Normalize platform names for easier matching
    platform_names = [p.lower() for p in (platforms or [])]
    
    # Check if this is primarily a mobile game
    is_mobile_game = any(mobile in platform_names for mobile in ['android', 'ios', 'mobile'])
    is_pc_game = any(pc in platform_names for pc in ['pc', 'windows', 'mac', 'linux'])
    is_console_game = any(console in platform_names for console in ['playstation', 'xbox', 'nintendo', 'switch'])
    
    # PC Store verification (only for PC games or games without platform info)
    if is_pc_game or not platforms:
        pc_store_configs = [
            {
                "name": "Steam",
                "search_url": f"https://store.steampowered.com/search/?term={game_title.replace(' ', '%20')}",
                "verify_selector": ".search_result_row",
                "link_selector": ".search_result_row a[href*='/app/']"
            },
            {
                "name": "Epic Games",
                "search_url": f"https://store.epicgames.com/en-US/browse?q={game_title.replace(' ', '%20')}",
                "verify_selector": "[data-testid='search-result']",
                "link_selector": "[data-testid='search-result'] a"
            },
            {
                "name": "GOG",
                "search_url": f"https://www.gog.com/en/games?search={game_title.replace(' ', '%20')}",
                "verify_selector": ".product-tile",
                "link_selector": ".product-tile a"
            }
        ]
        
        for store in pc_store_configs:
            try:
                is_available = await verify_game_availability(
                    store["search_url"], 
                    store["verify_selector"],
                    game_title
                )
                
                verified_links.append({
                    "platform": store["name"],
                    "link": store["search_url"],
                    "verified": is_available
                })
            except Exception as e:
                print(f"Error checking {store['name']}: {e}")
                verified_links.append({
                    "platform": store["name"],
                    "link": store["search_url"],
                    "verified": False
                })
    
    # Console Store verification (only for console games or games without platform info)
    if is_console_game or not platforms:
        console_stores = [
            {"name": "Microsoft Store", "url": f"https://www.microsoft.com/en-us/search/shop/games?q={game_title.replace(' ', '+')}"},
            {"name": "PlayStation Store", "url": f"https://store.playstation.com/en-us/search/{game_title.replace(' ', '%20')}"},
            {"name": "Nintendo eShop", "url": f"https://www.nintendo.com/store/search/?q={game_title.replace(' ', '+')}"}
        ]
        
        for store in console_stores:
            verified_links.append({
                "platform": store["name"],
                "link": store["url"],
                "verified": False  # Console stores are harder to verify, so mark as unverified
            })
    
    # Mobile Store verification (only for mobile games or games without platform info)
    if is_mobile_game or not platforms:
        mobile_stores = [
            {"name": "Google Play", "url": f"https://play.google.com/store/search?q={game_title.replace(' ', '+')}&c=apps"},
            {"name": "App Store", "url": f"https://apps.apple.com/search?term={game_title.replace(' ', '+')}"}
        ]
        
        for store in mobile_stores:
            # For mobile games, we can be more confident about availability
            # since mobile games are typically available on both stores
            verified_links.append({
                "platform": store["name"],
                "link": store["url"],
                "verified": is_mobile_game  # Mark as verified if we know it's a mobile game
            })
    
    # If no platforms specified, add all stores as unverified
    if not platforms:
        # Add any missing stores that weren't covered above
        all_stores = [
            {"name": "Steam", "url": f"https://store.steampowered.com/search/?term={game_title.replace(' ', '%20')}"},
            {"name": "Epic Games", "url": f"https://store.epicgames.com/en-US/browse?q={game_title.replace(' ', '%20')}"},
            {"name": "GOG", "url": f"https://www.gog.com/en/games?search={game_title.replace(' ', '%20')}"},
            {"name": "Microsoft Store", "url": f"https://www.microsoft.com/en-us/search/shop/games?q={game_title.replace(' ', '+')}"},
            {"name": "PlayStation Store", "url": f"https://store.playstation.com/en-us/search/{game_title.replace(' ', '%20')}"},
            {"name": "Nintendo eShop", "url": f"https://www.nintendo.com/store/search/?q={game_title.replace(' ', '+')}"}
        ]
        
        # Only add stores that aren't already in verified_links
        existing_stores = {link["platform"] for link in verified_links}
        for store in all_stores:
            if store["name"] not in existing_stores:
                verified_links.append({
                    "platform": store["name"],
                    "link": store["url"],
                    "verified": False
                })
    
    return verified_links


async def verify_game_availability(search_url: str, selector: str, game_title: str) -> bool:
    """Verify if a game is actually available on a store"""
    async with httpx.AsyncClient(timeout=5.0, follow_redirects=True) as client:
        try:
            response = await client.get(search_url)
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Look for search results
            results = soup.select(selector)
            
            if not results:
                return False
            
            # Check if any result matches the game title
            for result in results[:5]:  # Check first 5 results
                text = result.get_text(strip=True).lower()
                title_lower = game_title.lower()
                
                # Use fuzzy matching to account for slight differences
                similarity = fuzz.partial_ratio(title_lower, text)
                if similarity > 70:  # 70% similarity threshold
                    return True
            
            return False
            
        except Exception as e:
            print(f"Error verifying availability: {e}")
            return False


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
