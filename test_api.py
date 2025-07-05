#!/usr/bin/env python3
"""
Simple test script to verify the backend API is working
"""

import requests
import json

def test_api():
    base_url = "http://localhost:8000"
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Root endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
        return
    
    # Test movie search
    try:
        response = requests.get(f"{base_url}/search", params={"query": "Inception", "type": "movie"})
        print(f"✅ Movie search: {response.status_code}")
        data = response.json()
        print(f"   Success: {data.get('success')}")
        if data.get('data'):
            print(f"   Title: {data['data'].get('title')}")
    except Exception as e:
        print(f"❌ Movie search failed: {e}")
    
    # Test game search
    try:
        response = requests.get(f"{base_url}/search", params={"query": "Minecraft", "type": "game"})
        print(f"✅ Game search: {response.status_code}")
        data = response.json()
        print(f"   Success: {data.get('success')}")
        if data.get('data'):
            print(f"   Title: {data['data'].get('title')}")
    except Exception as e:
        print(f"❌ Game search failed: {e}")
    
    # Test book search
    try:
        response = requests.get(f"{base_url}/search", params={"query": "Harry Potter", "type": "book"})
        print(f"✅ Book search: {response.status_code}")
        data = response.json()
        print(f"   Success: {data.get('success')}")
        if data.get('data'):
            print(f"   Title: {data['data'].get('title')}")
    except Exception as e:
        print(f"❌ Book search failed: {e}")

if __name__ == "__main__":
    print("Testing WhereToFind API...")
    print("=" * 40)
    test_api()
    print("=" * 40)
    print("Test completed!") 