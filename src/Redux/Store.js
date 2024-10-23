import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/Auth_Slice";
import cartReducer from "./Slices/Cart_Slice";
import fishListReducer from "./Slices/FishList_Slice";
import orderReducer from "./Slices/Order_Slice";
import consignmentIDReducer from "./Slices/consignmentID_Slice";
import typeReducer from "./Slices/Type_Slice";
import consignmentDetailReducer from "./Slices/consignmentDetail_Slice";
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  order: orderReducer,
  category: fishListReducer,
  consignment: consignmentIDReducer,
  type: typeReducer,
  consignmentDetail: consignmentDetailReducer,
});

const Store = configureStore({
  reducer: rootReducer,
});
export default Store;
