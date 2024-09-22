import React from "react";

import { Button, Dropdown, Menu } from "antd";
import "./navbar.css";
import { Link } from "react-router-dom";
import { getLocalStorage } from "../../../utils/LocalStorage";
import { useDispatch } from "react-redux";
import { signOut } from "../../../Redux/Slices/Auth_Slice";
const Navbar = () => {
  const dispatch = useDispatch()
  // Define menu items for dropdowns
  const koiMenuItems = [
    { key: "1", label: "Cá Koi Showa" },
    { key: "2", label: "Cá Koi Shusui" },
    { key: "3", label: "Cá Koi Kohaku" },
    { key: "4", label: "Cá Koi Hi Utsuri" },
  ];

  const newsMenuItems = [
    { key: "1", label: "Kiến thức Cá Koi" },
    { key: "2", label: " Cá Koi" },
    { key: "3", label: "Option 3" },
  ];

  const handelSignOut = ()=>{
    dispatch(signOut())
  }
  const profile = [
    { key: "5", label: "Profile" },
    { key: "6", label: "Thông tin cá nhân" },
    { key: "7", label: "Settings" },
    { key: "8", label: "Đăng xuất" },
  ];
  

  const userlogged = getLocalStorage("user");

  return (
    <>
      {/* //navbar */}
      <div className="Navbar md:h-[400px] lg:h-[400px] xl:grid-cols-10  grid lg:grid-cols-10  2xl:grid-cols-8   w-full h-[150px]  lg:w-full xl:h-[150px]   sm:h-[300px] sm:col-span-1">
        {/* //logo */}
        <div className="w-full h-full md:col-span-12 lg:col-span-12 xl:col-span-1 flex flex-col justify-center col-span-1  sm:col-span-12 items-center">
          <div className="logo w-[90px]  h-[90px] container ms-[50px]">
            <Link to="/">
              <img src="./img/logo.png" alt="Logo" className="ms-[4px]" />
            </Link>

            <div
              style={{
                width: 98,
                color: "#EA4444",
                fontSize: 20,
                fontFamily: "Arial",
                fontWeight: "700",
                textTransform: "uppercase",
                wordWrap: "break-word",
              }}
            >
              KOI FARM
            </div>
          </div>
        </div>

        {/* //cate */}
        <div className="categories md:col-span-12 lg:col-span-12 xl:grid xl:grid-cols-1 xl:ms-[50px] xl:col-span-5 2xl:col-span-4  lg:flex lg:items-center lg:justify-center lg:h-[150px] lg:w-full md:w-full md:h-[200px] sm:h-[200px]">
          <ul className="flex flex-col md:flex-row items-center justify-center md:h-[200px] lg:h-[150px]">
            <li className="me-x">
              <Dropdown menu={{ items: koiMenuItems }} trigger={["hover"]}>
                <Button
                  type="primary"
                  danger
                  className="cate-font ps-1 w-auto h-[42px] box-border"
                >
                  <span className="h-[30px] ps-[3px]">Cá Koi Nhật</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10.0002 12.5L5.8335 8.33331H14.1668L10.0002 12.5Z"
                      fill="#EA4444"
                    />
                  </svg>
                </Button>
              </Dropdown>
            </li>

            <li className="me-x">
              <Dropdown menu={{ items: newsMenuItems }} trigger={["hover"]}>
                <Button
                  type="primary"
                  danger
                  className="cate-font ps-1 w-auto h-[42px] box-border"
                >
                  <span className="h-[30px] ps-[3px]">Tin tức</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10.0002 12.5L5.8335 8.33331H14.1668L10.0002 12.5Z"
                      fill="#EA4444"
                    />
                  </svg>
                </Button>
              </Dropdown>
            </li>

            <li className="me-x">
              <Dropdown menu={{ items: koiMenuItems }} trigger={["hover"]}>
                <Button
                  type="primary"
                  danger
                  className="cate-font ps-1 h-[42px] box-border"
                >
                  <span className="h-[30px] ps-[3px]">Ký gửi</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10.0002 12.5L5.8335 8.33331H14.1668L10.0002 12.5Z"
                      fill="#EA4444"
                    />
                  </svg>
                </Button>
              </Dropdown>
            </li>

            <li className="me-x">
              <Button
                type="primary"
                danger
                className="my-0 mx-auto cate-font ps-1  w-[192px] h-[42px] box-border flex justify-center align-top pe-1"
              >
                <span className="w-[178px] h-[30px]">Hỗ trợ khách hàng</span>
              </Button>
            </li>
          </ul>
        </div>

        {/* //search */}
        <div className="flex items-center justify-center md:col-span-12 lg:w-[80vw] md:w-[70vw] lg:col-span-12 xl:w-[400px] xl:col-span-1 2xl:col-span-1 max-w-full relative">
          <input
            type="search"
            className="block h-[42px] flex-auto w-full border rounded-[10px] border-solid border-[#e24242] pl-[44px] py-[0.25rem] text-base leading-[1.6] outline-none placeholder:text-neutral-500 focus:shadow-inset focus:border-red-500 dark:placeholder:text-[#FA4444]"
            placeholder="Tìm Kiếm"
            aria-label="Search"
          />
          <span
            className="absolute left-[10px] top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-[#FA4444]"
            id="search-icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M18.9695 18.9695L22.7132 22.7132M22.6128 25.7455C22.3964 25.5423 22.223 25.2976 22.1029 25.0261C21.9829 24.7545 21.9186 24.4616 21.9139 24.1647C21.9092 23.8679 21.9643 23.5731 22.0757 23.2979C22.1872 23.0227 22.3528 22.7727 22.5628 22.5628C22.7727 22.3528 23.0227 22.1872 23.2979 22.0757C23.5731 21.9643 23.8679 21.9092 24.1648 21.9139C24.4616 21.9186 24.7545 21.9829 25.0261 22.1029C25.2976 22.223 25.5423 22.3964 25.7455 22.6128L30.3008 27.1681C30.5172 27.3714 30.6907 27.616 30.8107 27.8876C30.9308 28.1591 30.9951 28.452 30.9997 28.7489C31.0044 29.0458 30.9494 29.3406 30.8379 29.6157C30.7265 29.8909 30.5608 30.1409 30.3509 30.3509C30.1409 30.5608 29.8909 30.7264 29.6157 30.8379C29.3406 30.9494 29.0458 31.0044 28.7489 30.9997C28.452 30.9951 28.1591 30.9308 27.8876 30.8107C27.616 30.6907 27.3714 30.5172 27.1681 30.3008L22.6128 25.7455ZM21.9644 11.4822C21.9644 8.70216 20.8601 6.03597 18.8943 4.07017C16.9285 2.10437 14.2623 1 11.4822 1C8.70216 1 6.03597 2.10437 4.07017 4.07017C2.10437 6.03597 1 8.70216 1 11.4822C1 14.2623 2.10437 16.9285 4.07017 18.8943C6.03597 20.8601 8.70216 21.9644 11.4822 21.9644C14.2623 21.9644 16.9285 20.8601 18.8943 18.8943C20.8601 16.9285 21.9644 14.2623 21.9644 11.4822Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {/* //button login,signup */}
        <div className="w-full h-full flex justify-end items-center col-span-5 xl:col-span-3 2xl:col-span-2">
          <Link to="/cart" className="me-10">
            <button className="relative  flex justify-end items-center mt-[21x]">
              {" "}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    background: "white",
                    boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: 5,
                    border: "1px #EA4444 solid",
                  }}
                ></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="30"
                  viewBox="0 0 31 36"
                  fill="none"
                  className="absolute right-[5px]"
                >
                  <path
                    d="M0.833374 0.333374H6.78837L7.46962 3.59382H30.0671L25.4846 21.5263H10.5584L9.93337 24.7867H28.3334V28.0472H6.73337L8.29087 19.914L4.87837 3.59382H0.833374V0.333374ZM10.5384 18.2658H23.6821L26.5996 6.85426H8.15212L10.5384 18.2658ZM5.83337 32.9378C5.83337 32.0731 6.09677 31.2438 6.56561 30.6323C7.03445 30.0209 7.67033 29.6774 8.33337 29.6774C8.99642 29.6774 9.6323 30.0209 10.1011 30.6323C10.57 31.2438 10.8334 32.0731 10.8334 32.9378C10.8334 33.8025 10.57 34.6318 10.1011 35.2433C9.6323 35.8548 8.99642 36.1983 8.33337 36.1983C7.67033 36.1983 7.03445 35.8548 6.56561 35.2433C6.09677 34.6318 5.83337 33.8025 5.83337 32.9378ZM23.3334 32.9378C23.3334 32.0731 23.5968 31.2438 24.0656 30.6323C24.5344 30.0209 25.1703 29.6774 25.8334 29.6774C26.4964 29.6774 27.1323 30.0209 27.6011 30.6323C28.07 31.2438 28.3334 32.0731 28.3334 32.9378C28.3334 33.8025 28.07 34.6318 27.6011 35.2433C27.1323 35.8548 26.4964 36.1983 25.8334 36.1983C25.1703 36.1983 24.5344 35.8548 24.0656 35.2433C23.5968 34.6318 23.3334 33.8025 23.3334 32.9378Z"
                    fill="#EA4444"
                  />
                </svg>
              </div>
            </button>
          </Link>

          {userlogged ? (
            <div className="w-[80.75px] h-[36.75px] relative flex-col mt-[-5px] justify-start items-start inline-flex">
              <span>
                <ul>
                  <li>
                    <Dropdown
                      menu={{ items: profile }}
                      trigger={["hover"]}
                    >
                      <Button className="logoutButton text-[#FA4444] border-[1px] border-[#FA4444] w-[24] h-[42px]">
                        <img
                          src="./img/Vector.png"
                          width={30}
                          height={30}
                          className="p-0"
                          alt="User Icon"
                        />
                      </Button>
                    </Dropdown>
                  </li>
                </ul>
              </span>
            </div>
          ) : (
            <>
              <div className="pe-2">
                <Link to="/login">
                  <Button
                    type="primary"
                    danger
                    className="loginButton text-[20px] rounded-[10px] w-[124px] h-[42px] box-border"
                  >
                    Đăng Nhập
                  </Button>
                </Link>
              </div>
              <div className="pe-5">
                <Link to="/register">
                  <Button
                    type="primary"
                    danger
                    className="registerButton text-[20px] rounded-[10px] w-[124px] h-[42px] box-border"
                  >
                    Đăng ký
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
