import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  typePayment: false, // Default value is set to false
};

const typeSlice = createSlice({
  name: "type",
  initialState,
  reducers: {
    saveTypePayment: (state, action) => {
      state.typePayment = action.payload; // Update the typePayment state
    },
  },
});

// Export the action and reducer
export const { saveTypePayment } = typeSlice.actions;
export default typeSlice.reducer;
