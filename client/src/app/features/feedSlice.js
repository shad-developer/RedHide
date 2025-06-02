import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import feedService from "../services/feedService";
import { toast } from 'keep-react';

const initialState = {
    feeds: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// addFeed
export const addFeed = createAsyncThunk(
    "feed/addFeed",
    async (formData, thunkApi) => {
        try {
            const response = await feedService.addFeed(formData);
            toast.success(response.message);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);

// getFeed
export const getFeeds = createAsyncThunk(
    "feed/getFeeds",
    async (_, thunkApi) => {
        try {
            const response = await feedService.getFeeds();
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || error.toString();
            return thunkApi.rejectWithValue(message);
        }
    }
);


const feedSlice = createSlice({
    name: "feed",
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
            .addCase(addFeed.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(addFeed.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(addFeed.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(getFeeds.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getFeeds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.feeds = action.payload;
            })
            .addCase(getFeeds.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { RESET } = feedSlice.actions;
export const selectIsSuccess = (state) => state.feed.isSuccess;
export const selectIsLoading = (state) => state.feed.isLoading;
export const selectIsError = (state) => state.feed.isError;
export default feedSlice.reducer;
