import fetcher from "./Fetcher";

export const DashBoardApi = {
  revenueOfYear: async () => {
    try {
      const response = await fetcher.get(
        "http://localhost:8080/koifarm/dashboard/revenue/years"
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  revenueOfMonth: async () => {
    try {
      const response = await fetcher.get(
        "http://localhost:8080/koifarm/dashboard/revenue/months"
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default DashBoardApi;