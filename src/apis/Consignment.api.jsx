import { update } from "lodash";
import fetcher from "./Fetcher";
import url from "../constant/constant";
export const ConsignmentApi = {
  requestConsignment: async (data) => {
    try {
      const response = await fetcher.post(
        `${url}/consignment/createConsignment`,
        data, // data is the FormData object
        {
          headers: {
            "Content-Type": "multipart/form-data", // Optional, Axios usually sets this automatically
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error during consignment request"
      );
    }
  },
  statusConsignment: async (id) => {
    try {
      const response = await fetcher.get(
        `${url}/consignment/consignmentDetail/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error during consignment request"
      );
    }
  },
  getCertificateByID: async (id) => {
    try {
      const response = await fetcher.get(
        `${url}/certificate/getCertificate?koiId=${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error during consignment request"
      );
    }
  },
  getAllConsignment: async (currentPage, pageSize = 9, accountId) => {
    try {
      const response = await fetcher.get(
        `${url}/consignment/getAllConsignment?pageNo=${currentPage}&pageSize=${pageSize}&accountId=${accountId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getAllConsignmentManagement: async (currentPage, pageSize = 9) => {
    try {
      const response = await fetcher.get(
        `${url}/consignment/getAllConsignmentManagement?pageNo=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getConsignmentDetail: async (id) => {
    try {
      const response = await fetcher.get(
        `${url}/consignment/consignmentDetail/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  approvalConsignment: async (id) => {
    try {
      const response = await fetcher.put(
        `${url}/consignment/approve/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  rejectConsignment: async (id, rejectionReason) => {
    try {
      const response = await fetcher.put(
        `${url}/consignment/reject/${id}?rejectionReason=${rejectionReason}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  cancelConsignment: async (id) => {
    try {
      const response = await fetcher.delete(
        `${url}/consignment/deleteConsignment?consignmentId=${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  sendEmailConsignment: async (id) => {
    try {
      const response = await fetcher.get(
        `${url}/consignment/sendMail/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getAllFishCare: async (currentPage, pageSize) => {
    try {
      const response = await fetcher.get(
        `${url}/consignment/getAllFishCare?pageNo=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  addHeathForKoi: async (data) => {
    try {
      const response = await fetcher.post(
        `${url}/consignment/addHealth`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  editHeathForKoi: async (data) => {
    try {
      const response = await fetcher.put(
        `${url}/consignment/updateHealth`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getAllConsignmentFee: async (currentPage, pageSize) => {
    try {
      const response = await fetcher.get(
        `${url}/consignmentFee/getAll/${currentPage}/${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  updateConsignmentFee: async (data) => {
    try {
      const response = await fetcher.put(
        `${url}/consignmentFee/update`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getAllServiceFee: async () => {
    try {
      const response = await fetcher.get(
        `${url}/consignmentFee/getAll/1/20`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  createConsignmentFee: async (data) => {
    try {
      const response = await fetcher.post(
        `${url}/consignmentFee/create`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getAllHealthCareConsignmentForCustomer: async (accountID, pageNo, pageSize) => {
    try {
      const response = await fetcher.get(
        `${url}/consignment/getAllFishCareForCustomer?pageNo=${pageNo}&pageSize=${pageSize}&accountId=${accountID}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getAllHealthCareConsignmentForCustomerDetail: async (fishId) => {
    try {
      const response = await fetcher.get(
        `${url}/consignment/getFishCareDetail?koiId=${fishId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getAllSellConsignmentForCustomer: async (accountID, pageNo, pageSize) => {
    try {
      const response = await fetcher.get(`${url}/consignment/consignments/for-sale?accountId=${accountID}&pageNo=${pageNo}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};
