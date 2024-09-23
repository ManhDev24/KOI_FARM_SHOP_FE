import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, removeLocalStorage } from "../../utils/LocalStorage";

const userLocalStorage = getLocalStorage("user");

const initialState = {
  currentUser: userLocalStorage,
  email: "",
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
      removeLocalStorage("user");
    },
    saveEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});
export const { setUser, signOut, saveEmail } = authSlice.actions;

export default authSlice.reducer;
