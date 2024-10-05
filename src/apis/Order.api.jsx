import fetcher from "./Fetcher";

const orderApi = {
  getOrderHistory: async (accountID, currentPage, pageSize = 9) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/order/getOrderHistory?accountID=${accountID}&pageNo=${currentPage}&pageSize=${pageSize}
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
        `http://localhost:8080/koifarm/order/getOrderDetail?orderID=${orderID}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  
};
export default orderApi;
