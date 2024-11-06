import create from "@ant-design/icons/lib/components/IconFont";
import fetcher from "./Fetcher";
import url from "../constant/constant";
export const AccountApi = {
  getProfile: async (email) => {
    try {
      const response = await fetcher.get(
        `${url}/account/profile/${email}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getAllAccount: async (currentPage, pageSize = 9) => {
    try {
      const response = await fetcher.get(
        `${url}/manage/allAcount?page=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  banUser: async (id) => {
    try {
      const response = await fetcher.put(
        `${url}/manage/updateStatus/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  createAccount: async (data) => {
    try {
      const response = await fetcher.post(
        `${url}/manage/createAccount`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  searchAccountByEmail: async (email, currentPage, pageSize = 9) => {
    try {
      const response = await fetcher.get(
        `${url}/manage/searchEmail?email=${email}&page=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  totalAccount: async () => {
    try {
      const response = await fetcher.get(
        `${url}/dashboard/total-accounts`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};
