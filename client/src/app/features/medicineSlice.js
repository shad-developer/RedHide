import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import medicineService from "../services/medicineService";
import { toast } from 'keep-react';

const initialState = {
    medicines: [],
    flockMedicines: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    isDeleteSuccess: false,
    message: "",
};

//addMedicineToFlock
export const addMedicineToFlock = createAsyncThunk(
    "medicine/addMedicineToFlock",
    async ({ formData, flockId }, thunkApi) => {
        try {
            const response = await medicineService.addMedicineToFlock(formData, flockId);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

//getAllMedicine
export const getAllMedicine = createAsyncThunk(
    "medicine/getAllMedicine",
    async (_, thunkApi) => {
        try {
            const response = await medicineService.getAllMedicine();
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);


//getMedicineByFlockId
export const getMedicineByFlockId = createAsyncThunk(
    "medicine/getMedicineByFlockId",
    async (flockId, thunkApi) => {
        try {
            const response = await medicineService.getMedicineByFlockId(flockId);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

//updateVaccinationById
export const updateVaccinationById = createAsyncThunk(
    "medicine/updateVaccinationById",
    async ({ flockId, vaccination }, thunkApi) => {
        try {
            const response = await medicineService.updateVaccinationById(flockId, vaccination);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);


//deleteVaccinationById
export const deleteVaccinationById = createAsyncThunk(
    "medicine/deleteVaccinationById",
    async ({ flockId, vaccinationId }, thunkApi) => {
        try {
            const response = await medicineService.deleteVaccinationById({ flockId, vaccinationId });
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);


//deleteMedicineById
export const deleteMedicineById = createAsyncThunk(
    "medicine/deleteMedicineById",
    async (medicineId, thunkApi) => {
        try {
            const response = await medicineService.deleteMedicineById(medicineId);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

const medicineSlice = createSlice({
    name: "medicine",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        RESET(state) {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addMedicineToFlock.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(addMedicineToFlock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(addMedicineToFlock.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(getAllMedicine.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getAllMedicine.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.medicines = action.payload;
            })
            .addCase(getAllMedicine.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMedicineByFlockId.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getMedicineByFlockId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.flockMedicines = action.payload;
            })
            .addCase(getMedicineByFlockId.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(deleteVaccinationById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(deleteVaccinationById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(deleteVaccinationById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(deleteMedicineById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(deleteMedicineById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isDeleteSuccess = true;
                state.isError = false;
            })
            .addCase(deleteMedicineById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(updateVaccinationById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(updateVaccinationById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(updateVaccinationById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
    }
});

export const { RESET } = medicineSlice.actions;
export const selectIsSuccess = (state) => state.medicine.isSuccess;
export const selectIsLoading = (state) => state.medicine.isLoading;
export const selectIsError = (state) => state.medicine.isError;
export default medicineSlice.reducer;
