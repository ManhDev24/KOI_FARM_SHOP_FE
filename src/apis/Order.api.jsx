import fetcher from "./Fetcher";
import url from "../constant/constant";
const orderApi = {
  getOrderHistory: async (accountID, currentPage, pageSize = 9) => {
    try {
      const response = await fetcher.get(
        `${url}/order/getOrderHistory?accountID=${accountID}&pageNo=${currentPage}&pageSize=${pageSize}
`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getOrderDetail: async (orderID) => {
    try {
      const response = await fetcher.get(
        `${url}/order/getOrderDetail?orderID=${orderID}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getAllOrder: async (currentPage, pageSize = 7) => {
    try {
      const response = await fetcher.get(
        `${url}/manage/getAllOrders?pageNo=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  totalOrder: async () => {
    try {
      const response = await fetcher.get(
        `${url}/dashboard/total-orders`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  searchOrder: async (id, currentPage, pageSize = 9) => {
    try {
      const response = await fetcher.get(
        `${url}/manage/searchOrder?transactionCode=${id}&pageNum=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};
export default orderApi;
