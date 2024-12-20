import React, { useState } from "react";
import { Breadcrumb, Col, Input, Pagination, Slider } from "antd";
import { Link } from "react-router-dom";
import { Button, Dropdown, Flex, Row } from "antd";
import { useQuery } from "@tanstack/react-query";
import FishApi from "../../apis/Fish.api";
import LoadingModal from "../Modal/LoadingModal";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/Slices/Cart_Slice";
import ComparisonModal from "../Modal/ComparisonModal";
import { motion } from 'framer-motion';
import { toast } from "react-toastify";

const ListFish = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectDate, setSelectDate] = useState("");
  const [selectStatus, setSelectStatus] = useState("");
  const [selectPrice, setSelectPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSize, setCurrentSize] = useState(200);
  const [currentPrice, setCurrentPrice] = useState(200000000);
  const [genderFilter, setGenderFilter] = useState(0);
  const [sortField, setSortField] = useState(0);
  const [sortDirection, setSortDirection] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const dispatch = useDispatch();
  const handleAddToCart = (fish) => {
    dispatch(
      addToCart({
        ...fish,
        quantity: 1,
        isBatch: false,
      })
    );
  };
  const {
    data: KoiList,
    isLoading: isLoadingKoiList,
    isError: isErrorLoadingKoiList,
  } = useQuery({
    queryKey: ["KoiList", currentPage],
    queryFn: () => FishApi.getListFish(currentPage),
    keepPreviousData: true,
  });
  const {
    data: koiListFilter,
    isLoading: isLoadingKoiListFilter,
    isError: isErrorLoadingKoiListFilter,
  } = useQuery({
    queryKey: [
      "koiListFilter",
      currentPage,
      selectedCategory,
      selectedGender,
      selectDate,
      selectStatus,
      selectPrice,
      currentSize,
      currentPrice,
    ],
    queryFn: () =>
      FishApi.getFilteredKoiFish(
        selectedCategory,
        selectStatus,
        selectedGender,
        0,
        currentSize,
        300000,
        currentPrice,
        "price",
        selectPrice,
        currentPage,
        pageSize
      ),
    enabled: isFiltered,
    keepPreviousData: true,
  });
  koiListFilter;

  const koiResponseList = KoiList?.koiFishReponseList;

  const koiToDisplay = isFiltered
    ? koiListFilter?.koiFishReponseList
    : koiResponseList;

  const totalPage = isFiltered
    ? koiListFilter?.totalElements
    : KoiList?.totalElements;
  if (isLoadingKoiList) {
    return <LoadingModal />;
  }
  if (isErrorLoadingKoiList) {
    return <h1>Error</h1>;
  }

  const CategoryItem = [
    {
      key: "Danh mục",
      label: "Danh mục",
      value: "",
    },
    {
      key: "Koi showa",
      label: "Koi showa",
      value: "1",
    },
    {
      key: "Koi asagi",
      label: "Koi asagi",
      value: "2",
    },
    {
      key: "Koi karashi",
      label: "Koi karashi",
      value: "3",
    },
    {
      key: "Koi Benikoi",
      label: "Koi Benikoi",
      value: "4",
    },
  ];

  const newDateFilterCategoryItem = [
    {
      key: "Sắp xếp theo ngày",
      label: "Sắp xếp theo ngày",
      value: "",
    },
    {
      key: "latest",
      label: "Ngày Mới nhất",
      value: "1",
    },
    {
      key: "oldest",
      label: "Ngày Cũ nhất",
      value: "2",
    },
  ];
  const priceCategoryItem = [
    {
      key: "Sắp xếp theo giá",
      label: "Sắp xếp theo giá",
      value: "",
    },
    {
      key: "LowestPrices",
      label: "Giá từ cao đến thấp",
      value: "1",
    },
    {
      key: "HighestPrices",
      label: " Giá từ thấp đến cao",
      value: "2",
    },
  ];
  const statusCategoryItem = [
    {
      key: "Trạng thái bán",
      label: "Trạng thái bán",
      value: "",
    },
    {
      key: "Đang bán",
      label: "Đang bán",
      value: "1",
    },
    {
      key: "Đã bán",
      label: "Đã bán",
      value: "2",
    },
    {
      key: "Ký gửi",
      label: "Ký gửi",
      value: "3",
    },
  ];
  const genderCategoryItem = [
    {
      key: "Giới tính",
      label: "Giới tính",
      value: "",
    },
    {
      key: "Koi Cái",
      label: "Koi Cái",
      value: "0",
    },
    {
      key: "Koi Đực",
      label: "Koi Đực",
      value: "1",
    },
  ];

  const handleMenuClickCategory = (item) => {
    setSelectedCategory(item.value);
    setIsFiltered(true);
  };
  const handleMenuClickGender = (item) => {
    setSelectedGender(item.value);
    setIsFiltered(true);
  };
  const handleMenuClickDate = (item) => {
    setSelectDate(item.value);
    setIsFiltered(true);
  };
  const handleMenuClickStatus = (item) => {
    setSelectStatus(item.value.trim());
    setIsFiltered(true);
  };
  const handleMenuClickPrice = (item) => {
    setSelectPrice(item.value);
    setIsFiltered(true);
  };
  const handleAddToCompare = (item) => {
    if (
      selectedItems.length < 2 &&
      !selectedItems.some((i) => i.id === item.id)
    ) {
      setSelectedItems([...selectedItems, item]);
    } else if (selectedItems.some((i) => i.id === item.id)) {
      toast("Koi này đã được thêm vào để so sánh");
    } else {
      toast.error("Bạn chi có thể thêm tối đa 2 Koi.");
    }
  };
  const removeItemFromCompare = (itemToRemove) => {
    const updatedItems = selectedItems.filter(
      (item) => item.id !== itemToRemove.id
    );
    setSelectedItems(updatedItems);
  };

  // Open comparison modal
  const handleCompare = () => {
    if (selectedItems.length > 0) {
      setIsModalOpen(true);
    } else {
      toast.error("Hãy lựa chọn ít nhất 1 Koi để so sánh.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="ListFish group">
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
      <div className="grid grid-cols-12 gap-2 mt-20">
        <div className="flex  items-start justify-end filter col-span-3">
          <div
            style={{
              border: "1px solid black",
              borderRadius: "10px",
            }}
            className="w-[280px] h-[920px]  "
          >
            <div className="flex flex-col justify-center items-center mt-2">
              <div className="filter name">
                <p className="text-xl font-bold">Tìm kiếm Nâng cao</p>
              </div>
              <div className="grid grid-cols-1 gap-5 ">
                <div className="dropdown_filter">
                  <Dropdown
                    menu={{
                      items: CategoryItem.map((item) => ({
                        ...item,
                        key: item.key,
                        label: item.label,
                        onClick: () => handleMenuClickCategory(item),
                      })),
                    }}
                    arrow
                  >
                    <Button
                      style={{
                        borderRadius: "10px",
                        border: "1px solid black",
                      }}
                      className="h-[50px] w-[250px] text-xl flex justify-between"
                    >
                      <div className="text-center text-xl font-bold flex justify-center items-center m-0">
                        <p>
                          {selectedCategory === "1"
                            ? "Koi showa"
                            : selectedCategory === "2"
                              ? "Koi asagi"
                              : selectedCategory === "3"
                                ? "Koi karashi"
                                : selectedCategory === "4"
                                  ? "Koi Benikoi"
                                  : "Danh mục"}
                        </p>
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
                {/* <div className="dropdown_filter">
                  <Dropdown
                    menu={{
                      items: CategoryItem,
                    }}
                    arrow
                  >
                    <Button
                      style={{
                        borderRadius: "10px",
                        border: "1px solid black",
                      }}
                      className="h-[50px] w-[250px] text-xl flex justify-between"
                    >
                      <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                        <p>Nguồn gốc</p>
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
                </div> */}
                <div className="dropdown_filter">
                  <Dropdown
                    menu={{
                      items: genderCategoryItem.map((item) => ({
                        ...item,
                        key: item.key,
                        label: item.label,
                        onClick: () => handleMenuClickGender(item),
                      })),
                    }}
                    arrow
                  >
                    <Button
                      style={{
                        borderRadius: "10px",
                        border: "1px solid black",
                      }}
                      className="h-[50px] w-[250px] text-xl flex justify-between"
                    >
                      <div className="text-center text-xl font-bold flex justify-center items-center m-0">
                        <p>
                          {selectedGender === "0"
                            ? "Koi Cái"
                            : selectedGender === "1"
                              ? "Koi Đực"
                              : "Giới tính"}
                        </p>
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
                {/* <div className="dropdown_filter">
                  <Dropdown
                    menu={{
                      items: newDateFilterCategoryItem.map((item) => ({
                        ...item,
                        key: item.key,
                        label: item.label,
                        onClick: () => handleMenuClickDate(item),
                      })),
                    }}
                    arrow
                  >
                    <Button
                      style={{
                        borderRadius: "10px",
                        border: "1px solid black",
                      }}
                      className="h-[50px] w-[250px] text-xl flex justify-between"
                    >
                      <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                        <p>
                          {selectDate === "1"
                            ? "Ngày Mới nhất"
                            : selectDate === "2"
                            ? "Ngày Cũ nhất"
                            : "Sắp xếp theo ngày"}{" "}
                        </p>
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
                </div> */}
                <div className="dropdown_filter">
                  <Dropdown
                    menu={{
                      items: statusCategoryItem.map((item) => ({
                        ...item,
                        key: item.key,
                        label: item.label,
                        onClick: () => handleMenuClickStatus(item),
                      })),
                    }}
                    arrow
                  >
                    <Button
                      style={{
                        borderRadius: "10px",
                        border: "1px solid black",
                      }}
                      className="h-[50px] w-[250px] text-xl flex justify-between"
                    >
                      <div className="text-center text-xl font-bold flex justify-center items-center m-0">
                        <p>
                          {selectStatus === "1"
                            ? "Đang bán"
                            : selectStatus === "2"
                              ? "Đã bán"
                              : selectStatus === "3"
                                ? "Ký gửi"
                                : "Trạng thái bán"}{" "}
                          {/* Default label */}
                        </p>
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
                      items: priceCategoryItem.map((item) => ({
                        ...item,
                        key: item.key,
                        label: item.label,
                        onClick: () => handleMenuClickPrice(item),
                      })),
                    }}
                    arrow
                  >
                    <Button
                      style={{
                        borderRadius: "10px",
                        border: "1px solid black",
                      }}
                      className="h-[50px] w-[250px] text-xl flex justify-between"
                    >
                      <div className="text-center text-xl font-bold flex justify-center items-center  m-0 ">
                        <p>
                          {selectPrice === "1"
                            ? "Giá từ cao đến thâp"
                            : selectPrice === "2"
                              ? "Giá từ thâp đến cao"
                              : "Sắp xếp theo giá"}
                        </p>
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
                  <div>
                    <div className="text-xl font-bold">Kích thước (cm)</div>
                    <Slider
                      min={1}
                      max={200}
                      step={10}
                      marks={{
                        20: { label: "20 cm", style: { marginLeft: '-10px' } }, // Adjust positioning as needed
                        60: { label: "60 cm", style: { marginLeft: '-10px' } },
                        100: { label: "100 cm", style: { marginLeft: '-10px' } },
                        150: { label: "150 cm", style: { marginLeft: '-10px' } },
                        200: { label: "200 cm", style: { marginLeft: '-20px' } }
                      }}
                      defaultValue={100}
                      trackStyle={{ backgroundColor: "#EA4444" }}
                      handleStyle={{ borderColor: "#EA4444" }}
                      dotStyle={{ borderColor: "#EA4444" }}
                      activeDotStyle={{ borderColor: "#EA4444" }}
                      railStyle={{ backgroundColor: "#ffcccc" }}
                      onAfterChange={(value) => {
                        setCurrentSize(value);
                        setIsFiltered(true);
                      }}
                    />
                  </div>
                </div>
                <div className="dropdown_filter">
                  <div>
                    <div className="text-xl font-bold">Giá bán</div>
                    <Slider
                      min={300000}
                      max={200000000}
                      defaultValue={200000000}
                      step={10000}
                      trackStyle={{ backgroundColor: "#EA4444" }}
                      handleStyle={{ borderColor: "#EA4444" }}
                      dotStyle={{ borderColor: "#EA4444" }}
                      activeDotStyle={{ borderColor: "#EA4444" }}
                      railStyle={{ backgroundColor: "#ffcccc" }}
                      onAfterChange={(value) => {
                        setCurrentPrice(value);
                        setIsFiltered(true);
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  <div className="mb-3">
                    <p className="text-xl font-bold">Giá thấp nhất:</p>
                    <Input
                      value={new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(300000)}
                      readOnly
                    />
                  </div>
                  <div>
                    <p className="text-xl font-bold">Giá cao nhất:</p>
                    <Input
                      min={310000}
                      value={new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(currentPrice)}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="w-[1110px] mx-auto my-0 pb-1 pt-1 mb-3 list-fish col-span-9 "
          style={{ boxShadow: "4px 4px 4px 4px rgba(0, 0, 0, 0.25)" }}
        >
          {koiToDisplay?.length === 0 && (
            <div className="flex justify-center items-center mt-10">
              <h2 className="text-3xl font-bold">
                Không tìm thấy cá koi phù hợp
              </h2>
            </div>
          )}
          <div className="my-[80px] flex justify-center items-start ">
            <Flex className="justify-center">
              <Row gutter={[16, 16]} justify="center" className="w-[950px] grid grid-cols-3">
                {koiToDisplay?.map((card) => {
                  if (card?.status !== 4)
                    return (
                      <Link to={`/fish-detail/${card.id}`} key={card.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Col className="w-[250px] h-[645px] mx-10 mb-10">
                            <div className="relative w-[250px]">
                              <div
                                className="absolute border-[1px] border-[#FA4444] w-[86px] 
                                bg-[#FFFFFF] rounded-ee-[10px] 
                                rounded-tl-[5px] text-center 
                                text-[#FA4444]"
                              >
                                {card.status === 1
                                  ? "Đang bán"
                                  : card.status === 2
                                    ? "Đã bán"
                                    : card.status === 3
                                      ? "Ký gửi"
                                      : card.status === 4
                                        ? "Chờ duyệt đơn ký gửi"
                                        : card.status === 5
                                          ? "Ký gửi chăm sóc"
                                          : ""}
                              </div>
                              <div className="rounded-[10px]">
                                <img
                                  src={card.koiImage}
                                  className="w-[250px] h-[354px] rounded-t-[8px] box-border"
                                  alt={card.category}
                                  style={{ width: "250px" }}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col w-[250px] h-[300px] bg-[#FFFFFF] border border-t-0 border-x-2 border-b-2 border-[#FA4444] rounded-b-[10px]">
                              <h1 className="my-0 mx-auto text-[#FA4444] font-bold text-[20px]">
                                {card.categoryName}
                              </h1>
                              <div className="my-[10px] mx-[10px]">
                                <div className="flex flex-col">
                                  <div className="h-7 text-lg font-bold flex justify-center text-[#FA4444] mb-5 ">
                                    {card.category} {card.size} cm {card.age} tuổi
                                  </div>
                                  <div className="h-7">Người bán: {card.origin}</div>
                                  <div className="h-6">Giới tính: {card.gender ? "Koi Đực" : "Koi Cái"}</div>
                                  <div className="h-6">Tuổi: {card.age}</div>
                                  <div className="h-6">Kích thước: {card.size} cm</div>
                                  <div className="h-6">Nguồn gốc: {card.origin}</div>
                                  <div className="h-6">Giống: {card.category}</div>
                                </div>
                                <div className="text-center">
                                  <div className="my-[10px] text-[20px] font-bold">
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(card.price)}
                                  </div>
                                  {card.status !== 2 ? (
                                    <Link>
                                      <Button
                                        onClick={() => {
                                          handleAddToCart(card);
                                        }}
                                        className="w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]"
                                      >
                                        Đặt Mua
                                      </Button>
                                      <Link>
                                        <div
                                          className="absolute top-[3px]  z-10 right-[-5px] "
                                          onClick={(e) => {
                                            handleAddToCompare(card);
                                          }}
                                        >
                                          <Button
                                           
                                            className="!p-0 !py-1 w-[100px] !border-0 h-fit hover:!border-[#FA4444] hover:!text-[#FA4444] flex justify-around"
                                          >
                                            <div className="flex justify-center items-center">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="1em"
                                                height="1em"
                                                className="flex"
                                                viewBox="0 0 24 24"
                                              >
                                                <g fill="none" fillRule="evenodd">
                                                  <path
                                                    d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4z"
                                                    fill="currentColor"
                                                  />
                                                </g>
                                              </svg>
                                              <h5 className="mx-1 my-0 !text-center">So sánh</h5>
                                            </div>
                                          </Button>
                                        </div>
                                      </Link>
                                    </Link>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </Col>
                        </motion.div>
                      </Link>
                    );
                })}
              </Row>
            </Flex>
          </div>
          {koiToDisplay?.length > 0 && (
            <div className="pagination flex justify-end mb-3 me-3">
              <Pagination
                defaultCurrent={currentPage}
                total={totalPage}
                pageSize={pageSize}
                onChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <ComparisonModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        removeItem={removeItemFromCompare}
      />

      <Button
        onClick={handleCompare}
        className={`bg-[#FA4444] text-white fixed z-40 left-[100px] top-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${selectedItems.length === 0 ? "disabled" : ""
          }`}
        disabled={selectedItems.length === 0}
      >
        Xem So Sánh ({selectedItems.length}) Cá Koi
      </Button>
    </div>
  );
};

export default ListFish;
