import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const MEDICINE_URL = `${BACKEND_URL}/medicine`;

// addMedicineToFlock
const addMedicineToFlock = async (formData, flockId) => {
    try {
        const response = await axios.post(`${MEDICINE_URL}/addMedicineToFlock/${flockId}`, formData, {
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

// getAllMedicine
const getAllMedicine = async () => {
    try {
        const response = await axios.get(`${MEDICINE_URL}/getAllMedicine`, {
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


// getMedicineByFlockId
const getMedicineByFlockId = async (flockId) => {
    try {
        const response = await axios.get(`${MEDICINE_URL}/getMedicineByFlockId/${flockId}`, {
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



// updateVaccinationById
const updateVaccinationById = async (flockId, vaccination) => {
    try {
        const response = await axios.put(`${MEDICINE_URL}/updateVaccinationById/${flockId}`, vaccination, {
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


// deleteVaccinationById
const deleteVaccinationById = async ({flockId, vaccinationId}) => {
    try {
        const response = await axios.delete(`${MEDICINE_URL}/deleteVaccinationById/${flockId}/${vaccinationId}`, {
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


// deleteMedicineById
const deleteMedicineById = async (medicineId) => {
    try {
        const response = await axios.delete(`${MEDICINE_URL}/deleteMedicineById/${medicineId}`, {
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

const medicineService = {
    addMedicineToFlock,
    getAllMedicine,
    getMedicineByFlockId,
    updateVaccinationById,
    deleteVaccinationById,
    deleteMedicineById

};

export default medicineService;
