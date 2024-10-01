import { Breadcrumb, Button, Input, Table } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../Redux/Slices/Cart_Slice";
import { getLocalStorage } from "../../utils/LocalStorage";
import { useMutation, useQuery } from "@tanstack/react-query";
import CheckoutApi from "../../apis/Checkout.api";
import { toast } from "react-toastify";
import LoadingModal from "../Modal/LoadingModal";
const Cart = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const dispatch = useDispatch();
  const totalPrice = useSelector((state) => state.cart.total);
  const onCart = getLocalStorage("cartItems");
  console.log("onCart: ", onCart);
  const user = getLocalStorage("user");

  const navigate = useNavigate();

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleDelete = (fish) => {
    dispatch(removeFromCart(fish));
  };
  const {
    mutate: handleSaveOrder,
    isLoading: isOrdering,
    isError: isOrderError,
  } = useMutation({
    mutationFn: (data) => CheckoutApi.saveOrder(data),
    onSuccess: (data) => {
      toast.success("Đặt hàng thành công");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
      toast.error(errorMessage);
    },
  });
  const {
    mutate: handlePayOrderByVnPay,
    isLoading: isVnPayLoading,
    isError: isVnPayError,
  } = useMutation({
    mutationFn: (amount) => CheckoutApi.payByVnPay(amount),
    onSuccess: (data) => {
      console.log("data: ", data);

      window.location.assign(data.data.paymentUrl);
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
      toast.error(errorMessage);
    },
  });
  if (isOrderError || isVnPayError) {
    return <div>Lỗi rồi</div>;
  }
  if (isVnPayLoading || isOrdering) {
    return <LoadingModal />;
  }

  const handleOrder = () => {
    handlePayOrderByVnPay(totalPrice);
  };
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "koiImage",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgba(234, 68, 68, 0.20)",
          textAlign: "center",
        },
      }),
      render: (imgL) => (
        <img className="h-[100px] w-[100px]" src={imgL} alt="" />
      ),
      width: "150px",
    },
    {
      title: "Mô tả",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgba(234, 68, 68, 0.20)",
          textAlign: "center",
        },
      }),
      render: (data) => (
        <div>
          <h3 style={{ color: "#EA4444" }} className="text-xl font-medium">
            {data.category} {data.size} {data.age} tuổi
          </h3>
          <p>Giới tính: {data.gender}</p>
          <p>Người bán: {data.seller}</p>
          <p>Nguồn gốc: {data.origin}</p>
        </div>
      ),
      width: "350px",
    },
    {
      title: "Số lượng",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgba(234, 68, 68, 0.20)",
          textAlign: "center",
        },
      }),
      render: (data) => (
        <div className="flex justify-center items-center">
          <Input
            style={{ border: "1px solid #EA4444" }}
            className="w-[60px] h-[30px] text-center"
            value={data.quantity}
          />
        </div>
      ),
    },
    {
      title: "Giá",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgba(234, 68, 68, 0.20)",
          textAlign: "center",
        },
      }),
      render: (data) => (
        <div>
          <div className="flex justify-end">
            <p>
              {data.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Xóa",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgba(234, 68, 68, 0.20)",
          textAlign: "center",
        },
      }),
      render: (data) => (
        <div>
          <div
            onClick={() => handleDelete(data)}
            style={{ border: "1px solid #EA4444" }}
            className="w-[60px] h-[30px] flex justify-center items-center cursor-pointer"
          >
            <svg
              style={{ color: "#EA4444" }}
              className="h-[20px] w-[20px]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex  items-center flex-col mb-5 ">
        <div
          style={{ backgroundColor: "#FFF8F8" }}
          className="w-[950px] h-[30px] flex items-center ps-3 mb-5 me-[550px] "
        >
          <Breadcrumb
            separator=">"
            className="flex justify-center items-center font-bold text-lg m-3"
          >
            <Breadcrumb.Item>
              <Link to="/" style={{ color: "#EA4444" }} className="">
                Home
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link style={{ color: "#EA4444" }} className="">
                Cart
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="text-center mb-5">
          <p
            style={{ color: "#EA4444" }}
            className="text-2xl font-bold me-[400px]"
          >
            GIỎ HÀNG
          </p>
        </div>
        <div className="cart grid grid-cols-12 mb-5 container">
          <div className="col-span-8">
            <Table
              rowKey="id"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={onCart}
              pagination={false}
            />
          </div>
          <div className="ms-10">
            <div className="flex flex-col">
              <div
                style={{
                  backgroundColor: "rgba(234, 68, 68, 0.20)",
                }}
                className="w-[250px] h-[54px] flex justify-center items-center mb-10"
              >
                <p className="text-xl text-center font-semibold">Thanh toán</p>
              </div>
              <div
                style={{ border: "1px solid #EA4444" }}
                className="w-[250px] h-[125px] flex mb-10 "
              >
                <div className="flex flex-col justify-center p-3 w-full ">
                  <div className="mb-3">
                    <p className="text-xl font-semibold text-start">
                      Mã giảm giá
                    </p>
                  </div>
                  <div>
                    <Input
                      style={{ border: "1px solid #EA4444" }}
                      placeholder="Nhập mã giảm giá"
                      className="w-full h-[40px]"
                    />
                  </div>
                </div>
              </div>
              <div
                style={{ border: "1px solid #EA4444" }}
                className="w-[250px] h-[250px]"
              >
                <div className="p-3 flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div>
                      <span
                        style={{ color: "#EA4444" }}
                        className="text-lg me-2"
                      >
                        Thành Tiền:
                      </span>
                    </div>
                    <div>
                      <span className="text-lg font-bold">
                        {totalPrice
                          ? totalPrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span
                        style={{ color: "#EA4444" }}
                        className="text-lg me-2"
                      >
                        Giảm giá:
                      </span>
                    </div>
                    <div>
                      <span className="text-lg font-bold">0</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <span
                          style={{ color: "#EA4444" }}
                          className="text-lg me-2"
                        >
                          Tổng tiền phải trả:
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-xl font-bold">
                          {totalPrice
                            ? totalPrice.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  {user && onCart ? (
                    <div className="flex justify-center items-center">
                      <Button
                        onClick={() => {
                          handleOrder();
                        }}
                        style={{
                          backgroundColor: "#EA4444",
                          borderColor: "#EA4444",
                          color: "white",
                        }}
                        className="w-1/2 h-[40px] hover:bg-[#EA4444] hover:border-[#EA4444] hover:text-white"
                      >
                        Thanh Toán
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[#EA4444]">
                        Vui lòng đăng nhập hoặc mua cá để thanh toán
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
