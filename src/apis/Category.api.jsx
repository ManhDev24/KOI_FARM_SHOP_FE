import fetcher from "./Fetcher";

export const CategoryApi = {
  getAllCategory: async (curretPage, pageSize) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/manage/getAllCategory?pageNum=${curretPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  addCategory: async (payload) => {
    try {
      const response = await fetcher.post(
        "http://localhost:8080/koifarm/manage/addCategory",
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
        `http://localhost:8080/koifarm/manage/changeStatus/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  updateCategory: async (data) => {
    try {
      const response = await fetcher.put(
        "http://localhost:8080/koifarm/manage/updateCategory",
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
};

export default CategoryApi;