import fetcher from "./Fetcher";

export const AuthApi = {
  login: async (data) => {
    try {
      const response = await fetcher.post(
        "http://localhost:8080/koifarm/signin",
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
        "http://localhost:8080/koifarm/register",
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
        `http://localhost:8080/koifarm/forgotPassword/${email}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  loginWithGoogle: async (data) => {
    try {
      const response = await fetcher.post(
        "http://localhost:8080/koifarm/signingoogle",
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  changePassword: async (email,data) => {
    try {
      const response = await fetcher.post(
        `http://localhost:8080/koifarm/changePassword/${email}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};
