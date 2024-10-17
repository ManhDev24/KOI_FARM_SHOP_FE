import fetcher from "./Fetcher";

export const CheckoutApi = {
  saveOrder: async (data, transactionCode) => {
    try {
      const response = await fetcher.post(
        `http://localhost:8080/koifarm/order/saveOrder?transactionCode=${transactionCode}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  payByVnPay: async (amount, bankCode = "ncb") => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/payment/vn-pay?amount=${amount}&bankCode=${bankCode}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  vnPayCallback: async (params) => {
    try {
      const response = await fetcher.get(
        "http://localhost:8080/koifarm/payment/vn-pay-callback",
        { params }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getPaymentStatus: async () => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/payment/get-payment-status`
      );
      console.log("response: ", response);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default CheckoutApi;
