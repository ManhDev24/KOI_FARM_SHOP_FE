import fetcher from "./Fetcher";
import url from "../constant/constant";
export const CategoryApi = {
  getAllCategory: async (curretPage, pageSize) => {
    try {
      const response = await fetcher.get(
        `${url}/manage/getAllCategory?pageNum=${curretPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  addCategory: async (payload) => {
    try {
      const response = await fetcher.post(
        `${url}/manage/addCategory`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  deleteCategory: async (id) => {
    try {
      const response = await fetcher.put(
        `${url}/manage/changeStatus/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  updateCategory: async (data, id) => {
    try {
      const response = await fetcher.put(
        `${url}/manage/updateCategory/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  searchCategory: async (name, currentPage, pageSize = 4) => {
    try {
      const response = await fetcher.get(
        `${url}/manage/searchCategory?name=${name}&pageNum=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default CategoryApi;
