import React from "react";
import "./introduction.css";
import { Button, Flex, Col, Row } from "antd";
import { Link } from "react-router-dom";
const Introduction = () => {
  return (
    <>
      <Flex justify="center">
        <div className="w-[950px] h-[50px] bg-white text-[36px] text-[#FA4444] text-center border border-3 border-[#FA4444] mt-[80px] ">
          <span style={{ fontFamily: "Merriweather, serif" }}>GIỚI THIỆU</span>
        </div>
      </Flex>
      <div className="w-[950px] h-[400px] my-[80px] m-auto bg-[#FFFFFFF]">
        <div className=" content-center so ">
          <Row span>
            <Flex justify="center" align="center">
              <Col
                span={
                  <h1 className="text-[32px] textfont ps-10 w-[200px] item">
                    KOI FARM
                  </h1>
                }
              ></Col>
              <Col span={15}>
                <div className=" textfonts w-full">
                  <h1 className="text-[32px] font-bold textfont ps-10 w-[200px] item ">
                    KOI FARM
                  </h1>
                  <p className="indent-4">
                    Hiện nay, nhu cầu của khách hàng về thiết kế thi công cảnh
                    Quan phong thủy ngày càng trở nên đa dạng hơn. Chính vì vậy,
                    có không ít các đơn vị đã gia nhập vào lĩnh vực này nhằm
                    phục vụ được lượng cầu của khách hàng. Góp mặt trong số
                    lượng lớn các đơn vị này, Koi Farm chúng tôi cũng hy vọng sẽ
                    mang tới sự đáp ứng tối ưu nhất những mong muốn của mọi
                    người.
                  </p>
                </div>
                <Link to="/koiList">
                  <Button
                    type="primary"
                    className="w-[160px] font-bold h-[50px] box-border m-auto rounded-[10px] ms-10 mt-10 shadows"
                  >
                    <span>XEM CHI TIẾT</span>
                  </Button>
                </Link>
              </Col>
              <Col span={8}>
                <img
                  className="w-[399px] h-[358px]"
                  src="./img/introduction.png "
                  alt=""
                />
              </Col>
            </Flex>
          </Row>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Introduction;
