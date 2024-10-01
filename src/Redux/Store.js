import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/Auth_Slice";
import cartReducer from "./Slices/Cart_Slice";

import orderReducer from "./Slices/Order_Slice";
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  order: orderReducer,

});

const Store = configureStore({
  reducer: rootReducer,
});

export default Store;
