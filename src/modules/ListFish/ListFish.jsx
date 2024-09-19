import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { Button, Dropdown, Flex, Row } from "antd";

const ListFish = () => {
  const cardData = [
    {
      tag: "Đang bán",
      imgSrc: "img/SOWA.webp",
      title: "SHOWA KOI",
      seller: "Hoàng Tiến Đạt",
      gender: "Koi cái",
      age: "18+",
      size: "80cm",
      origin: "Nhật Bổn",
      type: "Cá Koi Showa",
      price: "300.000 đ",
    },
    {
      tag: "Đang bán",
      imgSrc: "img/SOWA.webp",
      title: "SHOWA KOI",
      seller: "Hoàng Tiến Đạt",
      gender: "Koi cái",
      age: "18+",
      size: "80cm",
      origin: "Nhật Bổn",
      type: "Cá Koi Showa",
      price: "300.000 đ",
    },
    {
      tag: "Đang bán",
      imgSrc: "img/SOWA.webp",
      title: "SHOWA KOI",
      seller: "Hoàng Tiến Đạt",
      gender: "Koi cái",
      age: "18+",
      size: "80cm",
      origin: "Nhật Bổn",
      type: "Cá Koi Showa",
      price: "300.000 đ",
    },
    {
      tag: "Đang bán",
      imgSrc: "img/SOWA.webp",
      title: "SHOWA KOI",
      seller: "Hoàng Tiến Đạt",
      gender: "Koi cái",
      age: "18+",
      size: "80cm",
      origin: "Nhật Bổn",
      type: "Cá Koi Showa",
      price: "300.000 đ",
    },
    {
      tag: "Đang bán",
      imgSrc: "img/SOWA.webp",
      title: "SHOWA KOI",
      seller: "Hoàng Tiến Đạt",
      gender: "Koi cái",
      age: "18+",
      size: "80cm",
      origin: "Nhật Bổn",
      type: "Cá Koi Showa",
      price: "300.000 đ",
    },
    {
      tag: "Đang bán",
      imgSrc: "img/SOWA.webp",
      title: "SHOWA KOI",
      seller: "Hoàng Tiến Đạt",
      gender: "Koi cái",
      age: "18+",
      size: "80cm",
      origin: "Nhật Bổn",
      type: "Cá Koi Showa",
      price: "300.000 đ",
    },
  ];

  const CategoryItem = [
    {
      key: "1",
      label: "Demo1",
    },
    {
      key: "2",
      label: "Demo2",
    },
    {
      key: "3",
      label: "Demo3",
    },
  ];

  return (
    <div className="ListFish ">
      <div className="filter flex justify-center items-center  mb-5">
        <div
          style={{ backgroundColor: "#FFF8F8" }}
          className="w-[950px] h-[30px] flex items-center ps-3 "
        >
          <Breadcrumb
            separator=">"
            className="flex justify-center items-center font-bold text-lg m-3"
          >
            <Breadcrumb.Item>
              <Link to="/" style={{ color: "#EA4444" }} className="">
                Home
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link style={{ color: "#EA4444" }} className="">
                KoiList
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex justify-center items-center mb-3 filter">
        <div
          style={{
            border: "1px solid black",
            borderRadius: "10px",
            boxShadow: "10px 10px 4px 0 rgba(0, 0, 0, 0.25)",
          }}
          className="w-[850px] h-[320px]"
        >
          <div className="m-3">
            <div className="filter name">
              <p className="text-xl font-bold">Tìm kiếm Nâng cao</p>
            </div>
            <div className="grid grid-cols-3 gap-5 mt-4">
              <div className="dropdown_filter">
                <Dropdown
                  menu={{
                    items: CategoryItem,
                  }}
                  arrow
                >
                  <Button
                    style={{ borderRadius: "10px", border: "1px solid black" }}
                    className="h-[50px] w-[250px] text-xl flex justify-between"
                  >
                    <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                      <p>Danh mục</p>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.5002 4.16664L2.50017 4.16664C2.34831 4.16712 2.19944 4.209 2.06961 4.28779C1.93978 4.36658 1.83389 4.47928 1.76334 4.61377C1.6928 4.74826 1.66027 4.89944 1.66925 5.05104C1.67824 5.20265 1.7284 5.34893 1.81434 5.47414L9.31434 16.3075C9.62517 16.7566 10.3735 16.7566 10.6852 16.3075L18.1852 5.47414C18.272 5.34919 18.3229 5.20283 18.3324 5.05098C18.3418 4.89912 18.3095 4.74758 18.2389 4.6128C18.1683 4.47803 18.0621 4.36518 17.9319 4.28652C17.8016 4.20786 17.6523 4.1664 17.5002 4.16664Z"
                          fill="#EA4444"
                        />
                      </svg>
                    </div>
                  </Button>
                </Dropdown>
              </div>
              <div className="dropdown_filter">
                <Dropdown
                  menu={{
                    items: CategoryItem,
                  }}
                  arrow
                >
                  <Button
                    style={{ borderRadius: "10px", border: "1px solid black" }}
                    className="h-[50px] w-[250px] text-xl flex justify-between"
                  >
                    <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                      <p>Danh mục</p>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.5002 4.16664L2.50017 4.16664C2.34831 4.16712 2.19944 4.209 2.06961 4.28779C1.93978 4.36658 1.83389 4.47928 1.76334 4.61377C1.6928 4.74826 1.66027 4.89944 1.66925 5.05104C1.67824 5.20265 1.7284 5.34893 1.81434 5.47414L9.31434 16.3075C9.62517 16.7566 10.3735 16.7566 10.6852 16.3075L18.1852 5.47414C18.272 5.34919 18.3229 5.20283 18.3324 5.05098C18.3418 4.89912 18.3095 4.74758 18.2389 4.6128C18.1683 4.47803 18.0621 4.36518 17.9319 4.28652C17.8016 4.20786 17.6523 4.1664 17.5002 4.16664Z"
                          fill="#EA4444"
                        />
                      </svg>
                    </div>
                  </Button>
                </Dropdown>
              </div>
              <div className="dropdown_filter">
                <Dropdown
                  menu={{
                    items: CategoryItem,
                  }}
                  arrow
                >
                  <Button
                    style={{ borderRadius: "10px", border: "1px solid black" }}
                    className="h-[50px] w-[250px] text-xl flex justify-between"
                  >
                    <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                      <p>Danh mục</p>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.5002 4.16664L2.50017 4.16664C2.34831 4.16712 2.19944 4.209 2.06961 4.28779C1.93978 4.36658 1.83389 4.47928 1.76334 4.61377C1.6928 4.74826 1.66027 4.89944 1.66925 5.05104C1.67824 5.20265 1.7284 5.34893 1.81434 5.47414L9.31434 16.3075C9.62517 16.7566 10.3735 16.7566 10.6852 16.3075L18.1852 5.47414C18.272 5.34919 18.3229 5.20283 18.3324 5.05098C18.3418 4.89912 18.3095 4.74758 18.2389 4.6128C18.1683 4.47803 18.0621 4.36518 17.9319 4.28652C17.8016 4.20786 17.6523 4.1664 17.5002 4.16664Z"
                          fill="#EA4444"
                        />
                      </svg>
                    </div>
                  </Button>
                </Dropdown>
              </div>
              <div className="dropdown_filter">
                <Dropdown
                  menu={{
                    items: CategoryItem,
                  }}
                  arrow
                >
                  <Button
                    style={{ borderRadius: "10px", border: "1px solid black" }}
                    className="h-[50px] w-[250px] text-xl flex justify-between"
                  >
                    <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                      <p>Danh mục</p>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.5002 4.16664L2.50017 4.16664C2.34831 4.16712 2.19944 4.209 2.06961 4.28779C1.93978 4.36658 1.83389 4.47928 1.76334 4.61377C1.6928 4.74826 1.66027 4.89944 1.66925 5.05104C1.67824 5.20265 1.7284 5.34893 1.81434 5.47414L9.31434 16.3075C9.62517 16.7566 10.3735 16.7566 10.6852 16.3075L18.1852 5.47414C18.272 5.34919 18.3229 5.20283 18.3324 5.05098C18.3418 4.89912 18.3095 4.74758 18.2389 4.6128C18.1683 4.47803 18.0621 4.36518 17.9319 4.28652C17.8016 4.20786 17.6523 4.1664 17.5002 4.16664Z"
                          fill="#EA4444"
                        />
                      </svg>
                    </div>
                  </Button>
                </Dropdown>
              </div>
              <div className="dropdown_filter">
                <Dropdown
                  menu={{
                    items: CategoryItem,
                  }}
                  arrow
                >
                  <Button
                    style={{ borderRadius: "10px", border: "1px solid black" }}
                    className="h-[50px] w-[250px] text-xl flex justify-between"
                  >
                    <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                      <p>Danh mục</p>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.5002 4.16664L2.50017 4.16664C2.34831 4.16712 2.19944 4.209 2.06961 4.28779C1.93978 4.36658 1.83389 4.47928 1.76334 4.61377C1.6928 4.74826 1.66027 4.89944 1.66925 5.05104C1.67824 5.20265 1.7284 5.34893 1.81434 5.47414L9.31434 16.3075C9.62517 16.7566 10.3735 16.7566 10.6852 16.3075L18.1852 5.47414C18.272 5.34919 18.3229 5.20283 18.3324 5.05098C18.3418 4.89912 18.3095 4.74758 18.2389 4.6128C18.1683 4.47803 18.0621 4.36518 17.9319 4.28652C17.8016 4.20786 17.6523 4.1664 17.5002 4.16664Z"
                          fill="#EA4444"
                        />
                      </svg>
                    </div>
                  </Button>
                </Dropdown>
              </div>
              <div className="dropdown_filter">
                <Dropdown
                  menu={{
                    items: CategoryItem,
                  }}
                  arrow
                >
                  <Button
                    style={{ borderRadius: "10px", border: "1px solid black" }}
                    className="h-[50px] w-[250px] text-xl flex justify-between"
                  >
                    <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                      <p>Danh mục</p>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.5002 4.16664L2.50017 4.16664C2.34831 4.16712 2.19944 4.209 2.06961 4.28779C1.93978 4.36658 1.83389 4.47928 1.76334 4.61377C1.6928 4.74826 1.66027 4.89944 1.66925 5.05104C1.67824 5.20265 1.7284 5.34893 1.81434 5.47414L9.31434 16.3075C9.62517 16.7566 10.3735 16.7566 10.6852 16.3075L18.1852 5.47414C18.272 5.34919 18.3229 5.20283 18.3324 5.05098C18.3418 4.89912 18.3095 4.74758 18.2389 4.6128C18.1683 4.47803 18.0621 4.36518 17.9319 4.28652C17.8016 4.20786 17.6523 4.1664 17.5002 4.16664Z"
                          fill="#EA4444"
                        />
                      </svg>
                    </div>
                  </Button>
                </Dropdown>
              </div>
              <div className="dropdown_filter">
                <Dropdown
                  menu={{
                    items: CategoryItem,
                  }}
                  arrow
                >
                  <Button
                    style={{ borderRadius: "10px", border: "1px solid black" }}
                    className="h-[50px] w-[250px] text-xl flex justify-between"
                  >
                    <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                      <p>Danh mục</p>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.5002 4.16664L2.50017 4.16664C2.34831 4.16712 2.19944 4.209 2.06961 4.28779C1.93978 4.36658 1.83389 4.47928 1.76334 4.61377C1.6928 4.74826 1.66027 4.89944 1.66925 5.05104C1.67824 5.20265 1.7284 5.34893 1.81434 5.47414L9.31434 16.3075C9.62517 16.7566 10.3735 16.7566 10.6852 16.3075L18.1852 5.47414C18.272 5.34919 18.3229 5.20283 18.3324 5.05098C18.3418 4.89912 18.3095 4.74758 18.2389 4.6128C18.1683 4.47803 18.0621 4.36518 17.9319 4.28652C17.8016 4.20786 17.6523 4.1664 17.5002 4.16664Z"
                          fill="#EA4444"
                        />
                      </svg>
                    </div>
                  </Button>
                </Dropdown>
              </div>
              <div className="dropdown_filter">
                <Dropdown
                  menu={{
                    items: CategoryItem,
                  }}
                  arrow
                >
                  <Button
                    style={{ borderRadius: "10px", border: "1px solid black" }}
                    className="h-[50px] w-[250px] text-xl flex justify-between"
                  >
                    <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                      <p>Danh mục</p>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.5002 4.16664L2.50017 4.16664C2.34831 4.16712 2.19944 4.209 2.06961 4.28779C1.93978 4.36658 1.83389 4.47928 1.76334 4.61377C1.6928 4.74826 1.66027 4.89944 1.66925 5.05104C1.67824 5.20265 1.7284 5.34893 1.81434 5.47414L9.31434 16.3075C9.62517 16.7566 10.3735 16.7566 10.6852 16.3075L18.1852 5.47414C18.272 5.34919 18.3229 5.20283 18.3324 5.05098C18.3418 4.89912 18.3095 4.74758 18.2389 4.6128C18.1683 4.47803 18.0621 4.36518 17.9319 4.28652C17.8016 4.20786 17.6523 4.1664 17.5002 4.16664Z"
                          fill="#EA4444"
                        />
                      </svg>
                    </div>
                  </Button>
                </Dropdown>
              </div>
              <div className="dropdown_filter">
                <Dropdown
                  menu={{
                    items: CategoryItem,
                  }}
                  arrow
                >
                  <Button
                    style={{ borderRadius: "10px", border: "1px solid black" }}
                    className="h-[50px] w-[250px] text-xl flex justify-between"
                  >
                    <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                      <p>Danh mục</p>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.5002 4.16664L2.50017 4.16664C2.34831 4.16712 2.19944 4.209 2.06961 4.28779C1.93978 4.36658 1.83389 4.47928 1.76334 4.61377C1.6928 4.74826 1.66027 4.89944 1.66925 5.05104C1.67824 5.20265 1.7284 5.34893 1.81434 5.47414L9.31434 16.3075C9.62517 16.7566 10.3735 16.7566 10.6852 16.3075L18.1852 5.47414C18.272 5.34919 18.3229 5.20283 18.3324 5.05098C18.3418 4.89912 18.3095 4.74758 18.2389 4.6128C18.1683 4.47803 18.0621 4.36518 17.9319 4.28652C17.8016 4.20786 17.6523 4.1664 17.5002 4.16664Z"
                          fill="#EA4444"
                        />
                      </svg>
                    </div>
                  </Button>
                </Dropdown>
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div>
                <p className="text-xl font-bold m-0">Kết quả tìm kiếm:200</p>
              </div>
              <div>
                <Button
                  style={{ border: "1px solid #EA4444", borderRadius: "10px" }}
                  className="me-3 w-[148px] h-[50px]"
                >
                  <p
                    style={{ color: "#EA4444", background: "#FFFFFF" }}
                    className="text-xl font-bold m-0"
                  >
                    Khôi phục
                  </p>
                </Button>
                <Button
                  style={{ background: "#EA4444", borderRadius: "10px" }}
                  className=" w-[148px] h-[50px]"
                >
                  <p className="text-xl font-bold m-0 text-white">Tìm kiếm</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-[1110px] mx-auto my-0 pb-1 pt-1 mb-3"
        style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
      >
        <div className="my-[80px] flex justify-center p-3">
          <Flex
            justify="center"
            horizontal
            className="grid grid-cols-3  justify-center w-[1110px] gap-4 md:gap-6 lg:gap-10"
          >
            {cardData.map((card, index) => (
              <Flex
                key={index}
                justify="center"
                vertical
                className="w-[250px] h-[645px] mx-10 shadows1"
              >
                {/* Tag */}
                <Row>
                  <div className="absolute w-[86px] bg-[#FFFFFF] rounded-ee-[10px] rounded-tl-[5px] text-center text-[#FA4444]">
                    {card.tag}
                  </div>
                  <div className="rounded-[10px]">
                    <img
                      src={card.imgSrc}
                      className="w-[250px] h-[354px] rounded-t-[8px] box-border"
                      alt=""
                    />
                  </div>
                </Row>
                <Flex horizontal>
                  <Flex className="grid col-span-3">
                    <Row className="flex flex-col w-[250px] h-[290px] bg-[#FFFFFF] border border-t-0 border-x-2 border-b-2 border-[#FA4444]">
                      <h1 className="my-0 mx-auto text-[#FA4444] font-bold text-[20px]">
                        {card.title}
                      </h1>
                      <div className="my-[10px] mx-[10px]">
                        <Flex
                          align="flex-start"
                          justify="space-around"
                          vertical
                        >
                          <div className="h-7">Người bán: {card.seller}</div>
                          <div className="h-6">Giới tính: {card.gender}</div>
                          <div className="h-6">Tuổi: {card.age}</div>
                          <div className="h-6">Kích thước: {card.size}</div>
                          <div className="h-6">Nguồn gốc: {card.origin}</div>
                          <div className="h-6">Giống: {card.type}</div>
                        </Flex>
                        <div align="center">
                          <div className="my-[10px] text-[20px] font-bold">
                            {card.price}
                          </div>
                          <Button className="w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]">
                            Đặt Mua
                          </Button>
                        </div>
                      </div>
                    </Row>
                  </Flex>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default ListFish;
