import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderId: "",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    saveOrderId: (state, action) => {
      state.orderId = action.payload;
    },
  },
});

export const { saveOrderId } = orderSlice.actions;
export default orderSlice.reducer;