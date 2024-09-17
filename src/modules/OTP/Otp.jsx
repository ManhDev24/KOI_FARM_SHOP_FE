import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button, Col, Form, Input, Row, Checkbox } from "antd";
import { Link } from "react-router-dom";
const validationSchema = yup.object().shape({
  otp: yup.string().required("OTP là bắt buộc").max(6, "Tối đa là 6 chữ số"),
});
const Otp = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: "" },
    resolver: yupResolver(validationSchema),
    criteriaMode: "all",
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    console.log("data: ", data);
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
        className="w-[1250px] h-[600px] grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-1 gap-1"
      >
        <div className="content-left w-full h-full rounded-xl flex flex-col items-center justify-center mt-10">
          <div
            style={{ marginTop: "59px" }}
            className="content-left-top flex justify-around"
          >
            <div>
              <p
                style={{ fontSize: "32px", marginLeft: "20px" }}
                className="text-center font-normal text-black titleForm me-20"
              >
                Mã OTP
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
                    className="text-xs text-black font-normal me-3"
                  >
                    OTP
                  </label>
                  <Controller
                    name="otp"
                    control={control}
                    render={({ field }) => (
                      <Input
                        style={{
                          width: "404px",
                          borderRadius: "15px",
                          marginTop: "10px",
                        }}
                        {...field}
                        type="text" // Use 'password' type for security
                        size="large"
                        className="mt-1"
                        placeholder="Nhập mật khẩu"
                        status={errors.otp ? "error" : ""}
                      />
                    )}
                  />
                  {errors.otp && (
                    <p className="text-xs text-red-600">{errors.otp.message}</p>
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
                    <p className="text-white font-normal text-xl">Nhập OTP</p>
                  </Button>
                </Col>
                <Col span={24}>
                  <p className="text-black font-normal text-base ms-2 text-center me-20">
                    Chưa gửi được mã?
                    <Link to="" style={{ color: "#EA4444" }}>
                      Gửi lại
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

export default Otp;
