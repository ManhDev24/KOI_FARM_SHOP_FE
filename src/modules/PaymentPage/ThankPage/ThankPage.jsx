import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import CheckoutApi from "../../../apis/Checkout.api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, message } from "antd";
import {
  getLocalStorage,
  removeLocalStorage,
} from "../../../utils/LocalStorage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../Redux/Slices/Cart_Slice";
import LoadingModal from "../../Modal/LoadingModal";

const ThankPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("paymentStatus");
  const navigate = useNavigate();
  useEffect(() => {
    if (status !== "1") {
      navigate("/");
    }
  }, [status, navigate]);

  const dispatch = useDispatch();
  const paymentCode = searchParams.get("paymentCode");
  const disCountRate = getLocalStorage("discountRate");
  const promoCode = getLocalStorage("PromotionCode");
  console.log("disCountRate: ", disCountRate);
  const user = getLocalStorage("user");
  const order = getLocalStorage("cartItems");
  const {
    mutate: handleSaveOrder,
    isLoading: isHandleSaveOrderLoading,
    isError: isHandleSaveOrderError,
  } = useMutation({
    mutationFn: (data) => CheckoutApi.saveOrder(data, paymentCode),
    onSuccess: (data) => {
      message.success("Thanh toán hoàn tất thành công");
      removeLocalStorage("cartItems");
      removeLocalStorage("discountRate");
      removeLocalStorage("PromotionCode");
      window.location.reload();
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
      toast.error(errorMessage);
      navigate("/payment-fail");
    },
  });
  if (isHandleSaveOrderLoading) {
    return <LoadingModal />;
  }
  if (isHandleSaveOrderError) {
    return <div>Lỗi rồi</div>;
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
  console.log('quantity: ', quantity);
  let totalPrice = useSelector((state) => state.cart.total);
  totalPrice = totalPrice - totalPrice * +disCountRate;
  console.log("totalPrice: ", totalPrice);
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
