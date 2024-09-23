import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, removeLocalStorage } from "../../utils/LocalStorage";

const userLocalStorage = getLocalStorage("user");

const initialState = {
  currentUser: userLocalStorage,
  email: "",
  otpToken: "",
  isResetPassword: false,
  isAllowedToAccessForgotPassword: false,
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
    saveIsResetPassword: (state, action) => {
      state.isResetPassword = action.payload;
    },
    isAllowedToAccessForgotPassword: (state, action) => {
      state.isAllowedToAccessForgotPassword = action.payload;
    },
    saveOtpToken: (state, action) => {
      state.otpToken = action.payload;
    },
  },
});
export const {
  setUser,
  signOut,
  saveEmail,
  isResetPassword,
  saveIsResetPassword,
  isAllowedToAccessForgotPassword,
  saveOtpToken,
} = authSlice.actions;

export default authSlice.reducer;
