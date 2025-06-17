from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from services.omdb import get_movie_data
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
async def search(query: str = Query(...), type: str = Query("auto")):
    """Smart search endpoint. Auto-detects if not specified."""
    if type == "movie":
        return await get_movie_data(query)
    elif type == "game":
        return await get_game_data(query)
    elif type == "book":
        return await get_book_data(query)
    else:
        # Fallback auto-detect
        movie = await get_movie_data(query)
        if movie:
            return movie
        game = await get_game_data(query)
        if game:
            return game
        return await get_book_data(query)


@app.get("/")
def read_root():
    return {"message": "Media Search API is running"}