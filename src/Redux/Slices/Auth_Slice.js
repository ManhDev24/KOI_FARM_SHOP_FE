import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage } from "../../utils/LocalStorage";

const userLocalStorage = getLocalStorage("user");

const initialState = {
  currentUser: userLocalStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    signOut: (state, action) => {
      state.currentUser = null;
    },
  },
});
export const { setUser, signOut } = authSlice.actions;

export default authSlice.reducer;
