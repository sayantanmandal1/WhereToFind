import os
import httpx
from dotenv import load_dotenv
load_dotenv()

RAWG_API_KEY = os.getenv("RAWG_API_KEY")
RAWG_BASE_URL = "https://api.rawg.io/api"

async def get_game_data(title: str):
    async with httpx.AsyncClient() as client:
        # Step 1: Search for the game
        search_resp = await client.get(f"{RAWG_BASE_URL}/games", params={
            "key": RAWG_API_KEY,
            "search": title
        })
        results = search_resp.json().get("results", [])
        if not results:
            return None

        game = results[0]

        return {
            "type": "game",
            "title": game["name"],
            "description": game.get("description_raw", ""),
            "poster": game["background_image"],
            "released": game.get("released"),
            "platforms": [p["platform"]["name"] for p in game.get("platforms", [])],
            "stores": [
                {"store": s["store"]["name"], "link": s["url"]} for s in game.get("stores", [])
            ],
            "trailer": await get_game_trailer(game["id"], client)
        }

async def get_game_trailer(game_id: int, client: httpx.AsyncClient):
    trailer_resp = await client.get(f"{RAWG_BASE_URL}/games/{game_id}/movies", params={"key": RAWG_API_KEY})
    movies = trailer_resp.json().get("results", [])
    if movies:
        return movies[0]["data"]["480"]  # or 720 if available
    return None
