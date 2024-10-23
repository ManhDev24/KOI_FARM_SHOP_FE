import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  consignmentID: null,
};

const consignmentDetailSlice = createSlice({
  name: "consignmentDetail", 
  initialState,
  reducers: {
    saveConsignmentDetailID: (state, action) => {
      state.consignmentID = action.payload;
    },
  },
});


export const { saveConsignmentDetailID } = consignmentDetailSlice.actions; 
export default consignmentDetailSlice.reducer;
