from fastapi import APIRouter, Query
from services.tmdb import get_movie_data
from services.igdb import get_game_data

router = APIRouter()

@router.get("/search")
async def search(query: str, type: str = Query(..., enum=["movie", "game"])):
    if type == "movie":
        data = await get_movie_data(query)
    elif type == "game":
        data = await get_game_data(query)
    else:
        data = None

    return {"success": bool(data), "data": data}
