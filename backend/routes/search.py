from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from services import tmdb, igdb, books
import asyncio

router = APIRouter()

@router.get("/search")
async def search_media(
    q: str = Query(..., description="Search query"),
    type: str = Query(..., description="Media type: movie, game, or book"),
    year: Optional[str] = Query(None, description="Filter by year"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    rating: Optional[str] = Query(None, description="Minimum rating"),
    platform: Optional[str] = Query(None, description="Filter by platform")
):
    """
    Search for movies, games, or books with advanced filtering
    """
    try:
        # Validate media type
        if type not in ["movie", "game", "book"]:
            raise HTTPException(status_code=400, detail="Invalid media type. Must be 'movie', 'game', or 'book'")
        
        # Build filters object
        filters = {}
        if year:
            filters["year"] = year
        if genre:
            filters["genre"] = genre
        if rating:
            filters["rating"] = rating
        if platform:
            filters["platform"] = platform
        
        # Route to appropriate service based on type
        if type == "movie":
            result = await tmdb.get_movie_data(q)
        elif type == "game":
            result = await igdb.get_game_data(q)
        elif type == "book":
            result = await books.get_book_data(q)
        else:
            raise HTTPException(status_code=400, detail="Invalid media type")
        
        if not result:
            return {
                "success": False,
                "error": "No results found",
                "data": None
            }
        
        return {
            "success": True,
            "data": result,
            "query": q,
            "type": type,
            "filters": filters
        }
        
    except Exception as e:
        print(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/suggestions")
async def get_search_suggestions(
    q: str = Query(..., description="Search query for suggestions"),
    type: str = Query(..., description="Media type: movie, game, or book")
):
    """
    Get search suggestions based on query
    """
    try:
        if type not in ["movie", "game", "book"]:
            raise HTTPException(status_code=400, detail="Invalid media type")
        
        # Get suggestions from appropriate service (placeholder for now)
        suggestions = []
        
        return {
            "success": True,
            "suggestions": suggestions[:8]  # Limit to 8 suggestions
        }
        
    except Exception as e:
        print(f"Suggestions error: {str(e)}")
        return {
            "success": False,
            "suggestions": []
        }

@router.get("/popular")
async def get_popular_searches(
    type: str = Query(..., description="Media type: movie, game, or book")
):
    """
    Get popular searches for the specified media type
    """
    try:
        if type not in ["movie", "game", "book"]:
            raise HTTPException(status_code=400, detail="Invalid media type")
        
        # Return popular items based on type
        popular_items = {
            "movie": [
                {"title": "Inception", "year": 2010, "rating": 8.8},
                {"title": "The Dark Knight", "year": 2008, "rating": 9.0},
                {"title": "Interstellar", "year": 2014, "rating": 8.6},
                {"title": "The Matrix", "year": 1999, "rating": 8.7},
                {"title": "Pulp Fiction", "year": 1994, "rating": 8.9}
            ],
            "game": [
                {"title": "The Witcher 3", "year": 2015, "rating": 9.3},
                {"title": "Red Dead Redemption 2", "year": 2018, "rating": 9.7},
                {"title": "God of War", "year": 2018, "rating": 9.4},
                {"title": "Minecraft", "year": 2011, "rating": 8.9},
                {"title": "Grand Theft Auto V", "year": 2013, "rating": 9.2}
            ],
            "book": [
                {"title": "The Lord of the Rings", "year": 1954, "rating": 4.5},
                {"title": "Harry Potter", "year": 1997, "rating": 4.6},
                {"title": "The Hobbit", "year": 1937, "rating": 4.4},
                {"title": "1984", "year": 1949, "rating": 4.3},
                {"title": "To Kill a Mockingbird", "year": 1960, "rating": 4.2}
            ]
        }
        
        return {
            "success": True,
            "popular": popular_items.get(type, [])
        }
        
    except Exception as e:
        print(f"Popular searches error: {str(e)}")
        return {
            "success": False,
            "popular": []
        }

@router.get("/details/{media_type}/{media_id}")
async def get_media_details(
    media_type: str,
    media_id: str
):
    """
    Get detailed information about a specific media item
    """
    try:
        if media_type not in ["movie", "game", "book"]:
            raise HTTPException(status_code=400, detail="Invalid media type")
        
        # Get detailed information from appropriate service (placeholder for now)
        details = None
        
        if not details:
            raise HTTPException(status_code=404, detail="Media not found")
        
        return {
            "success": True,
            "data": details
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Details error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get details: {str(e)}")

@router.get("/similar/{media_type}/{media_id}")
async def get_similar_media(
    media_type: str,
    media_id: str
):
    """
    Get similar media items
    """
    try:
        if media_type not in ["movie", "game", "book"]:
            raise HTTPException(status_code=400, detail="Invalid media type")
        
        # Get similar items from appropriate service (placeholder for now)
        similar = []
        
        return {
            "success": True,
            "similar": similar[:6]  # Limit to 6 similar items
        }
        
    except Exception as e:
        print(f"Similar media error: {str(e)}")
        return {
            "success": False,
            "similar": []
        }

@router.post("/analytics/search")
async def track_search_analytics(data: dict):
    """
    Track search analytics (placeholder for future implementation)
    """
    try:
        # In a real application, you would store this in a database
        print(f"Search tracked: {data}")
        return {"success": True, "message": "Search tracked"}
    except Exception as e:
        print(f"Analytics error: {str(e)}")
        return {"success": False, "message": "Failed to track search"}

@router.post("/analytics/click")
async def track_click_analytics(data: dict):
    """
    Track click analytics (placeholder for future implementation)
    """
    try:
        # In a real application, you would store this in a database
        print(f"Click tracked: {data}")
        return {"success": True, "message": "Click tracked"}
    except Exception as e:
        print(f"Click analytics error: {str(e)}")
        return {"success": False, "message": "Failed to track click"}
