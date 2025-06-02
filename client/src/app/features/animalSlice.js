import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import animalService from "../services/animalService";
import { toast } from 'keep-react';

const initialState = {
    animals: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

//addAnimal
export const addAnimal = createAsyncThunk(
    "animal/addAnimal",
    async (formData, thunkApi) => {
        try {
            const response = await animalService.addAnimal(formData);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

//getAnimal
export const getAnimals = createAsyncThunk(
    "animal/getAnimals",
    async (_, thunkApi) => {
        try {
            const response = await animalService.getAnimals();
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

//updateAnimal
export const updateAnimal = createAsyncThunk(
    "animal/updateAnimal",
    async(formData, thunkApi) => {
        try {
            const response = await animalService.updateAnimal(formData);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);


//deleteAnimal
export const deleteAnimal = createAsyncThunk(
    "animal/deleteAnimal",
    async(animalId, thunkApi) => {
        try {
            const response = await animalService.deleteAnimal(animalId);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

const animalSlice = createSlice({
    name: "animal",
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
            .addCase(addAnimal.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(addAnimal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(addAnimal.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(getAnimals.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getAnimals.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.animals = action.payload;
            })
            .addCase(getAnimals.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateAnimal.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(updateAnimal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(updateAnimal.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
         .addCase(deleteAnimal.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(deleteAnimal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(deleteAnimal.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
    }
});

export const { RESET } = animalSlice.actions;
export const selectIsSuccess = (state) => state.animal.isSuccess;
export const selectIsLoading = (state) => state.animal.isLoading;
export const selectIsError = (state) => state.animal.isError;
export default animalSlice.reducer;
