import { useQuery } from "@tanstack/react-query";
import { Pagination, Table } from "antd";
import React from "react";
import orderApi from "../../../apis/Order.api";
import { useDispatch, useSelector } from "react-redux";

const data = [
  {
    koiFishId: 1,
    categoryName: "Koi karashi",
    koiAge: 4,
    gender: false,
    koiSize: 70,
    koiImage: "./img/showa3.webp",
    batchId: 0,
    koiPrice: 10000000,
    batchPrice: 0,
    quantity: 1,
  },
  {
    koiFishId: 2,
    categoryName: "Koi karashi",
    koiAge: 6,
    gender: true,
    koiSize: 70,
    koiImage: "./img/showa3.webp",
    batchId: 0,
    koiPrice: 12300000,
    batchPrice: 0,
    quantity: 1,
  },
  {
    koiFishId: 3,
    categoryName: "Koi Showa",
    koiAge: 20,
    gender: true,
    koiSize: 23,
    koiImage: "./img/showa3.webp",
    batchId: 0,
    koiPrice: 1000000,
    batchPrice: 0,
    quantity: 1,
  },
  {
    koiFishId: 4,
    categoryName: "Koi Showa",
    koiAge: 20,
    gender: true,
    koiSize: 23,
    koiImage: "./img/showa3.webp",
    batchId: 0,
    koiPrice: 1000000,
    batchPrice: 0,
    quantity: 1,
  },
  {
    koiFishId: 5,
    categoryName: "Koi Showa",
    koiAge: 15,
    gender: true,
    koiSize: 23,
    koiImage: "./img/showa3.webp",
    batchId: 0,
    koiPrice: 1030000,
    batchPrice: 0,
    quantity: 1,
  },
  {
    koiFishId: 6,
    categoryName: "Koi Showa",
    koiAge: 15,
    gender: true,
    koiSize: 23,
    koiImage: "./img/showa3.webp",
    batchId: 0,
    koiPrice: 1030000,
    batchPrice: 0,
    quantity: 1,
  },
  {
    koiFishId: 7,
    categoryName: "Koi Showa",
    koiAge: 15,
    gender: true,
    koiSize: 23,
    koiImage: "./img/showa3.webp",
    batchId: 0,
    koiPrice: 1030000,
    batchPrice: 0,
    quantity: 1,
  },
];

const columns = [
  {
    title: "Tên Cá Koi",
    dataIndex: "koiFishId",
    render: (text, record) => {
      return `${record.categoryName} - ${record.koiSize}cm - ${record.koiAge} tuổi`;
    },
  },
  {
    title: "Hình Ảnh",
    dataIndex: "koiImg",
    render: (image) => <img src={image} className="w-16 h-16" />,
  },
  {
    title: "Chủng loại",
    dataIndex: "categoryName",
  },

  {
    title: "Tuổi Cá Koi",
    dataIndex: "koiAge",
  },
  {
    title: "Giới Tính",
    dataIndex: "gender",
    render: (gender) => (gender ? "Koi đực" : "Koi cái"),
  },
  {
    title: "Kích Cỡ Cá Koi",
    dataIndex: "koiSize",
    render: (koiSize) => `${koiSize} cm`,
  },
  {
    title: "Giá Cá Koi",
    dataIndex: "koiPrice",
    render: (price) => (
      <span className="">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price)}
      </span>
    ),
  },
  {
    title: "Giá Batch",
    dataIndex: "batchPrice",
    render: (batchPrice) => (batchPrice ? batchPrice : "Không mua theo lô"),
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
];

const PaymentDetailPage = () => {
  const dispatch = useDispatch();
  const { orderId } = useSelector((state) => state.order);
  console.log("orderId: ", orderId);
  const {
    data: orderDetail,
    isLoading: orderDetailLoading,
    isError: orderDetailError,
  } = useQuery({
    queryKey: ["orderDetail"],
    queryFn: () => orderApi.getOrderDetail(orderId),
    keepPreviousData: true,
  });
  const orderDetailData = orderDetail?.data;
  return (
    <div>
      <div className="container flex justify-center items-center mx-auto">
        <Table columns={columns} dataSource={orderDetailData} />
      </div>
    </div>
  );
};

export default PaymentDetailPage;
