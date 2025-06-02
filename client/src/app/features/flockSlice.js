import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import flockService from "../services/flockService";
import { toast } from 'keep-react';

const initialState = {
    flocks: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    summary: null,
};

// addFlock
export const addFlock = createAsyncThunk(
    "flock/addFlock",
    async (formData, thunkApi) => {
        console.log(formData);
        try {
            const response = await flockService.addFlock(formData);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

// getFlocks
export const getFlocks = createAsyncThunk(
    "flock/getFlocks",
    async (_, thunkApi) => {
        try {
            const response = await flockService.getFlocks();
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

// update flock
export const updateFlock = createAsyncThunk(
    "flock/updateFlock",
    async (formData, thunkApi) => {
        try {
            const response = await flockService.updateFlock(formData);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

// delete flock
export const deleteFlock = createAsyncThunk(
    "flock/deleteFlock",
    async (id, thunkApi) => {
        try {
            const response = await flockService.deleteFlock(id);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);



const flockSlice = createSlice({
    name: "flock",
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
            .addCase(addFlock.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(addFlock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(addFlock.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(getFlocks.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getFlocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.flocks = action.payload;
            })
            .addCase(getFlocks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateFlock.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(updateFlock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(updateFlock.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
         .addCase(deleteFlock.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(deleteFlock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(deleteFlock.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
    }
});

export const { RESET } = flockSlice.actions;
export const selectIsSuccess = (state) => state.flock.isSuccess;
export const selectIsLoading = (state) => state.flock.isLoading;
export const selectIsError = (state) => state.flock.isError;
export default flockSlice.reducer;
