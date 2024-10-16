import React, { useState } from "react";
import {
  Button,
  Col,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Table,
  Tag,
} from "antd";
import Search from "antd/es/transfer/search";
import LoadingModal from "../../Modal/LoadingModal";
import orderApi from "../../../apis/Order.api";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Link } from "react-router-dom";

const PaymentManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: ListOfOrder,
    isLoading: isLoadingListOfOrder,
    isError: isErrorListOfOrder,
  } = useQuery({
    queryKey: ["ListOfOrder"],
    queryFn: () => orderApi.getAllOrder(currentPage, 9),
    keepPreviousData: true,
  });
  console.log("ListOfOrder: ", ListOfOrder);
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
      title: "Tên người thanh toán",
      dataIndex: "fullName",
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
        let tagColor;
        let tagText;

        switch (value) {
          case 1:
            tagColor = "blue";
            tagText = "Đã thanh toán";
            break;
          case 2:
            tagColor = "orange";
            tagText = "Đang giao";
            break;
          case 3:
            tagColor = "green";
            tagText = "Hoàn tất đơn hàng";
            break;
          default:
            tagColor = "default";
            tagText = "Không xác định";
        }

        return (
          <div className="flex ms-10 justify-start items-center">
            <Tag color={tagColor}>{tagText}</Tag>
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
          <Link to={`/admin/payment-management-detail/${payment?.orderId}`}>
            <button className="bg-blue-500 text-white font-bold py-1 px-3 rounded m-4">
              Xem chi tiết
            </button>
          </Link>
        </div>
      ),
    },
  ];
  const total = ListOfOrder?.data.totalElements;
  return (
    <div>
      <div className="flex flex-col justify-center items-center ">
        <div className="w-[450px]">
          <Search placeholder="Nhập tên hoặc email..." style={{ width: 300 }} />
        </div>
        <div className="flex flex-col mt-2 w-full">
          {/* <div className="w-full">
          <Button
            onClick={showModal}
            danger
            className="flex justify-center items-center"
          >
            <span>+</span>
            Thêm người dùng
          </Button>
        </div> */}
          <div className="mt-3">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={ListOfOrder?.data.content}
              pagination={false}
            />
            <div className="flex justify-end mt-2">
              <Pagination
                defaultCurrent={currentPage}
                total={total}
                pageSize={9}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
