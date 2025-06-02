import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const FEED_STOCK_URL = `${BACKEND_URL}/feedStock`;

// addFeedStock
const addFeedStock = async (feedStockData) => {
  try {
    const response = await axios.post(`${FEED_STOCK_URL}/addFeedStock`, feedStockData, {
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

// getFeedStocks
const getFeedStocks = async () => {
  try {
    const response = await axios.get(`${FEED_STOCK_URL}/getAllFeedStocks`, {
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

const getFeedStockById = async (feedStockId) => {
  try {
    const response = await axios.get(`${FEED_STOCK_URL}/getFeedStockById/${feedStockId}`, {
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


// delete feed history

const deleteFeedHistory = async (feedStockId, historyId) => {
  try {
    const response = await axios.delete(`${FEED_STOCK_URL}/${feedStockId}/history/${historyId}`, {
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
}


// update feed history
const updateFeedHistory = async (feedStockId, historyId, updatedData) => {
  try {
    const response = await axios.put(`${FEED_STOCK_URL}/${feedStockId}/history/${historyId}`, updatedData, {
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


const feedStockService = {
  addFeedStock,
  getFeedStocks,
  deleteFeedHistory,
  getFeedStockById,
  updateFeedHistory
};

export default feedStockService;
