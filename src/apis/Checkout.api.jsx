import fetcher from "./Fetcher";
import url from "../constant/constant";
export const CheckoutApi = {
  saveOrder: async (data, transactionCode) => {
    try {
      const response = await fetcher.post(
        `${url}/order/saveOrder?transactionCode=${transactionCode}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  saveConsignment: async (transactionCode,consignmentID) => {
    try {
      const response = await fetcher.post(
        `${url}/consignment/processPayment?consignmentId=${consignmentID}&transactionCode=${transactionCode}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  payByVnPay: async (amount, bankCode = "ncb", type) => {
    try {
      const response = await fetcher.get(
        `${url}/payment/vn-pay?amount=${amount}&bankCode=${bankCode}&type=${type}`

      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  vnPayCallback: async (params) => {
    try {
      const response = await fetcher.get(
        `${url}/payment/vn-pay-callback`,
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
        `${url}/payment/get-payment-status`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default CheckoutApi;
