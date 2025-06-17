import axios from "axios";

const API_BASE_URL = "https://wheretofind.onrender.com"; 

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
