import os
import httpx
from dotenv import load_dotenv
load_dotenv()


TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

# Format YouTube embed from TMDB video data
def extract_trailer(videos):
    for video in videos.get("results", []):
        if "Trailer" in video.get("name", "") and video.get("site") == "YouTube":
            return f"https://www.youtube.com/embed/{video['key']}"
    return None

async def get_movie_data(title: str):
    async with httpx.AsyncClient() as client:
        # Step 1: Search for the movie/show
        search_resp = await client.get(f"{TMDB_BASE_URL}/search/multi", params={
            "api_key": TMDB_API_KEY,
            "query": title,
        })
        search_results = search_resp.json().get("results")
        if not search_results:
            return None

        best_match = search_results[0]
        media_type = best_match["media_type"]
        media_id = best_match["id"]

        # Step 2: Get details (with videos and images)
        detail_resp = await client.get(
            f"{TMDB_BASE_URL}/{media_type}/{media_id}",
            params={"api_key": TMDB_API_KEY, "append_to_response": "videos,images"}
        )
        detail = detail_resp.json()

        return {
            "type": media_type,
            "title": detail.get("title") or detail.get("name"),
            "description": detail.get("overview"),
            "poster": f"{TMDB_IMAGE_BASE}/w500{detail.get('poster_path')}" if detail.get("poster_path") else None,
            "backdrop": f"{TMDB_IMAGE_BASE}/original{detail.get('backdrop_path')}" if detail.get("backdrop_path") else None,
            "trailer": extract_trailer(detail.get("videos", {})),
            "platforms": suggest_platforms(title),
        }

def suggest_platforms(title: str):
    # These are example fallback links. You could scrape or use an unofficial JustWatch API if needed.
    encoded = title.replace(" ", "+")
    return [
        {"platform": "Netflix", "link": f"https://www.netflix.com/search?q={encoded}"},
        {"platform": "Prime Video", "link": f"https://www.primevideo.com/search?phrase={encoded}"},
        {"platform": "Apple TV", "link": f"https://tv.apple.com/search/{encoded}"},
        {"platform": "YouTube Movies", "link": f"https://www.youtube.com/results?search_query={encoded}+official+trailer"},
    ]
