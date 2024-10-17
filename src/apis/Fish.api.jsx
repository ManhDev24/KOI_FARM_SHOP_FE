import fetcher from "./Fetcher";

export const FishApi = {
  getBatchFishDetail: async (id) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/BatchKoi/${id}`
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
      throw new Error(error.response.data.message);
    }
  },
  getListFish: async (currentPage, pageSize = 9) => {
    try {
      console.log("pageSize: ", pageSize);
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
  getListBatchFish: async (currentPage, pageSize = 9) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/BatchKoi/getAllBatch?pageNo=${currentPage}&pageSize=${pageSize}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getFilteredBatchKoiFish: async (
    pageNo,
    pageSize,
    categoryID,
    avgSize,
    age,
    minPrice,
    maxPrice,
    sortField,
    sortDirection
  ) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/BatchKoi?pageNo=${pageNo}&pageSize=${pageSize}&categoryID=${categoryID}&avgSize=${avgSize}&age=${age}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortField=${sortField}&sortDirection=${sortDirection}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getListBatchFishByCategory: async (
    categoryID,
    currentPage = 1,
    pageSize = 9
  ) => {
    try {
      // if (categoryID) {
      // Call the filter API if categoryID is provided
      response = await fetcher.get(
        `http://localhost:8080/koifarm/BatchKoi/${categoryID}/${currentPage}/${pageSize}`
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
  addFish: async (formdata) => {
    try {
      const response = await fetcher.post(
        `http://localhost:8080/koifarm/koifish/add`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error uploading data");
    }
  },
  updateFish: async (formdata, id) => {
    try {
      const response = await fetcher.put(
        `http://localhost:8080/koifarm/koifish/update/${id}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error uploading data");
    }
  },
  changeStatus: async (id, status = 1 ) => {
    try {
      const response = await fetcher.post(
        `http://localhost:8080/koifarm/koifish/changeStatus/${id}/${status}`
      );
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  totalKoiFish: async () => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/dashboard/total-koi`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  totalBatchFish: async () => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/dashboard/total-batch`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default FishApi;
