import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button, Col, Form, Input, Row, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "../../apis/Auth.api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { saveEmail, saveIsResetPassword } from "../../Redux/Slices/Auth_Slice";
import LoadingModal from "../Modal/LoadingModal";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không hợp lệ")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không hợp lệ"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
    resolver: yupResolver(validationSchema),
    criteriaMode: "all",
    mode: "onBlur",
  });

  const { mutate: handleSendEmail, isPending: forgotPasswordLoad } =
    useMutation({
      mutationFn: (payload) => AuthApi.forgotEmail(payload),

      onSuccess: (result) => {
        console.log("result: ", result);
        message.success("Gửi email thành công vui lòng nhập otp");
        dispatch(saveIsResetPassword(true));
        navigate("/otp");
      },
      onError: (error) => {
        const errorMessage =
          error?.message || "Đã có lỗi xử lý vui lòng thử lại";
         message.error(errorMessage)
      },
    });
  const onSubmit = (data) => {
    handleSendEmail(data.email);
    dispatch(saveEmail(data.email));
  };
  return (
    <div
      style={{ backgroundColor: "#DDBCBC" }}
      className="w-full h-screen flex justify-center items-center "
    >
      {forgotPasswordLoad && <LoadingModal isLoading={true} />}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "8px 8px #A68E8E",
        }}
        className="w-[1250px] h-[700px] grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-1 gap-1"
      >
        <div className="content-left w-full h-full rounded-xl flex flex-col items-center justify-center mt-10">
          <div
            style={{ marginTop: "59px" }}
            className="content-left-top flex justify-around"
          >
            <div>
              <p
                style={{ fontSize: "32px", marginLeft: "30px" }}
                className="text-center font-normal text-black titleForm me-20"
              >
                Quên mật khẩu
              </p>
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
                    <p className="text-white font-normal text-xl">
                      Đổi mật khẩu
                    </p>
                  </Button>
                </Col>

                <Col span={24}>
                  <p className="text-black font-normal text-base ms-2 text-center me-20">
                    Quay về?
                    <Link
                      className="px-2"
                      to="/login"
                      style={{ color: "#EA4444" }}
                    >
                      Đăng nhập
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

export default ForgotPassword;
