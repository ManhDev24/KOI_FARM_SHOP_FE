import React from "react";
import { Button, Col, Form, Input, Row, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";
import "./login.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { LoginAPi } from "../../apis/Login.api";
import { toast } from "react-toastify";
import axios from "axios";

const validationSchema = yup.object().shape({
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

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(validationSchema),
    criteriaMode: "all",
    mode: "onBlur",
  });

  // const { mutate: handleLogin, isLoading } = useMutation({
  //   mutationFn: (payload) => LoginAPi.login(payload),
  //   onSuccess: (data) => {
  //     toast.success("Đăng nhập thành công");
  //   },
  //   onError: (error) => {
  //     const errorMessage = error?.message || "An unexpected error occurred";
  //     toast.error(errorMessage);
  //   },
  // });

  // const onSubmit = (data) => {
  //   handleLogin(data);
  //   console.log(data);
  // };
  const onSubmit = async (data) => {
    try {
      const response = await axios.get("http://localhost:9999/users");
      const users = response.data;
      console.log("users: ", users);
      const user = users.find(
        (user) => user.email === data.email && user.password === data.password
      );
      if (user) {
        toast.success("Login successful!");
        setIsLoginModalOpen(false);
        const { password, ...dataSaveToLocal } = user;
        setLocalStorage("user", dataSaveToLocal);
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div
      style={{ backgroundColor: "#DDBCBC" }}
      className="w-full h-screen flex justify-center items-center"
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "8px 8px #A68E8E",
        }}
        className="w-[1250px] h-[600px] grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-1 gap-1 loginForm"
      >
        <div className="content-left w-full h-full rounded-xl">
          <div
            style={{ marginTop: "59px" }}
            className="content-left-top flex justify-around"
          >
            <div>
              <p
                style={{ fontSize: "32px", marginLeft: "10px" }}
                className="text-center font-normal text-black titleForm"
              >
                Đăng nhập
              </p>
            </div>
            <div className="me-10 logoForm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                className="me-10 cursor-pointer"
              >
                <path
                  d="M43.611 20.083H42V20H24V28H35.303C33.654 32.657 29.223 36 24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24C4 35.045 12.955 44 24 44C35.045 44 44 35.045 44 24C44 22.659 43.862 21.35 43.611 20.083Z"
                  fill="#FFC107"
                />
                <path
                  d="M6.30603 14.691L12.877 19.51C14.655 15.108 18.961 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C16.318 4 9.65603 8.337 6.30603 14.691Z"
                  fill="#FF3D00"
                />
                <path
                  d="M24 44C29.166 44 33.86 42.023 37.409 38.808L31.219 33.57C29.1439 35.1491 26.6076 36.0028 24 36C18.798 36 14.381 32.683 12.717 28.054L6.19501 33.079C9.50501 39.556 16.227 44 24 44Z"
                  fill="#4CAF50"
                />
                <path
                  d="M43.611 20.083H42V20H24V28H35.303C34.5142 30.2164 33.0934 32.1532 31.216 33.571L31.219 33.569L37.409 38.807C36.971 39.205 44 34 44 24C44 22.659 43.862 21.35 43.611 20.083Z"
                  fill="#1976D2"
                />
              </svg>
            </div>
          </div>
          <div className="flex justify-center items-center mt-10">
            <Form
              className="w-[450px] h-[524px]"
              layout="vertical"
              onFinish={handleSubmit(onSubmit)}
            >
              <Row gutter={[48, 30]}>
                <Col span={24}>
                  <label
                    style={{ fontSize: "20px", marginLeft: "8px" }}
                    className="text-xs text-black font-normal"
                  >
                    Email
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        style={{
                          width: "404px",
                          borderRadius: "15px",
                          marginTop: "10px",
                        }}
                        {...field}
                        type="text"
                        size="large"
                        className="mt-1"
                        placeholder="Nhập Email"
                        status={errors.email ? "error" : ""}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </Col>
                <Col span={24}>
                  <label
                    style={{ fontSize: "20px", marginLeft: "8px" }}
                    className="text-xs text-black font-normal"
                  >
                    Mật Khẩu
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        style={{
                          width: "404px",
                          borderRadius: "15px",
                          marginTop: "10px",
                        }}
                        {...field}
                        type="password"
                        size="large"
                        className="mt-1"
                        placeholder="Nhập mật khẩu"
                        status={errors.password ? "error" : ""}
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </Col>
                <Col span={24}>
                  <Button
                    className="text-white"
                    style={{
                      borderRadius: "15px",
                      width: "404px",
                      height: "50px",
                      background: "#EA4444",
                    }}
                    htmlType="submit"
                  >
                    <p className="text-white font-normal text-xl">Đăng nhập</p>
                  </Button>
                </Col>
                <Col span={12} className="flex">
                  <Checkbox></Checkbox>
                  <p className="text-black font-normal text-base ms-2">
                    Nhớ mật khẩu
                  </p>
                </Col>
                <Col span={12}>
                  <Link
                    to="/forgotPassword"
                    className="text-black font-normal text-base"
                  >
                    Quên mật khẩu?
                  </Link>
                </Col>
                <Col span={24}>
                  <p className="text-black font-normal text-base ms-2 text-center me-20">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" style={{ color: "#EA4444" }}>
                      Đăng ký
                    </Link>
                  </p>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            borderTopRightRadius: "0.75rem",
            borderBottomRightRadius: "0.75rem",
          }}
          className="content-right w-full h-full "
        >
          <img
            className="content-right-image"
            src="./img/loginImage.png"
            alt=""
          />
          <div
            className=""
            style={{
              position: "absolute",
              top: 100,
              left: 0,
              bottom: 0,
              height: "400px",
              width: "1px",
              backgroundColor: "black",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
