import React from "react";
import { Button, Col, Form, Input, Row, Checkbox, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import "./login.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { setLocalStorage } from "../../utils/LocalStorage";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/Slices/Auth_Slice";
import { AuthApi } from "../../apis/Auth.api";
import LoadingModal from "../Modal/LoadingModal";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const { mutate: handleLogin, isPending: loginLoad } = useMutation({
    mutationFn: (payload) => AuthApi.login(payload),
    onSuccess: (data) => {
      setLocalStorage("user", data.data);
      dispatch(setUser(data));
      message.success("Đăng nhập thành công");
      navigate("/");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xử lý vui lòng thử lại !!!";
       message.error(errorMessage)
    },
  });

  const { mutate: loginWithGoogle, isPending: googleLoad } = useMutation({
    mutationFn: (payload) => AuthApi.loginWithGoogle(payload),
    onSuccess: (data) => {
      setLocalStorage("user", data.data);
      dispatch(setUser(data));
      message.success("Đăng nhập thành công");
      navigate("/");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
       message.error(errorMessage)
    },
  });

  const handleLoginWithGoogle = (data) => {
    loginWithGoogle(data);
  };
  const onSubmit = (data) => {
    handleLogin(data);
  };

  return (
    <div
      style={{ backgroundColor: "#DDBCBC" }}
      className="w-full h-screen flex justify-center items-center"
    >
      {(googleLoad || loginLoad) && <LoadingModal isLoading={true} />}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "8px 8px #A68E8E",
        }}
        className="w-[1250px] h-[680px] grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-1 gap-1 loginForm"
      >
        <div className="content-left w-full h-full rounded-xl">
          <div
            style={{ marginTop: "59px" }}
            className="content-left-top flex justify-around"
          >
            <div>
              <p
                style={{ fontSize: "32px", marginLeft: "10px" }}
                className="text-center font-normal text-black titleForm pe-10"
              >
                Đăng nhập
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center mt-2">
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
                <Col className="pr-0" span={21}>
                  <div className="flex w-full items-center">
                    <div
                      data-orientation="horizontal"
                      role="none"
                      className="bg-border-1 bg-slate-400	h-[1px] w-full flex-1  "
                    />
                    <span
                      className="text-xs leading-xs text-secondary flex-none p-2 py-1.5 uppercase"
                      data-id="TextBody"
                    >
                      Or
                    </span>
                    <div
                      data-orientation="horizontal"
                      role="none"
                      className="bg-border-1 bg-slate-400 h-[1px] w-full flex-1"
                    />
                  </div>
                </Col>
                <Col span={24}>
                  <div className="flex justify-center items-center ms-2 me-20">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        if (credentialResponse?.credential) {
                          const decoded = jwtDecode(
                            credentialResponse.credential
                          );
                          handleLoginWithGoogle(decoded);
                        } else {
                          toast.error(
                            "Google login failed: Invalid credentials"
                          );
                        }
                      }}
                      onError={() => {
                        toast.error("Google login failed");
                      }}
                    />
                  </div>
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
              height: "70%",
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
