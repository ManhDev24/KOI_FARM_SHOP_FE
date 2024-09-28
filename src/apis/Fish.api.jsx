import fetcher from "./Fetcher";

export const FishApi = {
  // Lấy danh sách cá Koi theo danh mục và số trang
  getListFish: async (id, page) => {
    try {
      const response = await fetcher.get(`http://localhost:9999/ListFish`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message); // Trả về lỗi chi tiết từ API nếu có
      } else {
        throw new Error("Có lỗi xảy ra khi gọi API"); // Trả về lỗi chung nếu không có thông tin chi tiết
      }
    }
  },

  // Lấy danh sách danh mục cá Koi
  getCategories: async () => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/homepage1`
      );
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message); // Trả về lỗi chi tiết từ API nếu có
      } else {
        throw new Error("Có lỗi xảy ra khi gọi API"); // Trả về lỗi chung nếu không có thông tin chi tiết
      }
    }
  },
  getKnowledgeFishList: async () => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/homepage?pageNum=0&pageSize=4`
      );
      console.log(response.data + "aaa");

      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message); // Trả về lỗi chi tiết từ API nếu có
      } else {
        throw new Error("Có lỗi xảy ra khi gọi API"); // Trả về lỗi chung nếu không có thông tin chi tiết
      }
    }
  },

  getFishListFromCategory: async (id, pageNo, pageSize) => {
    try {
      const response = await fetcher.get(`http://localhost:8080/koifarm/koifish/category?categoryId=${id}&page=${pageNo}&pageSize=${pageSize}`)
      throw new Error("Có lỗi xảy ra khi gọi API"); // Trả về lỗi chung nếu không có thông tin chi tiết
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message); // Trả về lỗi chi tiết từ API nếu có
      } else {
        throw new Error("Có lỗi xảy ra khi gọi API"); // Trả về lỗi chung nếu không có thông tin chi tiết
      }
    }

  },

};

export default FishApi;
