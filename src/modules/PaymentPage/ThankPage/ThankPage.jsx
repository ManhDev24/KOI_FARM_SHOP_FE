import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import CheckoutApi from "../../../apis/Checkout.api";

const ThankPage = () => {
  const { data: paymentStatus } = useMutation({
    mutationFn: () => CheckoutApi.getPaymentStatus(),
    onSuccess: (data) => {
      console.log("data: ", data);
    },
    onError: (error) => {
      const errorMessage = error?.message || "Đã có lỗi xử lý vui bạn !!!";
      toast.error(errorMessage);
    },
  });

  console.log("paymentStatus: ", paymentStatus);
  return <div>ThankPage</div>;
};

export default ThankPage;
