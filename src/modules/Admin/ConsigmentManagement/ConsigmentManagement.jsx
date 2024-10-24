import { useQuery } from "@tanstack/react-query";
import { Button, Pagination, Table, Tag, Tooltip } from "antd";
import Search from "antd/es/transfer/search";
import React, { useState } from "react";
import { ConsignmentApi } from "../../../apis/Consignment.api";
import { Link } from "react-router-dom";

const ConsigmentManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "consignmentID",
      key: "consignmentID",
    },
    {
      title: "Loại ký gửi",
      dataIndex: "consignmentType",
      key: "consignmentType",
      render: (consignmentType) => (
        <Tag color={consignmentType ? "green" : "blue"}>
          {consignmentType ? "Ký gửi bán" : "Ký gửi chăm sóc"}
        </Tag>
      ),
    },
    {
      title: "Người ký gửi",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số Điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tổng tiền",
      dataIndex: "agreedPrice",
      render: (data) => {
        const formattedPrice = data.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        return <div>{formattedPrice}</div>;
      },
    },
    {
      title: "Chi phí ký gửi",
      dataIndex: "serviceFee",
      key: "serviceFee",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let text = "Không xác định";
        let color = "default";

        switch (status) {
          case 1:
            text = "Đang chờ";
            color = "orange";
            break;
          case 2:
            text = "Đã duyệt";
            color = "blue";
            break;
          case 3:
            text = "Từ chối";
            color = "red";
            break;
          case 4:
            text = "Chờ thanh toán";
            color = "gold";
            break;
          case 5:
            text = "Quá hạn";
            color = "grey";
            break;
          default:
            text = "Không xác định";
            color = "default";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Hình thức ký gửi",
      dataIndex: "online",
      key: "online",
      render: (online) => (
        <Tag color={online ? "green" : "blue"}>
          {online ? "Online" : "Offline"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, record) =>
        record.status === 1 ? (
          <Link
            to={`/admin/consignment-management-detail/${record.consignmentID}`}
          >
            <Button type="primary">Duyệt đơn (xem chi tiết)</Button>
          </Link>
        ) : (
          <Tooltip title="Đơn ký gửi đã được xử lý">
            <Button type="default" disabled>
              Đã xử lý
            </Button>
          </Tooltip>
        ),
    },
  ];
  const {
    data: listOfConsignment,
    isLoading: isLoadingListConsignment,
    isError: isErrorListConsignment,
  } = useQuery({
    queryKey: ["listOfConsignment", currentPage],
    queryFn: () => ConsignmentApi.getAllConsignmentManagement(currentPage),
  });
  console.log("listOfConsignment: ", listOfConsignment);
  const total = listOfConsignment?.data?.totalElements;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[450px]">
        <Search
          placeholder="Nhập email để tìm kiếm..."
          value={[]}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <div className="flex flex-col mt-2 w-full">
        <div className="w-full">
          <Button
            onClick={showModal}
            danger
            className="flex justify-center items-center"
          >
            <span>+</span>
            Thêm người dùng
          </Button>
        </div>
        <div className="mt-3">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={listOfConsignment?.data?.content}
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
  );
};

export default ConsigmentManagement;
