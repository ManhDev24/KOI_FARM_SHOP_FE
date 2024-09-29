import { useSelector } from "react-redux";
import fetcher from "./Fetcher";
import { getLocalStorage } from "../utils/LocalStorage";

export const AuthApi = {
  login: async (data) => {
    try {
      const response = await fetcher.post(
        "http://localhost:8080/koifarm/login/signin",
        data
      );
      return response.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  },
  register: async (data) => {
    try {
      const response = await fetcher.post(
        "http://localhost:8080/koifarm/account/register",
        data
      );
      return response.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  },
  otpVerify: async (otp, email) => {
    try {
      const response = await fetcher.post(
        `http://localhost:8080/koifarm/verify-otp?email=${email}&otp=${otp}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  forgotEmail: async (email) => {
    try {
      console.log("email: ", email);
      const response = await fetcher.post(
        `http://localhost:8080/koifarm/login/forgotPassword/${email}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  loginWithGoogle: async (data) => {
    try {
      const response = await fetcher.post(
        "http://localhost:8080/koifarm/login/signingoogle",
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  changePassword: async (email, data) => {
    try {
      const token = getLocalStorage("otpToken"); // Retrieve the token
      const response = await fetcher.post(
        `http://localhost:8080/koifarm/login/changePassword/${email}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  resendOtp: async (email) => {
    try {
      const response = await fetcher.post(
        `http://localhost:8080/koifarm/resend-otp?email=${email}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  userProfile:async(id)=>{
    try {
      const response = await fetcher.post(
        `http://localhost:8080/koifarm/profile/${id}`
      );
    } catch (error) {
      
    }
  }
};
