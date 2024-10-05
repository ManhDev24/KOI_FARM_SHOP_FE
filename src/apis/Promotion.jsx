import fetcher from "./Fetcher";

export const PromotionApi = {
  applyPromotion: async (promoCode, accId) => {
    try {
      console.log('accId: ', accId);
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
