import { Table, Tag } from "antd";
import React from "react";

const PaymentHistoryPage = () => {
  const data = [
    {
      PaymentId: "1",
      PaymentDate: "2022-01-01",
      PaymentStatus: 1,
      transitionCode: 14599140,
      Amount: "100000000",
    },
    {
      PaymentId: "2",
      PaymentDate: "2022-01-01",
      PaymentStatus: 2,
      transitionCode: 14599141,
      Amount: "100000000",
    },
    {
      PaymentId: "3",
      PaymentDate: "2023-01-01",
      PaymentStatus: 3,
      transitionCode: 14599142,
      Amount: "320000000",
    },
    {
      PaymentId: "4",
      PaymentDate: "2022-01-01",
      PaymentStatus: 1,
      transitionCode: 14599143,
      Amount: "1032000000",
    },
    {
      PaymentId: "5",
      PaymentDate: "2022-01-01",
      PaymentStatus: 2,
      transitionCode: 14599144,
      Amount: "100000000",
    },
    {
      PaymentId: "6",
      PaymentDate: "2022-01-01",
      PaymentStatus: 3,
      transitionCode: 14599145,
      Amount: "320000000",
    },
    {
      PaymentId: "7",
      PaymentDate: "2022-01-01",
      PaymentStatus: 1,
      transitionCode: 14599146,
      Amount: "1032000000",
    },
    {
      PaymentId: "8",
      PaymentDate: "2022-01-01",
      PaymentStatus: 2,
      transitionCode: 14599147,
      Amount: "100000000",
    },
    {
      PaymentId: "9",
      PaymentDate: "2022-01-01",
      PaymentStatus: 3,
      transitionCode: 14599148,
      Amount: "320000000",
    },
  ];
  const columns = [
    {
      title: "Mã thanh toán",
      dataIndex: "PaymentId",
      align: "center",
    },
    {
      title: "Mã giao dịch",
      dataIndex: "transitionCode",
      render: (value) => {
        return <div className="font-bold">{value}</div>;
      },
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "PaymentDate",
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "PaymentStatus",
      width: "300px",
      render: (value) => {
        return (
          <div className="flex ms-10 justify-start items-center">
            <Tag
              color={value === 1 ? "green" : value === 2 ? "orange" : "blue"}
            >
              {value === 1
                ? "Đã thanh toán"
                : value === 2
                ? "Đang giao"
                : "Đã giao"}
            </Tag>
          </div>
        );
      },
    },

    {
      title: "Số tiền",
      dataIndex: "Amount",
      render: (amount) => (
        <span className="">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount)}
        </span>
      ),
    },
    {
      title: "Chi tiết",
      render: () => (
        <div>
          <button className="bg-blue-500 text-white font-bold py-1 px-3 rounded m-4">
            Xem chi tiết
          </button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="container flex justify-center items-center mx-auto">
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
