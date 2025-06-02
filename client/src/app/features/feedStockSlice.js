import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import feedStockService from "../services/feedStockService";
import { toast } from 'keep-react';

const initialState = {
    feedStocks: [],
    feedStock: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// addFeedStock
export const addFeedStock = createAsyncThunk(
    "feedStock/addFeedStock",
    async (formData, thunkApi) => {
        try {
            console.log("formData", formData);
            const response = await feedStockService.addFeedStock(formData);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

// getFeedStocks
export const getFeedStocks = createAsyncThunk(
    "feedStock/getFeedStocks",
    async (_, thunkApi) => {
        try {
            const response = await feedStockService.getFeedStocks();
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

// getFeedStocksById
export const getFeedStockById = createAsyncThunk(
    "feedStock/getFeedStockById",
    async (feedStockId, thunkApi) => {
        try {
            const response = await feedStockService.getFeedStockById(feedStockId);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);


// delete feedstock history
export const deleteFeedHistory = createAsyncThunk(
    "feedStock/deleteFeedHistory",
    async ({feedStockId, historyId }, thunkApi) => {
        try {
            const response = await feedStockService.deleteFeedHistory(feedStockId, historyId);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

// update feed history
export const updateFeedHistory = createAsyncThunk(
    "feedStock/updateFeedHistory",
    async ({feedStockId, historyId, updatedData }, thunkApi) => {
        try {
            const response = await feedStockService.updateFeedHistory(feedStockId, historyId, updatedData);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);




const feedStockSlice = createSlice({
    name: "feedStock",
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
            .addCase(addFeedStock.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(addFeedStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(addFeedStock.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(getFeedStocks.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getFeedStocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.feedStocks = action.payload;
            })
            .addCase(getFeedStocks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getFeedStockById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getFeedStockById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.feedStock = action.payload;
            })
            .addCase(getFeedStockById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteFeedHistory.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(deleteFeedHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(deleteFeedHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
           .addCase(updateFeedHistory.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(updateFeedHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(updateFeedHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
        

    }
});

export const { RESET } = feedStockSlice.actions;
export const selectIsSuccess = (state) => state.feedStock.isSuccess;
export const selectIsLoading = (state) => state.feedStock.isLoading;
export const selectIsError = (state) => state.feedStock.isError;
export default feedStockSlice.reducer;
