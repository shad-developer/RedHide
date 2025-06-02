import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import animalReducer from "./features/animalSlice";
import feedStockReducer from "./features/feedStockSlice";
import flockReducer from "./features/flockSlice";
import feedReducer from "./features/feedSlice";
import medicineReducer from "./features/medicineSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    animal: animalReducer,
    feedStock: feedStockReducer,
    flock: flockReducer,
    feed: feedReducer,
    medicine: medicineReducer,
  },
});

export default store;
