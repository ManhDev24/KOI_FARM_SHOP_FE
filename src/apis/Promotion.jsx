import fetcher from "./Fetcher";

export const PromotionApi = {
  applyPromotion: async (promoCode, accId) => {
    try {
      const response =
        await fetcher.post(`http://localhost:8080/koifarm/promotion/apply?promoCode=${promoCode}&accountId=${accId}
`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default PromotionApi;

