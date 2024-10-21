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
  updateCategory: async (data, id) => {
    try {
      const response = await fetcher.put(
        `http://localhost:8080/koifarm/manage/updateCategory/${id}`,
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
        `http://localhost:8080/koifarm/manage/searchCategory?name=${name}&pageNum=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default CategoryApi;
