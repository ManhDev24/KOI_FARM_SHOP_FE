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
      render: (data) => {
        const formattedFee = data.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        return <div>{formattedFee}</div>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Đang chờ", value: 1 },
        { text: "Đã duyệt", value: 2 },
        { text: "Từ chối", value: 3 },
        { text: "Chờ thanh toán", value: 4 },
        { text: "Quá hạn", value: 5 },
      ],
      onFilter: (value, record) => record.status === value,
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
      render: (_, record) => {
        if (record?.status === 3) {
          return (
            <Tooltip title="Đơn ký gửi đã bị hủy">
              <Button type="default" disabled>
                Đã hủy đơn
              </Button>
            </Tooltip>
          );
        } else if (record?.status === 4) {
          return <></>
        }
        else {
          return (
            <Link
              to={`/admin/consignment-management-detail/${record.consignmentID}`}
            >
              <Button type="primary">Duyệt đơn (xem chi tiết)</Button>
            </Link>
          );
        }
      },
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

  const total = listOfConsignment?.data?.totalElements;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[450px]">
        <Search
          placeholder="Nhập email để tìm kiếm..."
          value={[]}

          style={{ width: 300 }}
          allowClear
        />
      </div>
      <div className="flex flex-col mt-2 w-full">
        <div className="w-full">

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
