import os
import httpx
from urllib.parse import quote
from dotenv import load_dotenv
from justwatch import JustWatch

load_dotenv()

OMDB_API_KEY = os.getenv("OMDB_API_KEY")
OMDB_BASE_URL = "http://www.omdbapi.com/"

def extract_trailer(title: str):
    query = quote(f"{title} official trailer")
    return f"https://www.youtube.com/results?search_query={query}"

def get_streaming_providers(title: str, country: str = "US"):
    justwatch = JustWatch(country=country)
    results = justwatch.search_for_item(query=title)

    items = results.get('items')
    if not items:
        return suggest_platforms(title)  # fallback

    item = items[0]
    offers = item.get("offers", [])
    providers = {}
    for offer in offers:
        provider_id = offer.get("provider_id")
        url = offer.get("urls", {}).get("standard_web")
        monetization_type = offer.get("monetization_type")

        if provider_id and url and monetization_type == "flatrate":
            provider_name = justwatch.get_provider(provider_id)["clear_name"]
            providers[provider_name] = url

    if not providers:
        return suggest_platforms(title)  # fallback

    return [{"platform": name, "link": link} for name, link in providers.items()]

def suggest_platforms(title: str):
    encoded = quote(title)
    return [
        {"platform": "Netflix", "link": f"https://www.netflix.com/search?q={encoded}"},
        {"platform": "Prime Video", "link": f"https://www.primevideo.com/search?phrase={encoded}"},
        {"platform": "Apple TV", "link": f"https://tv.apple.com/search/{encoded}"},
        {"platform": "YouTube Movies", "link": f"https://www.youtube.com/results?search_query={encoded}+official+trailer"},
    ]

async def get_movie_data(title: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(OMDB_BASE_URL, params={
            "t": title,
            "apikey": OMDB_API_KEY
        })

        data = response.json()
        if data.get("Response") == "False":
            return None

        # Wrap JustWatch call safely
        try:
            platforms = get_streaming_providers(data.get("Title", ""))
        except Exception as e:
            print(f"[JustWatch error] {e}")
            platforms = suggest_platforms(data.get("Title", ""))

        return {
            "type": "movie" if data.get("Type") == "movie" else "series",
            "title": data.get("Title"),
            "description": data.get("Plot"),
            "poster": data.get("Poster") if data.get("Poster") != "N/A" else None,
            "backdrop": None,
            "trailer": extract_trailer(data.get("Title", "")),
            "platforms": platforms
        }
