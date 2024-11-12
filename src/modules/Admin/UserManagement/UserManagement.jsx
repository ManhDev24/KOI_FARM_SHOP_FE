import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Table,
  Tag,
} from "antd";
import Search from "antd/es/transfer/search";
import React, { useEffect, useState } from "react";
import { AccountApi } from "../../../apis/Account.api";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingModal from "../../Modal/LoadingModal";
import _ from "lodash";

import {
  StopOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { getLocalStorage } from "../../../utils/LocalStorage";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthApi } from "../../../apis/Auth.api";
const validationSchema = yup.object().shape({
  fullName: yup.string().required("Họ và tên là bắt buộc"),
  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không hợp lệ")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"
    ),
});

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const user = getLocalStorage("user");
  const token = user?.accessToken;
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded?.scope || null;
    } catch (error) {
      console.error("Error decoding JWT token:", error);
    }
  }
  
  const { data: checkRoleUser, isLoading: isCheckRoleLoading, isError: isErrorCheckRole } = useQuery({
    queryKey: ['checkRole'],
    queryFn: () => AuthApi.checkRoleOfUser()
  })
  let role = checkRoleUser?.data
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== "manager") {
      navigate("/admin/fish-management");
    }
  }, [role]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => {
        return avatar ? (
          <Image src={avatar} alt="avatar" style={{ width: 50 }} />
        ) : (
          "Không có"
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        switch (role.roleName) {
          case "manager":
            return "Quản lý";
          case "staff":
            return "Nhân viên";
          case "customer":
            return "Khách hàng";
          default:
            return "Unknown";
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return status ? (
          <Tag color="lime">Bình thường</Tag>
        ) : (
          <Tag color="red">Bị chặn</Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Popconfirm
          title="Chặn người dùng này"
          description="Bạn có chắc muốn chặn người dùng này"
          onConfirm={() => {
            onSubmitBanUser(record.id);
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
            }}
            icon={<StopOutlined />}
          >
            {record.status ? "Chặn" : "Bỏ chặn"}
          </Button>
        </Popconfirm>
      ),
    },
  ];
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const fetchUsers = async ({ queryKey }) => {
    const [_key, page, search] = queryKey;
    if (search) {
      return await AccountApi.searchAccountByEmail(search, page);
    } else {
      return await AccountApi.getAllAccount(page);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const {
    data: ListUser,
    isLoading: isLoadingListUser,
    isError: isErrorListUser,
    error: errorListUser,
  } = useQuery({
    queryKey: ["ListUser", currentPage, debouncedQuery],
    queryFn: fetchUsers,
  });

  const {
    mutate: handleBanUser,
    isLoading: isBanUserLoading,
    isError: isBanUserError,
  } = useMutation({
    mutationFn: (id) => AccountApi.banUser(id),
    onSuccess: () => {
      message.success("Đã ban người dùng thành công");
      queryClient.refetchQueries({
        queryKey: ["ListUser"],
        type: "active",
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
      message.error(errorMessage);
    },
  });
  const {
    mutate: handleCreateUser,
    isLoading: isLoadingCreateUser,
    isError: isErrorCreateUser,
  } = useMutation({
    mutationFn: (data) => AccountApi.createAccount(data),
    onSuccess: (d) => {
      message.success("Tạo người dùng thành công");
      queryClient.refetchQueries({
        queryKey: ["ListUser"],
        type: "active",
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
      message.error(errorMessage);
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      address: "",
      phone: "",
      role: 3,
      status: true,
      verified: true,
    },
    resolver: yupResolver(validationSchema),
    criteriaMode: "all",
    mode: "onBlur",
  });
  // const {
  //   data: ListSearch,
  //   isLoading: isLoadingListSearch,
  //   isError: isErrorListSearch,
  // } = useQuery({
  //   queryKey: ["ListSearch"],
  //   queryFn: (email) => AccountApi.searchAccountByEmail(email),
  //   keepPreviousData: true,
  // });
  const totalPages = ListUser?.data?.totalElements;
  if (isErrorListUser || isErrorCreateUser) {
    return <div>Có lỗi xảy ra</div>;
  }
  if (isLoadingListUser || isLoadingCreateUser) {
    return <LoadingModal isLoading={isLoadingListUser || isLoadingCreateUser} />;
  }

  const onSubmitBanUser = (id) => {
    handleBanUser(id);
  };

  const onSubmit = (data) => {
    const result = {
      ...data,
      roleId: data.role,
    };
    handleCreateUser(result);
  };

  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="w-[450px]">
        <Search
          placeholder="Nhập email để tìm kiếm..."
          value={query}
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
            dataSource={ListUser?.data?.accounts}
            pagination={false}
          />
          <div className="flex justify-end mt-2">
            <Pagination
              defaultCurrent={currentPage}
              total={totalPages}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
      <Modal
        title="Thêm người dùng"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[48, 15]} className="mt-6">
            <Col span={24}>
              <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                Họ và Tên
              </label>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập Họ và Tên"
                    className="mt-1"
                    status={errors.fullName ? "error" : ""}
                  />
                )}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </Col>
            <Col span={24}>
              <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                Email
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập Email"
                    className="mt-1"
                    status={errors.email ? "error" : ""}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </Col>
            <Col span={24}>
              <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                Địa chỉ
              </label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập địa chỉ"
                    className="mt-1"
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                Số điện thoại
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập số điện thoại"
                    className="mt-1"
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                Mật khẩu
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="Nhập mật khẩu"
                    className="mt-1"
                    status={errors.password ? "error" : ""}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </Col>
            <Col span={24}>
              <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                Quyền:
              </label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{
                      width: "100%",
                      marginTop: "10px",
                    }}
                    placeholder="Chọn quyền"
                    options={[
                      { value: 3, label: "User" },
                      { value: 1, label: "Manager" },
                      { value: 2, label: "Staff" },
                    ]}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </Col>
            <Col span={24} className="flex justify-end">
              <Button htmlType="submit" type="primary" className="me-2">
                Tạo tài khoản
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
