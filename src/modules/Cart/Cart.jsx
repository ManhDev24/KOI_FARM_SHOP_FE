import { Breadcrumb, Button, Form, Input, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  saveDiscountRate,
} from "../../Redux/Slices/Cart_Slice";
import { getLocalStorage, setLocalStorage } from "../../utils/LocalStorage";
import { useMutation, useQuery } from "@tanstack/react-query";
import CheckoutApi from "../../apis/Checkout.api";
import { toast } from "react-toastify";
import LoadingModal from "../Modal/LoadingModal";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Controller, useForm } from "react-hook-form";
import PromotionApi from "../../apis/Promotion";
import orderApi from "../../apis/Order.api";

const validationSchema = yup.object().shape({
  code: yup.string().required(""),
});

const Cart = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(0);
  const [disCountRate, setDisCountRate] = useState(0);

  const dispatch = useDispatch();

  const onCart = getLocalStorage("cartItems");
  const [dataSource, setDataSource] = useState(onCart);

  const totalPrice = onCart?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const user = getLocalStorage("user");
  const updateQuantity = (identifier, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      message.error("Số lượng phải là số nguyên lớn hơn hoặc bằng 1.");
      return;
    }

    const updatedData = dataSource.map((item) => {
      if (
        (item.id && item.id === identifier) ||
        (item.batchID && item.batchID === identifier)
      ) {
        return { ...item, quantity: parsedQuantity };
      }
      return item;
    });

    setDataSource(updatedData);
    localStorage.setItem("cartItems", JSON.stringify(updatedData));
    message.success("Cập nhật số lượng thành công!");
  };
 const isBuy =true;
  const finalPrice = totalPrice - totalPrice * disCountRate;

  const navigate = useNavigate();
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
    },
    resolver: yupResolver(validationSchema),
    criteriaMode: "all",
    mode: "onBlur",
  });

  const {
    mutate: handleSaveOrder,
    isLoading: isOrdering,
    isError: isOrderError,
  } = useMutation({
    mutationFn: (data) => CheckoutApi.saveOrder(data),
    onSuccess: (data) => {
      message.success("Đặt hàng thành công");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
       message.error(errorMessage)
    },
  });
  const {
    mutate: handlePayOrderByVnPay,
    isLoading: isVnPayLoading,
    isError: isVnPayError,
  } = useMutation({

    mutationFn: (amount) => CheckoutApi.payByVnPay(amount,"NCB",true),

    onSuccess: (data) => {
      window.location.assign(data.data.paymentUrl);
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
       message.error(errorMessage)
    },
  });
  const {
    mutate: handleApplyPromotion,
    isLoading: isPromotionLoading,
    isError: isPromotionError,
  } = useMutation({
    mutationFn: (promoCode) => PromotionApi.applyPromotion(promoCode, user?.id),
    onSuccess: (data) => {
      setDisCountRate(data?.data?.discountRate);
      setLocalStorage("discountRate", data.data.discountRate);
      setLocalStorage("PromotionCode", data?.data?.promoCode);
      message.success("Áp dụng khuyến mãi thành công");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
       message.error(errorMessage)
    },
  });
  if (isOrderError || isVnPayError) {
    return <div>Lỗi rồi</div>;
  }
  if (isVnPayLoading || isOrdering || isPromotionLoading) {
    return <LoadingModal />;
  }

  const handleOrder = () => {
    if (!finalPrice || isVnPayLoading) return; 
  handlePayOrderByVnPay(finalPrice);
  };
  const handleDelete = (fish) => {
    dispatch(removeFromCart(fish));
    window.location.reload();
  };
  const onSubmitPromotionCode = (data) => {
    if (onCart?.length == null) {
      toast.error("Không có cá để áp dụng khuyến mãi");
      return;
    }
    handleApplyPromotion(data.code);
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
            {data.isBatch
              ? `Lô ${data.categoryName} - Kích thước trung bình: ${data.avgSize} - Tuổi: ${data.age}`
              : `${data.category} - Kích thước: ${data.size} - Tuổi: ${data.age} tuổi`}
          </h3>
          {!data.isBatch && (
            <>
              <p>Giới tính: {data.gender ? "Nam" : "Nữ"}</p>
              <p>Người bán: {data.seller}</p>
            </>
          )}
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
          {data.isBatch ? (
            <Input
              style={{ border: "1px solid #EA4444" }}
              className="w-[60px] h-[30px] text-center"
              value={data.quantity}
              onChange={(e) => {
                const newQuantity = e.target.value;
                updateQuantity(data.id || data.batchID, newQuantity);
              }}
            />
          ) : (
            <span className="w-[60px] h-[30px] text-center inline-block">
              {data.quantity}
            </span>
          )}
        </div>
      ),
      width: "150px",
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
              {data.price}
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
                <Form onFinish={handleSubmit(onSubmitPromotionCode)}>
                  <div className="flex flex-col justify-center p-3 w-full ">
                    <div className="mb-3">
                      <p className="text-xl font-semibold text-start">
                        Mã giảm giá
                      </p>
                    </div>
                    <div>
                      <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            status={errors.code ? "error" : ""}
                            style={{ border: "1px solid #EA4444" }}
                            placeholder="Nhập mã giảm giá"
                            className="w-full h-[40px]"
                          />
                        )}
                      />
                    </div>
                  </div>
                </Form>
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
                      <span className="text-lg font-bold">
                        {" "}
                        {disCountRate == 0 ? 0 : disCountRate * 100}%
                      </span>
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
                          {finalPrice
                            ? finalPrice.toLocaleString("vi-VN", {
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
