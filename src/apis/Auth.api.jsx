import fetcher from "./Fetcher";

export const AuthApi = {
  login: async (data) => {
    try {
      const response = await fetcher.get("http://localhost:9999/users", data);
      return response.data.content;
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
};
