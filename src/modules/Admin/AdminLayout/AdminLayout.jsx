// src/modules/Admin/AdminLayout/AdminLayout.js
import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DashboardOutlined,
  SafetyCertificateOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { publicRoutes } from "../../../routes/routes";
import { getLocalStorage } from "../../../utils/LocalStorage";
import { useQuery } from "@tanstack/react-query";
import { AccountApi } from "../../../apis/Account.api";
import { Footer } from "antd/es/layout/layout";
import LoadingModal from "../../Modal/LoadingModal";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = getLocalStorage("user");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => AccountApi.getProfile(user?.email),
    enabled: !!user?.email,
  });
  console.log("profile: ", profile?.data);
  useEffect(() => {
    if (pathname === "/admin") {
      navigate("/admin/dashboard");
    }
  }, [pathname, navigate]);
  const selectedKey =
    publicRoutes.find((route) => pathname.startsWith(route.path))?.path ||
    "/admin";
  if (isError) {
    return <div>Có lỗi xảy ra</div>;
  }
  if (isLoading) {
    return <LoadingModal />;
  }
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
              className="object-cover  h-[120px] w-[120px] rounded-full"
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
            {
              key: "/admin/dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "/admin/user-management",
              icon: <UserOutlined />,
              label: "Account ",
            },
            {
              key: "/admin/fish-management",
              icon: <VideoCameraOutlined />,
              label: "Fish Management",
            },
            {
              key: "/admin/category-management",
              icon: <SafetyCertificateOutlined />,
              label: "Category ",
            },
            {
              key: "/",
              icon: <HomeOutlined />,
              label: "Home",
            },
          ]}
        ></Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
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
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
