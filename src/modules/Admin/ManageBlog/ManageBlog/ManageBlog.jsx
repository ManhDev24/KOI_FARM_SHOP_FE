import React, { useState } from "react";
import {
  Table,
  Image,
  Tag,
  Pagination,
  Button,
  Input,
  Space,
  Dropdown,
  Menu,
  message,
} from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BlogApi from "../../../../apis/Blog.api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../../Modal/LoadingModal";

const { Search } = Input;

const ManageBlog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetching all blog data with pagination
  const {
    data: ListBlog,
    isLoading: isBlogLoading,
    isError: isBlogError,
  } = useQuery({
    queryKey: ["ListBlog", currentPage],
    queryFn: () => BlogApi.getAllBlog(currentPage, 9),
    keepPreviousData: true,
  });

  // Mutation to change blog status
  const {
    mutate: changeStatus,
    isPending: isChangeStatusPending,
    isLoading: isChangeStatus,
  } = useMutation({
    mutationFn: (id) => BlogApi.changeStatus(id, status),
    onSuccess: () => {
      message.success("Thay đổi trạng thái thành công!");
      queryClient.invalidateQueries(["ListBlog", currentPage]);
    },
    onError: (error) => {
      const errorMessage = error?.message || "Đã có lỗi xảy ra!";
      message.error(errorMessage);
    },
  });
  const { mutate: handleDeleteBlog, isPending: isDeleteBlogPending, isLoading: isDeleteBlog } = useMutation({
    mutationFn: (id) => BlogApi.deleteBlog(id),
    onSuccess: () => {
      message.success("Xóa bài viết thành công!");
      queryClient.invalidateQueries(["ListBlog", currentPage]);
    },
    onError: (error) => {
      const errorMessage = error?.message || "Đã có lỗi xảy ra!";
      message.error(errorMessage);
    },
  })

  // Defining table columns
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tác giả",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Ngày đăng",
      dataIndex: "postDate",
      key: "postDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "blogImg",
      render: (text, record) => (
        <Image width={100} src={record.blogImg} alt="Blog Image" />
      ),
    },
    {
      title: "Mô tả ngắn",
      dataIndex: "subTitle",
      key: "subTitle",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Đã xuất bản" : "Nháp"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        // Handling menu clicks for status change
        const handleMenuClick = (e) => {
          setStatus(+e.key);
          changeStatus(record.blogId);
        };

        const menuItems = [
          { label: "Public", key: "1" },
          { label: "Draft", key: "0" },
        ];

        return (
          <Space size="middle">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                navigate(`/admin/blog-review/${record?.blogId}`);
              }}
            >
              Xem
            </Button>

            {/* Dropdown for changing status */}
            <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
              <Button icon={<EditOutlined />}>Chuyển trạng thái</Button>
            </Dropdown>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`/admin/blog-edit/${record?.blogId}`);
              }}
            >
              Sửa
            </Button>
            <Button
              style={{
                backgroundColor: "#ff4d4f",
                color: "white",
              }}
              onClick={() => handleDeleteBlog(record?.blogId)}
              icon={<DeleteOutlined />}
              danger
            >
              Xóa
            </Button>
          </Space>
        );
      },
    },
  ];

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isBlogError || isChangeStatus) {
    return <div>Đã xảy ra lỗi khi tải dữ liệu.</div>;
  }

  if (isChangeStatusPending) {
    return <LoadingModal />;
  }

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="w-[450px] mb-4">
        <Search
          placeholder="Nhập tiêu đề để tìm kiếm..."
          style={{ width: "100%" }}
          allowClear
        />
      </div>

      <div className="flex flex-col w-full">
        <div className="w-full mb-3">
          <Button
            onClick={() => alert("Thêm bài viết!")}
            danger
            className="flex justify-center items-center"
          >
            <span>+</span> Thêm bài viết
          </Button>
        </div>

        <div className="mt-3">
          <Table
            rowKey="blogId"
            columns={columns}
            dataSource={ListBlog?.data?.content || []}
            loading={isBlogLoading}
            pagination={false}
            bordered
          />
          <div className="flex justify-end mt-2">
            <Pagination
              current={currentPage}
              total={ListBlog?.data?.totalElements || 0}
              pageSize={9}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBlog;
