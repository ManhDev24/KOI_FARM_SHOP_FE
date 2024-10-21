import create from "@ant-design/icons/lib/components/IconFont";
import fetcher from "./Fetcher";

export const AccountApi = {
  getProfile: async (email) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/account/profile/${email}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getAllAccount: async (currentPage, pageSize = 9) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/manage/allAcount?page=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  banUser: async (id) => {
    try {
      const response = await fetcher.put(
        `http://localhost:8080/koifarm/manage/updateStatus/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  createAccount: async (data) => {
    try {
      const response = await fetcher.post(
        "http://localhost:8080/koifarm/manage/createAccount",
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  searchAccountByEmail: async (email , currentPage, pageSize = 9) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/manage/searchEmail?email=${email}&page=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  totalAccount: async () => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/dashboard/total-accounts`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};
