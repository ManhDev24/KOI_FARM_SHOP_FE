import { useQuery } from "@tanstack/react-query";
import { Button, Pagination, Table } from "antd";
import React from "react";
import orderApi from "../../../apis/Order.api";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../Modal/LoadingModal";
import { useNavigate, useParams } from "react-router-dom";




const PaymentDetailPage = () => {
  const columns = [
    {
      title: "Tên Cá Koi",
      dataIndex: "koiFishId",
      render: (text, record) => {
        return record?.type
          ? `${record.categoryName} - ${record.koiSize} cm - ${record.koiAge} tuổi`
          : `${record.categoryName} - ${record.avgSize} cm - ${record.batchAge} tuổi `;
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
      render: (koiAge) => (koiAge ? `${koiAge} tuội` : "Tuổi theo lô"),
    },
    {
      title: "Giới Tính",
      dataIndex: "gender",

      render: (_, record) => {
        return record?.type
          ? record?.gender
            ? "Koi đực"
            : "Koi cái"
          : "Ngẫu nhiên";
      },
    },
    {
      title: "Kích Cỡ Cá Koi",
      dataIndex: "koiSize",
      render: (_, record) => {
        return record?.type ? `${record?.koiSize} cm` : `${record?.avgSize} cm`;
      },
    },
    {
      title: "Giá Cá Koi",
      dataIndex: "price",
      render: (_, record) => {
        const formattedPrice = record?.price
          ? new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(record.price)
          : "0 ₫";
        return record?.type ? formattedPrice : "0 ₫";
      },
    },
    {
      title: "Giá Batch",
      dataIndex: "batchPrice",
      render: (_, record) => {
        const formattedPrice = record?.price
          ? new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(record.price)
          : "0 ₫";
        return record?.type ? "0 ₫" : formattedPrice;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Đăng ký ký gửi",
      dataIndex: "action",
      render: (_, record) => (
        record.type ? <Button onClick={() => handleConsignment(record.koiFishId)}>Ký gửi</Button> : <></>

      ),
    }
  ];
  const navigate = useNavigate();
  // const { orderId } = useSelector((state) => state.order);
  const handleConsignment = (id) => {
    localStorage.setItem('fishConsignmentID', id);
    navigate('/Form-consignment')

  }
  const { orderId } = useParams();

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
  console.log("orderDetailData: ", orderDetailData);
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
