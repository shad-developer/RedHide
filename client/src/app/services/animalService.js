import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const ANIMAL_URL = `${BACKEND_URL}/animal`;

// addAnimal
const addAnimal = async (animalData) => {
  try {
    const response = await axios.post(`${ANIMAL_URL}/addAnimal`, animalData, {
      headers: {
         "Content-Type": "multipart/form-data",
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

// getAnimals
const getAnimals = async () => {
  try {
    const response = await axios.get(`${ANIMAL_URL}/getAllAnimals`, {
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


// updateAnimal
const updateAnimal = async (formData) => {
  try {
       const response = await axios.put(`${ANIMAL_URL}/updateAnimal/${formData.get("_id")}`, formData, {
      headers: {
               "Content-Type": "multipart/form-data",
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


// deleteAnimal
const deleteAnimal = async (animalId) => {
  try {
       const response = await axios.delete(`${ANIMAL_URL}/deleteAnimal/${animalId}`, {
      headers: {
               "Content-Type": "multipart/form-data",
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


const animalService = {
    addAnimal,
    getAnimals,
    updateAnimal,
    deleteAnimal
  
};

export default animalService;
