import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import CheckoutApi from "../../../apis/Checkout.api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, message, Steps } from "antd";
import {
  getLocalStorage,
  removeLocalStorage,
} from "../../../utils/LocalStorage";
import { useSelector } from "react-redux";
import LoadingModal from "../../Modal/LoadingModal";

const ThankPage = () => {
  const hasCalledApi = useRef(false);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("paymentStatus");
  const type = searchParams.get("type");
  const navigate = useNavigate();

  // State to track if the operation was successful
  const [isSuccess, setIsSuccess] = useState(false);

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
    isPending: isHandleSaveOrderPending,
    isError: isHandleSaveOrderError,
  } = useMutation({
    mutationFn: (data) => CheckoutApi.saveOrder(data, paymentCode),
    onSuccess: () => {
      message.success("Thanh toán hoàn tất thành công");
      removeLocalStorage("cartItems");
      removeLocalStorage("discountRate");
      removeLocalStorage("PromotionCode");
      // navigate("/thank-you"); // Remove navigation here
      setIsSuccess(true); // Set success state
      window.location.reload();
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra, vui lòng thử lại !!!";
      message.error(errorMessage);
      navigate("/payment-fail");
    },
  });

  const {
    mutate: handleSaveConsignment,
    isPending: isHandleSaveConsignmentPending,
    isError: isHandleSaveConsignmentError,
  } = useMutation({
    mutationFn: (consignmentID) =>
      CheckoutApi.saveConsignment(paymentCode, consignmentID),
    onSuccess: () => {
      message.success("Thanh toán hoàn tất thành công");
      removeLocalStorage("consignmentID");
      removeLocalStorage("fishConsignmentID");
      removeLocalStorage("agreedToPolicy");
      // navigate("/thank-you"); // Remove navigation here
      setIsSuccess(true); // Set success state
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra, vui lòng thử lại !!!";
      message.error(errorMessage);
      navigate("/payment-fail");
    },
  });

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

  const consignmentIDFromStore = useSelector(
    (state) => state.consignmentDetail.consignmentID
  );

  useEffect(() => {
    const consignmentIDFromLocalStorage = localStorage.getItem("consignmentID");
    const consignmentID =
      type === "false"
        ? consignmentIDFromStore || consignmentIDFromLocalStorage
        : null;

    if (
      !hasCalledApi.current &&
      status === "1" &&
      paymentCode &&
      type !== null
    ) {
      if (type === "true" && order) {
        localStorage.setItem("agreedToPolicy", false);
        handleSaveOrder(data);
      } else if (type === "false" && consignmentID) {
        localStorage.setItem("agreedToPolicy", false);
        handleSaveConsignment(consignmentID);
      }
      hasCalledApi.current = true; // Mark API call as done
    }
  }, [
    status,
    paymentCode,
    type,
    order,
    data,
    handleSaveOrder,
    handleSaveConsignment,
    consignmentIDFromStore,
  ]);

  if (isHandleSaveOrderError || isHandleSaveConsignmentError) {
    navigate("/payment-fail");
  }
  const description = "Chính sách ký gửi";
  const description1 = "Điền thông tin ký gửi";
  const description2 = "Trạng thái duyệt đơn ký gửi";
  const description3 = "Thanh toán";
  const description4 = "Hoàn tất";
  // Check loading state
  if (isHandleSaveConsignmentPending) {
    return (
      <>
        <div className="w-full max-w-[950px] h-full relative mx-auto my-0 p-4">
       
            <Steps current={5} status="process">
              <Steps.Step title="&nbsp;" description={description} />
              <Steps.Step title="&nbsp;" description={description1} />
              <Steps.Step title="&nbsp;" description={description2} />
              <Steps.Step title="&nbsp;" description={description3} />
              <Steps.Step title="&nbsp;" description={description4} />
            </Steps>
         
        </div>
        <div className=" w-full h-[70vh] flex justify-center items-center">
          <LoadingModal isLoading={true} />
          Đang xử lý thanh toán ký gửi
        </div>
      </>
    );
  }
  if (isHandleSaveOrderPending) {
    return (
      <div className=" w-full h-[70vh] flex justify-center items-center">
        <LoadingModal isLoading={true} />
        Đang xử lý thanh toán đơn hàng
      </div>
    );
  }

  if (!isSuccess) {
    // If not successful yet, you can return null or a placeholder
    return null;
  }


  return type === "true" ? (
    // Content for type === "true"
    <div className="flex flex-col items-center justify-center h-[70vh] w-full">
      <div className="text-center text-3xl font-bold mb-10">
        <h1>Cảm ơn bạn, thanh toán hoàn tất</h1>
      </div>
      <div className="flex justify-center items-center">
        <Link to="/koiList">
          <Button
            style={{ backgroundColor: "#FA4444", color: "white" }}
            className="p-5"
          >
            Tiếp tục mua cá koi nào
          </Button>
        </Link>
        <Link to="/" className="ms-3">
          <Button className="p-5">Quay về trang chủ</Button>
        </Link>
      </div>
    </div>
  ) : (
    // Content for type !== "true"
    <div className="w-full max-w-[950px] relative mx-auto p-4">
      {/* Steps Component */}
      <div className="w-full max-w-[950px] h-full relative mx-auto my-0 p-4">
        <Steps current={5} status="process">
          <Steps.Step title="&nbsp;" description={description} />
          <Steps.Step title="&nbsp;" description={description1} />
          <Steps.Step title="&nbsp;" description={description2} />
          <Steps.Step title="&nbsp;" description={description3} />
          <Steps.Step title="&nbsp;" description={description4} />
        </Steps>
      </div>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-[50vh] w-full">
        <div className="text-center text-3xl font-bold mb-10">
          <h1>Cảm ơn bạn, Ký gửi hoàn tất</h1>
        </div>
        <div className="flex justify-center items-center">
          <Link to="/request-consignment">
            <Button
              style={{ backgroundColor: "#FA4444", color: "white" }}
              className="p-5"
            >
              Tiếp tục ký gửi
            </Button>
          </Link>
          <Link to="/" className="ms-3">
            <Button className="p-5">Quay về trang chủ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default ThankPage;
