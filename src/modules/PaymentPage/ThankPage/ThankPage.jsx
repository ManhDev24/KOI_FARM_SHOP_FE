import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import CheckoutApi from "../../../apis/Checkout.api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";
import {
  getLocalStorage,
  removeLocalStorage,
} from "../../../utils/LocalStorage";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ThankPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("paymentStatus");
  const navigate = useNavigate();
  useEffect(() => {
    if (status !== "1") {
      navigate("/");
    }
  }, [status, navigate]);
  const paymentCode = searchParams.get("paymentCode");
  const user = getLocalStorage("user");
  console.log("user: ", user);
  const order = getLocalStorage("cartItems");
  console.log("order: ", order);
  console.log("paymentCode: ", paymentCode);
  console.log("status: ", status);
  const {
    mutate: handleSaveOrder,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: (data) => CheckoutApi.saveOrder(data, paymentCode),
    onSuccess: (data) => {
      toast.success("Thực hiện giao dịch thành công");
      removeLocalStorage("cartItems");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
      toast.error(errorMessage);
    },
  });

  const accountID = user?.id;
  const koiFishs = order?.map((fish) => fish.id);
  const batchs = [];
  const quantity = order?.map((item) => item.quantity);
  const totalPrice = useSelector((state) => state.cart.total);
  const data = {
    accountID,
    koiFishs,
    batchs,
    quantity,
    totalPrice,
  };
  console.log("data: ", data);

  useEffect(() => {
    if (status == 1 && paymentCode && order) {
      handleSaveOrder(data);
    }
  }, [paymentCode]);
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
