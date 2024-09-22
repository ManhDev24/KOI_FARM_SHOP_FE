import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/Auth_Slice";
const rootReducer = combineReducers({
  auth: authReducer,
});

const Store = configureStore({
  reducer: rootReducer,
});

export default Store;
