import axios from "axios";

// Use production backend URL
const API_BASE_URL = 'https://wheretofind.onrender.com';

export const searchMedia = async (query, type, filters = {}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      q: query,
      type: type
    });

    // Add filters if provided
    if (filters.year) params.append('year', filters.year);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.rating) params.append('rating', filters.rating);
    if (filters.platform) params.append('platform', filters.platform);

    const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(`Failed to search: ${error.message}`);
  }
};

// New API functions for enhanced features
export const getSearchSuggestions = async (query, type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/suggestions?q=${encodeURIComponent(query)}&type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Suggestions API Error:', error);
    return []; // Return empty array on error
  }
};

export const getPopularSearches = async (type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/popular?type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Popular searches API Error:', error);
    return [];
  }
};

export const getMediaDetails = async (id, type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/details/${type}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Details API Error:', error);
    throw new Error(`Failed to get details: ${error.message}`);
  }
};

export const getSimilarMedia = async (id, type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/similar/${type}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Similar media API Error:', error);
    return [];
  }
};

// Analytics and user behavior tracking
export const trackSearch = async (query, type, filters = {}) => {
  try {
    await fetch(`${API_BASE_URL}/analytics/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        type,
        filters,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    // Don't throw error for analytics - it shouldn't break the app
  }
};

export const trackClick = async (mediaId, type, action) => {
  try {
    await fetch(`${API_BASE_URL}/analytics/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mediaId,
        type,
        action,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Click tracking Error:', error);
  }
};
