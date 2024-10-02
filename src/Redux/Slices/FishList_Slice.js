import { createSlice } from "@reduxjs/toolkit";

const FishList_Slice = createSlice({
  name: "category",
  initialState: {
    selectedCategory: null,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload; // Cập nhật selectedCategory
    },
  },
});

export const { setSelectedCategory } = FishList_Slice.actions;
export default FishList_Slice.reducer;
