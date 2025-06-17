import httpx

GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

async def get_book_data(query: str):
    params = {"q": query, "maxResults": 1}

    async with httpx.AsyncClient() as client:
        response = await client.get(GOOGLE_BOOKS_API, params=params)

    if response.status_code != 200:
        return {"error": "Failed to fetch data from Google Books"}

    data = response.json()

    if not data.get("items"):
        return {"error": "No book found"}

    item = data["items"][0]["volumeInfo"]

    title = item.get("title")
    description = item.get("description", "No description available.")
    authors = item.get("authors", [])
    image = item.get("imageLinks", {}).get("thumbnail")
    info_link = item.get("infoLink")

    return {
        "type": "book",
        "title": title,
        "description": description,
        "image": image,
        "genres": item.get("categories", []),
        "platforms": authors,
        "trailer": None,
        "links": [
            {
                "name": "More Info / Purchase",
                "url": info_link
            }
        ]
    }
