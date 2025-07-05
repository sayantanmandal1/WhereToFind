#!/usr/bin/env python3
"""
Simple test script to verify the backend API is working
"""

import asyncio
import httpx

async def test_search():
    """Test the search endpoint"""
    async with httpx.AsyncClient() as client:
        # Test basic search
        response = await client.get("http://localhost:8000/search", params={
            "query": "inception",
            "type": "movie"
        })
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Test root endpoint
        response = await client.get("http://localhost:8000/")
        print(f"Root Status: {response.status_code}")
        print(f"Root Response: {response.json()}")

if __name__ == "__main__":
    asyncio.run(test_search()) 