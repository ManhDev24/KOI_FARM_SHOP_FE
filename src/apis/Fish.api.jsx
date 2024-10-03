import fetcher from "./Fetcher";

export const FishApi = {

  getListFish: async (currentPage, pageSize = 9) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/koifish/allkoi?page=${currentPage}&pageSize=${pageSize}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getListFishByCategory: async (categoryID, currentPage = 1, pageSize = 9) => {
    try {
      // if (categoryID) {
      // Call the filter API if categoryID is provided
      response = await fetcher.get(
        `http://localhost:8080/koifarm/koifish/filter?categoryID=${categoryID}&page=${currentPage}&pageSize=${pageSize}`
      );
      // } else {
      //   // Call the all koi fish API if no categoryID is provided
      //   response = await fetcher.get(
      //     `http://localhost:8080/koifarm/koifish/allkoi?page=${currentPage}&pageSize=${pageSize}`
      //   );
      // }
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getCategories: async () => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/getListCategory`
      );
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Có lỗi xảy ra khi gọi API");
      }
    }
  },
  getKnowledgeFishList: async () => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/homepage?pageNum=1&pageSize=4`
      );
      console.log(response.data + "aaa");

      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Có lỗi xảy ra khi gọi API");
      }
    }
  },
  getFilteredKoiFish: async (
    categoryID,
    gender,
    minSize,
    maxSize,
    minPrice,
    maxPrice,
    sortField1,
    sortDirection1,
    sortField2,
    sortDirection2,
    page,
    pageSize
  ) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/koifish/filter?categoryID=${categoryID}&gender=${gender}&minSize=${minSize}&maxSize=${maxSize}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortField1=${sortField1}&sortDirection1=${sortDirection1}&sortField2=${sortField2}&sortDirection2=${sortDirection2}&page=${page}&pageSize=${pageSize}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getFishDetail: async (id) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/koifish/${id}`
      );
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Có lỗi xảy ra khi gọi API");
      }
    }
  },
};

export default FishApi;
