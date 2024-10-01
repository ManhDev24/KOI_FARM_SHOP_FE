import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import CheckoutApi from "../../../apis/Checkout.api";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "antd";

const ThankPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("paymentStatus");
  const paymentCode = searchParams.get("paymentCode");
  console.log("paymentCode: ", paymentCode);
  console.log("status: ", status);

  return (
    <div className="flex flex-col items-center justify-center h-[600px] w-full">
      <div className="text-center text-3xl font-bold mb-10">
        <h1>Cảm ơn bạn , thanh toán hoàn tất</h1>
      </div>
      <div className="flex justify-center items-center">
        <Button
          style={{ backgroundColor: "#FA4444", color: "white" }}
          className="p-5"
        >
          <Link to="/koiList">Tiếp tục mua cá koi nào</Link>
        </Button>
        <Button className="ms-3 p-5">
          <Link to="/">Quay về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
};

export default ThankPage;
