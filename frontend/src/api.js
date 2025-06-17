import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // adjust if using a different port

export const searchMedia = async (query, type) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { query, type },
    });
    return response.data;
  } catch (error) {
    console.error("Search failed:", error);
    return null;
  }
};
