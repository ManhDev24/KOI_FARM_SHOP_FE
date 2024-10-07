// src/modules/Admin/AdminLayout/AdminLayout.js
import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { publicRoutes } from "../../../routes/routes";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const selectedKey = publicRoutes.find(route => pathname.startsWith(route.path))?.path || "/admin";

  return (
    <Layout className="h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="text-center flex items-center justify-center cursor-pointer h-[80px]">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/koi-shop-3290e.appspot.com/o/Logo%2Flogo.png?alt=media&token=0dc23cde-c8b5-4256-8e33-d604279c78c4"
            width={70}
            onClick={() => navigate("/")}
          />
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
              key: "/admin/user-management",
              icon: <UserOutlined />,
              label: "Account Management",
            },
            {
              key: "/admin/nav2",
              icon: <VideoCameraOutlined />,
              label: "Nav 2",
            },
            {
              key: "/admin/nav3",
              icon: <UploadOutlined />,
              label: "Nav 3",
            },
          ]}
        />
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
