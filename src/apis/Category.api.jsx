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
};

export default CategoryApi;