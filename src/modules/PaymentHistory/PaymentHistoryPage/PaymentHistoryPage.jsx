import { useQuery } from "@tanstack/react-query";
import { Pagination, Table, Tag } from "antd";
import React, { useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import orderApi from "../../../apis/Order.api";
import { getLocalStorage } from "../../../utils/LocalStorage";
import LoadingModal from "../../Modal/LoadingModal";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveOrderId } from "../../../Redux/Slices/Order_Slice";

moment.locale("vi");

const PaymentHistoryPage = () => {
  const user = getLocalStorage("user");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  const {
    data: orderData,
    isLoading: orderDataLoading,
    isError: orderDataError,
  } = useQuery({
    queryKey: ["orderData", currentPage],
    queryFn: () => orderApi.getOrderHistory(user?.id, currentPage, 9),
    keepPreviousData: true,
  });
  console.log("orderData: ", orderData);
  const orderContent = orderData?.data?.content;
  const total = orderData?.data?.totalElements;
  console.log("orderContent: ", orderContent);
  if (orderDataLoading) {
    return <LoadingModal />;
  }
  const columns = [
    {
      title: "Mã thanh toán",
      dataIndex: "paymentId",
      align: "center",
    },
    {
      title: "Mã giao dịch",
      dataIndex: "transactionCode",
      render: (value) => {
        return <div className="font-bold">{value}</div>;
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      render: (value) => {
        return <div className="font-bold">{value}</div>;
      },
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "createdDate",
      render: (createdDate) =>
        moment(createdDate).format("DD [tháng] M [năm] YYYY, h:mm:ss a"),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "status",
      width: "300px",
      render: (value) => {
        return (
          <div className="flex ms-10 justify-start items-center">
            <Tag color={value === true ? "orange" : "green"}>
              {value === true ? "Đang Giao" : "Đã hoàn tất"}
            </Tag>
          </div>
        );
      },
    },

    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      render: (totalPrice) => (
        <span className="">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalPrice)}
        </span>
      ),
    },
    {
      title: "Chi tiết",
      render: (payment) => (
        <div>
          <Link to={`/payment-detail/${payment?.orderId}`}>
            <button className="bg-blue-500 text-white font-bold py-1 px-3 rounded m-4">
              Xem chi tiết
            </button>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <div className="m-5">
      <div className="container flex justify-center items-center mx-auto flex-col">
        <div>
          <Table
            pagination={false}
            rowKey={(payment) => payment.paymentId}
            columns={columns}
            showSizeChanger={false}
            dataSource={orderContent}
          />
        </div>
        <div className="w-full flex justify-end me-[550px]">
          <Pagination
            className="mt-5 items-end"
            rowKey
            defaultCurrent={currentPage}
            total={total}
            onChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
