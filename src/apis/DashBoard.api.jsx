import fetcher from "./Fetcher";
import url from "../constant/constant";
export const DashBoardApi = {
  revenueOfYear: async () => {
    try {
      const response = await fetcher.get(
        `${url}/dashboard/revenue/years`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  revenueOfMonth: async () => {
    try {
      const response = await fetcher.get(
        `${url}/dashboard/revenue/months`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  revenueOfWeek: async () => {
    try {
      const response = await fetcher.get(
        `${url}/dashboard/revenue/weeks`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  revenueOfDay: async (months) => {
    try {
      const response = await fetcher.get(
        `${url}/dashboard/revenue/days/?month=${months}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default DashBoardApi;
