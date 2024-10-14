import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  consignmentID: null,
  formData: null,
};

const consignmentID_Slice = createSlice({
  name: "consignment",
  initialState,
  reducers: {
    saveConsignmentID: (state, action) => {
      state.consignmentID = action.payload;
    },
    saveFormData: (state, action) => {
      state.formData = action.payload;
    },
  },
});

// Export the actions and reducer
export const { saveConsignmentID,saveFormData  } = consignmentID_Slice.actions;
export default consignmentID_Slice.reducer;
