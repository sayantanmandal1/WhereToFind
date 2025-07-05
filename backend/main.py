from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import search

app = FastAPI(title="WhereToFind API", version="1.0")

# CORS config for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the search routes
app.include_router(search.router, prefix="/api", tags=["search"])

# Legacy endpoint for backward compatibility
@app.get("/search")
async def legacy_search(q: str = None, query: str = None, type: str = "movie"):
    """Legacy search endpoint for backward compatibility"""
    from routes.search import search_media
    # Accept both 'q' and 'query' parameters
    search_query = q or query
    if not search_query:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Missing search query parameter")
    return await search_media(q=search_query, type=type)

@app.get("/")
def read_root():
    return {"message": "WhereToFind API is running", "version": "1.0"}