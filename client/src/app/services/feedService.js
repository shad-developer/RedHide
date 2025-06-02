import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const FEED_URL = `${BACKEND_URL}/feeds`;

// addFeed
const addFeed = async (feedData) => {
  try {
    const response = await axios.post(`${FEED_URL}/add-feed`, feedData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};



// getFeeds
const getFeeds = async () => {
  try {
    const response = await axios.get(`${FEED_URL}/all-feeds`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};



const feedService = {
  addFeed,
  getFeeds,
 
};

export default feedService;
