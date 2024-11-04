import fetcher from "./Fetcher";
import url from "../constant/constant";
export const PromotionApi = {
  applyPromotion: async (promoCode, accId) => {
    try {
      const response =
        await fetcher.post(`${url}/promotion/apply?promoCode=${promoCode}&accountId=${accId}
`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default PromotionApi;

