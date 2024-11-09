import React, { useEffect, useState } from "react";

import { Button, Dropdown, Menu, Modal } from "antd";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { getLocalStorage } from "../../../utils/LocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../../Redux/Slices/Auth_Slice";
import FishApi from "../../../apis/Fish.api";
import logo from "/img/logo.png";
import Vector from "/img/Vector.png";
import { AuthApi } from "../../../apis/Auth.api";
import { setSelectedCategory } from "../../../Redux/Slices/FishList_Slice";
import { data } from "autoprefixer";
import LoadingModal from "../../../modules/Modal/LoadingModal";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = getLocalStorage("user");
  const fetchEmail = () => {
    const dataProfile = getLocalStorage("user");
    if (dataProfile && dataProfile.email) {
      return dataProfile.email;
    } else {
      console.error("No user profile found in localStorage");
      return null;
    }
  };
  const { data: checkRoleUser, isLoading: isCheckRoleLoading, isError: isErrorCheckRole } = useQuery({
    queryKey: ['checkRole'],
    queryFn: () => AuthApi.checkRoleOfUser()
  })
  console.log('checkRoleUser: ', checkRoleUser);
  const token = user?.accessToken;

  let decoded = null;
  if (token) {
    try {
      decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
    } catch (error) {
      console.error("Invalid token", error);
    }
  }


  const [profileData, setProfileData] = useState(null);

  const { items } = useSelector((state) => state.cart);

  const [koiMenuItems, setKoiMenuItems] = useState([]); // State lưu trữ các mục menu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryID, setSelectedCategoryID] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const fetchKoiCategories = async () => {
    try {
      const categoriesArray = await FishApi.getCategories();
      if (Array.isArray(categoriesArray)) {
        const menuItems = categoriesArray.map((item) => ({
          key: item.id,
          label: (
            <Link
              to="/koiList"
              onClick={() => handleCategorySelection(item.id)}
            >
              {item.categoryName}
            </Link>
          ),
        }));
        setKoiMenuItems(menuItems);
      } else {
        setError("The received data is not an array as expected.");
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching categories.");
    } finally {
      setLoading(false);
    }
  };
  const fetchUserProfile = async () => {
    try {
      const categoriesArray = await FishApi.getCategories();
      if (Array.isArray(categoriesArray)) {
        const menuItems = categoriesArray.map((item) => ({
          key: item.id,
          label: (
            <Link
              to="/koiList"
              onClick={() => handleCategorySelection(item.id)}
            >
              {item.categoryName}
            </Link>
          ),
        }));
        setKoiMenuItems(menuItems);
      } else {
        setError("The received data is not an array as expected.");
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching categories.");
    } finally {
      setLoading(false);
    }
  };
  const handleCategorySelection = (categoryID) => {
    dispatch(setSelectedCategory(categoryID));
  };

  useEffect(() => {
    fetchKoiCategories();
    handleCategorySelection();
  }, []);

  if (loading) return LoadingModal;
  if (error) return <p>Error: {error}</p>;
  const dropdownFish = [
    {
      key: "9",
      label: (
        <Link to="/koiList" target="_self" rel="noopener noreferrer">
          Cá Koi Nhật
        </Link>
      ),
    },
    {
      key: "10",
      label: (
        <Link to="/batch-fish" target="_self" rel="noopener noreferrer">
          Cá Koi theo lô
        </Link>
      ),
    },
  ];

  const newsMenuItems = [

    {
      key: "2",
      label: <Link to={"/list-blog"}>Tin tức cá Koi</Link>,
    },

  ];

  const profileMenuItems = [
    {
      key: "5",
      label: (
        <Link to="/profile" target="_self" rel="noopener noreferrer">
          Thông tin cá nhân
        </Link>
      ),
    },
    {
      key: "6",
      label: <Link to="/payment-history">Lịch sử mua hàng</Link>,
    },
    ...(decoded?.scope
      === "manager" || decoded?.scope === "staff"
      ? [
        {
          key: "8",
          label: <Link to="/admin">Quản lý</Link>,
        },
      ]
      : []),

    {
      key: "9",
      label: "Đăng xuất",
      onClick: () => handleSignOut(),
    },
  ];
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {

    setIsModalVisible(false);
    navigate("/login");
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };



  const consignmentID = localStorage.getItem("consignmentID");
  const consignmentMenuitems = [
    {
      key: "8",
      label: (
        <Link
          to={(consignmentID) ? "/status-consignment" : "/request-consignment"}
          onClick={(e) => {
            if (!user) {
              e.preventDefault(); // Prevent navigation if not logged in
              showModal(); // Show login prompt modal
            }
          }}
          target="_self"
          rel="noopener noreferrer"
        >
          Yêu cầu ký gửi Koi
        </Link>
      ),
    },
    {
      key: "9",
      label: (
        <Link
          to="/consignment-history"
          onClick={(e) => {
            if (!user) {
              e.preventDefault(); // Prevent navigation if not logged in
              showModal(); // Show login prompt modal
            }
          }}
        >
          Lịch sử ký gửi
        </Link>
      ),
    },
    {
      key: "kois",
      label: (
        <Link
          to="/my-consignment-koi"
          onClick={(e) => {
            if (!user) {
              e.preventDefault(); // Prevent navigation if not logged in
              showModal(); // Show login prompt modal
            }
          }}
        >
          Koi ký gửi của tôi
        </Link>
      ),
    },
  ];


  const handleSignOut = () => {
    localStorage.removeItem("consignmentID");
    dispatch(signOut());
    window.location.reload();
  };

  const userlogged = getLocalStorage('user')

  return (
    <>
      {/* navbar */}
      <div
        className="Navbar md:h-[450px] h-[450px] sm:h-[450px]    lg:h-[150px] xl:grid-cols-10  grid lg:grid-cols-10  2xl:grid-cols-10   
      w-full   lg:w-full xl:h-[150px]  2xl:h-[150px]   sm:col-span-12"
      >
        {/* logo */}
        <div
          className="w-full  col-span-12  h-full md:col-span-12 lg:col-span-1 lg:h-[150px] xl:col-span-1 flex flex-col justify-center
          sm:col-span-12 items-center "
        >
          <div className="logo w-[90px]  h-[90px] container ">
            <Link to="/">
              <img src={logo} alt="Logo" className="ms-[4px]" />
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

        <div
          className="categories h-[50px] col-span-12 sm:col-span-12 sm:w-full sm:h-[100px] 
         lg:col-span-3 lg:ms-10 lg:flex lg:items-center lg:justify-start lg:h-[150px]
         xl:grid xl:grid-cols-1 xl:ms-[50px] xl:col-span-3  
         2xl:col-span-3"

        >
          <ul className="flex flex-col sm:flex-row items-center justify-start sm:justify-center sm:h-[150px] lg:h-[150px]">


            {/* Combined "Danh mục" dropdown for xs and lg screens */}
            <li className="me-x  xs:block lg:block sm:hidden md:hidden xl:hidden 2xl:hidden">
              <Dropdown
                menu={{
                  items: [
                    { key: 'koi', label: 'Cá Koi Nhật', children: dropdownFish },
                    { key: 'news', label: 'Tin tức', children: newsMenuItems },
                    { key: 'consignment', label: 'Ký gửi', children: consignmentMenuitems },
                  ],
                }}
                trigger={["hover"]}
              >
                <Button
                  type="primary"
                  danger
                  className="cate-font mt-10 lg:mt-0 ps-1 w-auto h-[42px] box-border"
                >
                  <span className="h-[30px] ps-[3px]">Danh mục</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path d="M10.0002 12.5L5.8335 8.33331H14.1668L10.0002 12.5Z" fill="#EA4444" />
                  </svg>
                </Button>
              </Dropdown>
            </li>

            {/* Separate dropdowns for sm, md, xl, and 2xl screens */}
            <li className="me-x hidden xs:hidden lg:hidden sm:block md:block xl:block 2xl:block">
              <Dropdown menu={{ items: dropdownFish }} trigger={["hover"]}>
                <Button
                  type="primary"
                  danger
                  className="cate-font ps-1 w-auto h-[42px] box-border"
                >
                  <span className="h-full ps-[3px] pt-1">Cá Koi Nhật</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path d="M10.0002 12.5L5.8335 8.33331H14.1668L10.0002 12.5Z" fill="#EA4444" />
                  </svg>
                </Button>
              </Dropdown>
            </li>

            <li className="me-x hidden xs:hidden lg:hidden sm:block md:block xl:block 2xl:block">
              <Dropdown menu={{ items: newsMenuItems }} trigger={["hover"]}>
                <Button
                  type="primary"
                  danger
                  className="cate-font ps-1 w-auto h-[42px] box-border"
                >
                  <span className="h-[42px] ps-[3px] pt-1">Tin tức</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path d="M10.0002 12.5L5.8335 8.33331H14.1668L10.0002 12.5Z" fill="#EA4444" />
                  </svg>
                </Button>
              </Dropdown>
            </li>

            <li className="me-x hidden xs:hidden lg:hidden sm:block md:block xl:block 2xl:block">
              <Dropdown menu={{ items: consignmentMenuitems }} trigger={["hover"]}>
                <Button
                  type="primary"
                  danger
                  className="cate-font ps-1 h-[42px] box-border"
                >
                  <span className="h-[42px] ps-[3px] pt-1">Ký gửi</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path d="M10.0002 12.5L5.8335 8.33331H14.1668L10.0002 12.5Z" fill="#EA4444" />
                  </svg>
                </Button>
              </Dropdown>

              <Modal
                title="Thông báo"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                  <Button key="cancel" onClick={handleCancel}>
                    Hủy
                  </Button>,
                  <Button key="ok" type="primary" onClick={handleOk}>
                    Đăng nhập
                  </Button>,
                ]}
              >
                <p>Vui lòng đăng nhập mới để được trải nghiệm tính năng</p>
              </Modal>
            </li>

            <li className="me-x">
              {/* Uncomment if needed */}
              {/* <Button
        type="primary"
        danger
        className="my-0 mx-auto cate-font ps-1 w-[192px] h-[42px] box-border flex justify-center align-top pe-1"
      >
        <span className="w-[178px] h-[30px]">Hỗ trợ khách hàng</span>
      </Button> */}
            </li>
          </ul>
        </div>




        {/* //search */}
        <div
          className="md:mx-10 lg:mx-0  col-span-12 flex items-center xl:mx-20  justify-center md:justify-center sm:col-span-12 md:col-span-12 lg:w-[200px] md:flex  lg:h-[150px] lg:col-span-3 
    xl:w-[250px] xl:col-span-3 2xl:col-span-3 2xl:w-[300px]  relative"
        >
          <input
            type="search"
            className="h-[42px] sm:h-10 md:h-10 w-[300px] sm:w-[400px]  md:w-[400px] lg:w-[300px]  border rounded-[10px] border-solid border-[#e24242] pl-[44px] py-1 text-base 
      leading-[1.6] outline-none placeholder:text-neutral-500 focus:shadow-inset focus:border-red-500 dark:placeholder:text-[#FA4444]"
            placeholder="Tìm Kiếm"
            aria-label="Search"
          />
          <span
            className="lg:m-0 md:relative md:mb-10 md:right-[390px] mb-10 relative top-8 sm:relative sm:right-[390px] right-[290px] lg:absolute lg:right-[190px] lg:top-[75px] xl:absolute xl:right-[215px]  2xl:absolute 2xl:right-[265px]    transform -translate-y-1/2 text-neutral-500 dark:text-[#FA4444]"
            id="search-icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="flex justify-center items-center"
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
        <div className="w-full  h-full flex justify-end lg:flex lg:justify-end items-center sm:justify-center md:justify-center  col-span-5 lg:h-[150px] sm:col-span-12 md:col-span-12 lg:col-span-2 xl:col-span-3 2xl:col-span-3">
          <Link to="/cart" className="me-10">
            <button className="relative  flex justify-end items-center ">
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
                <div
                  style={{
                    top: "-15px",
                    right: "-12px",
                    border: "1px #EA4444 solid",
                  }}
                  className="rounded-full  w-[18px] h-[18px] absolute flex justify-center items-center "
                >
                  <p className="text-sm text-center text-[#EA4444]">
                    {items?.length}
                  </p>
                </div>
              </div>
            </button>
          </Link>

          {userlogged ? (
            <div className="w-[80.75px] h-[36.75px] relative flex-col mt-[-5px] justify-start items-start inline-flex">
              <span>
                <ul>
                  <li>
                    <Dropdown
                      menu={{ items: profileMenuItems }}
                      trigger={["hover"]}
                    >
                      <Button className="logoutButton text-[#FA4444] border-[1px] border-[#FA4444] w-[24] h-[42px]">
                        <img
                          src={Vector}
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
