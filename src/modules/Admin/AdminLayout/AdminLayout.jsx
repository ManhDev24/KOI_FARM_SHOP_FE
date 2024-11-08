// src/modules/Admin/AdminLayout/AdminLayout.js
import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DashboardOutlined,
  SafetyCertificateOutlined,
  PayCircleOutlined,
  HomeOutlined,
  FundProjectionScreenOutlined,
  BlockOutlined,
  MoneyCollectOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { publicRoutes } from "../../../routes/routes";
import { getLocalStorage } from "../../../utils/LocalStorage";
import { useQuery } from "@tanstack/react-query";
import { AccountApi } from "../../../apis/Account.api";
import { Footer } from "antd/es/layout/layout";
import LoadingModal from "../../Modal/LoadingModal";
import { jwtDecode } from "jwt-decode"; // Correct import without destructuring

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = getLocalStorage("user");
  console.log('User from localStorage:', user);

  const token = user?.accessToken;
  let role = null;

  // Decoding the token to extract the role
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded); // Log decoded token for debugging
      role = decoded?.scope || null;
      console.log("User role:", role); // Log role for verification
    } catch (error) {
      console.error("Error decoding JWT token:", error);
    }
  }

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Fetching profile data
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => AccountApi.getProfile(user?.email),
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (pathname === "/admin") {
      navigate("/admin/dashboard");
    }
  }, [pathname, navigate]);

  // Handling loading and error states
  if (isError) {
    return <div>Có lỗi xảy ra</div>;
  }

  if (isLoading) {
    return <LoadingModal />;
  }

  // Rendering the layout with side navigation menu
  return (
    <Layout className="h-screen bg-green-600">
      <Sider theme="white" trigger={null} collapsible collapsed={collapsed}>
        <div
          onClick={() => navigate("/admin")}
          style={{ cursor: "pointer" }}
          className="icon-avatar flex justify-center items-center mt-5 mb-5 flex-col"
        >
          <div
            style={{ border: "2px solid white" }}
            className="text-center flex items-center justify-center cursor-pointer h-[120px] w-[120px] rounded-full"
          >
            <img
              style={{
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
              src={
                profile?.data?.avatar ||
                "https://cellphones.com.vn/sforum/wp-content/uploads/2024/03/anh-hinh-nen-thien-nhien-anime-3.jpg"
              }
              className="object-cover h-[120px] w-[120px] rounded-full"
            />
          </div>
          <div className="mt-4 text-white font-bold text-center">
            <h2>{profile?.data?.fullName}</h2>
            <h2>Chào mừng bạn trở lại</h2>
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          onSelect={({ key }) => {
            navigate(key);
          }}
          items={[
            ...(role === "manager"
              ? [
                {
                  key: "/admin/dashboard",
                  icon: <DashboardOutlined />,
                  label: "Biểu đồ",
                },
                {
                  key: "/admin/user-management",
                  icon: <UserOutlined />,
                  label: "Quản lý tài khoản",
                },
                {
                  key: "/admin/consignment-fee-management",
                  icon: <MoneyCollectOutlined />,
                  label: "Quản lý phí kí gửi",
                },
              ]
              : []),
            {
              key: "/admin/fish-management",
              icon: <VideoCameraOutlined />,
              label: "Quản lý cá koi",
            },
            {
              key: "/admin/batch-management",
              icon: <VideoCameraOutlined />,
              label: "Quản lý lô cá koi",
            },
            {
              key: "/admin/category-management",
              icon: <SafetyCertificateOutlined />,
              label: "Quản lý danh mục",
            },
            {
              key: "/admin/payment-management",
              icon: <PayCircleOutlined />,
              label: "Quản lý đơn hàng",
            },
            {
              key: "/admin/consignment-management",
              icon: <FundProjectionScreenOutlined />,
              label: "Quản lý ký gửi",
            },
            {
              key: "/admin/fishCare-management",
              icon: <PlusOutlined />,
              label: "Quản tình trạng cá koi",
            },
            {
              key: "/admin/blog-management",
              icon: <BlockOutlined />,
              label: "Quản lý bài blog",
            },
            {
              key: "/admin/create-blog",
              icon: <SafetyCertificateOutlined />,
              label: "Tạo bài blog",
            },
            {
              key: "/",
              icon: <HomeOutlined />,
              label: "Quay về trang chủ",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#F5F5F5",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          className="site-layout-background"
          style={{
            backgroundColor: "#F5F5F5",
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: borderRadiusLG,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            marginTop: 24,
            minHeight: "calc(100vh - 64px - 48px)",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
