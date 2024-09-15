import fetcher from "./Fetcher";

export const LoginAPi = {
  login: async (data) => {
    try {
      const response = await fetcher.get("http://localhost:9999/users" , data);
      return response.data.content;
    } catch (error) {
      throw Error(error.response.data.messages);
    }
  },
};
