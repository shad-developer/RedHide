import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const FLOCK_URL = `${BACKEND_URL}/flock`;

// addFlock
const addFlock = async (flockData) => {
    try {
        const response = await axios.post(`${FLOCK_URL}/createNewFlock`, flockData, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response
            ? error.response.data
            : new Error("Something went wrong");
    }
};

// getFlocks
const getFlocks = async () => {
    try {
        const response = await axios.get(`${FLOCK_URL}/getAllFlocks`, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response
            ? error.response.data
            : new Error("Something went wrong");
    }
};


const updateFlock = async (formData) => {
  try {
    const response = await axios.put(`${FLOCK_URL}/updateFlockDetail/${formData.id}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateFlock:", error); 
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};


const deleteFlock = async (id) => {
  try {
    const response = await axios.delete(`${FLOCK_URL}/deleteFlock/${id}`,{
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error in deleteFlock:", error); 
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};



const flockService = {
    addFlock,
    getFlocks,
    updateFlock,
    deleteFlock
};

export default flockService;
