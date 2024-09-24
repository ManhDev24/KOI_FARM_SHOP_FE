import fetcher from "./Fetcher";

const FishApi = {
  getListFish: async () => {
    try {
      const response = await fetcher.get("http://localhost:9999/ListFish");
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default FishApi;
