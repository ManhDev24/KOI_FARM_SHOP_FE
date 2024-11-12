import { useQuery } from "@tanstack/react-query";
import { Button, Image, Pagination, Table } from "antd";
import React, { useEffect } from "react";
import orderApi from "../../../apis/Order.api";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../Modal/LoadingModal";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
      title: "Ảnh cá",
      dataIndex: "koiImg",
      render: (batchImg, record) => <Image src={batchImg || record?.batchImg} width={80} height={80} className="w-4 h-4" />,
    },

    {
      title: "Chủng loại",
      dataIndex: "categoryName",
    },

    {
      title: "Tuổi Cá Koi",
      dataIndex: "koiAge",
      render: (koiAge) => (koiAge ? `${koiAge} Tuổi` : "Tuổi theo lô"),
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
      title: "Giá Lô cá",
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

  ];
  const navigate = useNavigate();
  // const { orderId } = useSelector((state) => state.order);
  const handleConsignment = (id) => {
    // const consignmentId = localStorage.getItem('consignmentID');
    // const consignmentIdF = localStorage.getItem('fishConsignmentID');
    // let consignmentID = null
    // if (typeof consignmentId === 'string' || consignmentID === '') {

    //   toast.error('')
    // } else if (consignmentIdF) {

    //   toast.error('exit consignment')
    // } else {

    // }
    localStorage.setItem("fishConsignmentID", id);
    navigate("/Form-consignment");
  };
  const { orderId } = useParams();

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
  console.log('orderDetailData: ', orderDetailData);
  if (orderDetailData[0].type) {
    const imageColumn = {
      title: "Ảnh chứng chỉ",
      dataIndex: "koiImg",
      render: (_, record) => (
        record?.certification?.image || record?.batchImg ? (
          <Image
            src={record.certification?.image || record?.batchImg}
            width={80}
            height={80}
            className="w-4 h-4"
          />
        ) : (
          <div style={{ width: 80, height: 80 }} className="flex items-center justify-center bg-gray-200">
            No Image
          </div>
        )
      ),
    };
    const registerConsigment = {
      title: "Đăng ký ký gửi",
      dataIndex: "action",
      render: (_, record) => (
        record.type === true ? <Button onClick={() => handleConsignment(record.koiFishId)}>Ký gửi</Button> : <></>

      ),
    }
    columns.splice(2, 0, imageColumn);
    columns.push(registerConsigment)
  }
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
