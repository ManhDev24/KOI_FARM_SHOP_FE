import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/Auth_Slice";
import cartReducer from "./Slices/Cart_Slice";
// import fishListReducer from "./Slices/FishList_Slice"; // Import categoryReducer

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  // category: fishListReducer, // Thêm categoryReducer vào rootReducer
});

const Store = configureStore({
  reducer: rootReducer,
});

export default Store;
