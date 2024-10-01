import { Button } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const PaymentFailPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("paymentStatus");
  const navigate = useNavigate();
  useEffect(() => {
    if (status !== "0") {
      navigate("/");
    }
  });
  return (
    <div className="flex  flex-col items-center justify-center h-[600px] w-full">
      <div className="text-center text-3xl font-bold ">
        <h1>Thanh toán thất bại quay lại trang!!!</h1>
      </div>
      <div className="flex justify-center items-center">
        <Button
          style={{ backgroundColor: "#FA4444", color: "white" }}
          className="p-5"
        >
          <Link to="/cart">Đi đến giỏ hàng</Link>
        </Button>
        <Button className="ms-3 p-5">
          <Link to="/">Quay về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailPage;
