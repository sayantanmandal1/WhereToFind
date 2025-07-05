from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from services.tmdb import get_movie_data
from services.igdb import get_game_data
from services.books import get_book_data

app = FastAPI(title="WhereToFind API", version="1.0")

# CORS config for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
async def search(query: str = Query(...), type: str = Query("movie")):
    """Smart search endpoint. Auto-detects if not specified."""
    try:
        if type == "movie":
            data = await get_movie_data(query)
        elif type == "game":
            data = await get_game_data(query)
        elif type == "book":
            data = await get_book_data(query)
        else:
            # Fallback to movie search
            data = await get_movie_data(query)
        
        return {"success": bool(data), "data": data}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/")
def read_root():
    return {"message": "Media Search API is running"}