import axios from "axios";

// Use local backend for development, production URL for deployed version
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://wheretofind.onrender.com" 
  : "http://localhost:8000"; 

export const searchMedia = async (query, type) => {
  console.log(`Searching for: ${query} (type: ${type}) on ${API_BASE_URL}`);
  
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { query, type },
      timeout: 15000, // Increased timeout to 15 seconds
    });
    console.log("Search response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Search failed:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response) {
      // Server responded with error status
      throw new Error(`Server error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
    } else if (error.request) {
      // Network error
      throw new Error("Network error: Unable to connect to the server. Please check your internet connection.");
    } else {
      // Other error
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
