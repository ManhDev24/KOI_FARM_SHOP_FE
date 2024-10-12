import { useQuery } from "@tanstack/react-query";
import { Pagination, Table } from "antd";
import React from "react";
import orderApi from "../../../apis/Order.api";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../Modal/LoadingModal";
import { useParams } from "react-router-dom";

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
    dataIndex: "price",
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

  const { paymentId } = useParams();

  console.log("orderId: ", orderId);
  const {
    data: orderDetail,
    isLoading: orderDetailLoading,
    isError: orderDetailError,
  } = useQuery({
    queryKey: ["orderDetail"],
    queryFn: () => orderApi.getOrderDetail(paymentId),
    keepPreviousData: true,
  });
  const orderDetailData = orderDetail?.data;
  if (orderDetailLoading) {
    return <LoadingModal />;
  }

  if (orderDetailError) {
    return <div>Lỗi rồi</div>;
  }
  return (
    <div>
      <div className="container flex justify-center items-center mx-auto">
        <Table columns={columns} dataSource={orderDetailData} />
      </div>
    </div>
  );
};

export default PaymentDetailPage;
