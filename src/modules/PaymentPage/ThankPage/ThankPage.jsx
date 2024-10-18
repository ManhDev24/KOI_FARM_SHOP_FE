import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import CheckoutApi from "../../../apis/Checkout.api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, message } from "antd";
import {
  getLocalStorage,
  removeLocalStorage,
} from "../../../utils/LocalStorage";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import LoadingModal from "../../Modal/LoadingModal";

const ThankPage = () => {
  const hasCalledApi = useRef(false); 
  const [searchParams] = useSearchParams();
  const status = searchParams.get("paymentStatus");
  const type = searchParams.get("type");
  const navigate = useNavigate();

  useEffect(() => {
    if (status !== "1") {
      navigate("/");
    }
  }, [status, navigate]);

  const paymentCode = searchParams.get("paymentCode");
  const disCountRate = getLocalStorage("discountRate");
  const promoCode = getLocalStorage("PromotionCode");
  const user = getLocalStorage("user");
  const order = getLocalStorage("cartItems");

  const {
    mutate: handleSaveOrder,
    isLoading: isHandleSaveOrderLoading,
    isError: isHandleSaveOrderError,
  } = useMutation({
    mutationFn: (data) => CheckoutApi.saveOrder(data, paymentCode),
    onSuccess: () => {
      message.success("Thanh toán hoàn tất thành công");
      removeLocalStorage("cartItems");
      removeLocalStorage("discountRate");
      removeLocalStorage("PromotionCode");
      window.location.reload();
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra, vui lòng thử lại !!!";
      toast.error(errorMessage);
      navigate("/payment-fail");
    },
  });

  const {
    mutate: handleSaveConsignment,
    isLoading: isHandleSaveConsignmentLoading,
    isError: isHandleSaveConsignmentError,
  } = useMutation({
    mutationFn: (consignmentID) =>
      CheckoutApi.saveConsignment(paymentCode, consignmentID),
    onSuccess: () => {
      message.success("Thanh toán hoàn tất thành công");
      removeLocalStorage("consignmentID");
      window.location.reload();
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra, vui lòng thử lại !!!";
      toast.error(errorMessage);
      navigate("/payment-fail");
    },
  });

  if (isHandleSaveOrderLoading || isHandleSaveConsignmentLoading) {
    return <LoadingModal />;
  }
  if (isHandleSaveOrderError || isHandleSaveConsignmentError) {
    return <div>Lỗi trong quá trình xử lý dữ liệu</div>;
  }

  const accountID = user?.id;
  const koiFishs = order
    ?.filter((item) => item.id !== undefined && item.id !== null)
    .map((item) => item.id);
  const price = order?.map((fish) => fish.price);
  const batchs = order
    ?.filter((item) => item.batchID !== undefined && item.batchID !== null)
    .map((item) => item.batchID);
  const quantity = order?.map((item) => item.quantity);

  let totalPrice = useSelector((state) => state.cart.total);
  totalPrice = totalPrice - totalPrice * +disCountRate;

  const data = {
    accountID,
    koiFishs,
    batchs,
    price,
    quantity,
    totalPrice,
    promoCode,
  };

  useEffect(() => {
    const consignmentID = localStorage.getItem("consignmentID");

    if (
      !hasCalledApi.current &&
      status === "1" &&
      paymentCode &&
      type !== null
    ) {
      if (type === "true" && order) {
        handleSaveOrder(data);
      } else if (type === "false" && consignmentID) {
        handleSaveConsignment(consignmentID);
      }
      hasCalledApi.current = true; // Đánh dấu đã gọi API

    }
    
  }, [status, paymentCode, type, order, data, handleSaveOrder, handleSaveConsignment]);

  return (
    <div className="flex flex-col items-center justify-center h-[600px] w-full">
      <div className="text-center text-3xl font-bold mb-10">
        <h1>Cảm ơn bạn, thanh toán hoàn tất</h1>
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
