import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Link } from "react-router-dom";

const PaymentManagement = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState()
  const queryClient = useQueryClient();
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const fetchOrder = async ({ queryKey }) => {
    const [_key, page, search] = queryKey;
    if (search) {
      return await orderApi.searchOrder(search, page);
    } else {
      return await orderApi.getAllOrder(page);
    }
  };


  const {
    data: ListOfOrder,
    isLoading: isLoadingListOfOrder,
    isError: isErrorListOfOrder,
  } = useQuery({
    queryKey: ["ListOfOrder", currentPage, debouncedQuery],
    queryFn: fetchOrder,
    keepPreviousData: true,
  });
  const { mutate: handleOrderStatusChange, isLoading: isLoadingChangeStatus, isError: isErrorChangeStatus } = useMutation({
    mutationFn: (id) => orderApi.changeStatusOrder(id, status),
    onSuccess: () => {
      message.success("Chỉnh sửa trạng thái thành công");
      queryClient.invalidateQueries(["ListOfOrder"]);
    },
    onError: (error) => {
      const errorMessage = error?.message || "Lỗi rồi!";
      message.error(errorMessage);
    },
  })
  const onStatusChange = (id) => {
    handleOrderStatusChange(id)
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
    {
      title: "Trạng thái thanh toán",
      key: "status",
      render: (text, record) => {

        return <Select
          defaultValue={record.status}
          onChange={(value) => {
            onStatusChange(record.orderId);
            setStatus(value);
          }}
          style={{ width: 150 }}
          options={[
            { value: 1, label: "Đã thanh toán" },
            { value: 2, label: "Đang giao" },
            { value: 3, label: "Hoàn tất đơn hàng" },

          ]}
        />
      },
    },
  ];
  const total = ListOfOrder?.data.totalElements;

  return (
    <div>
      <div className="flex flex-col justify-center items-center ">
        <div className="w-[450px]">
          <Search
            placeholder="Nhập mã giao dịch..."
            style={{ width: 300 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            allowClear
          />
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
              loading={isLoadingListOfOrder}
            />
            <div className="flex justify-end mt-2">
              <Pagination
                defaultCurrent={currentPage}
                total={total}
                pageSize={7}
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
