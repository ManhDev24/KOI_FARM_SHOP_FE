import React, { useEffect, useState } from "react";
import { Breadcrumb, Col, Input, Pagination, Slider } from "antd";
import { Link } from "react-router-dom";
import { Button, Dropdown, Flex, Row } from "antd";
import { useQuery } from "@tanstack/react-query";
import FishApi from "../../apis/Fish.api";
import LoadingModal from "../Modal/LoadingModal";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/Slices/Cart_Slice";
import { toast } from "react-toastify";
import BatchComparisonModal from "../Modal/BatchComparisonModal ";

const BatchFish = () => {

  const [selectedCategory, setSelectedCategory] = useState("");

  const [isFiltered, setIsFiltered] = useState(false);
  const [selectAge, setSelectAge] = useState("");
  const [selectPrice, setSelectPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSize, setCurrentSize] = useState(); // Max size
  const [currentPrice, setCurrentPrice] = useState(1000000000); // Max price
  const [avgSize, setAvgSize] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [pageSize, setPageSize] = useState(9);

  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleAddToCart = (fish) => {
    dispatch(
      addToCart({
        ...fish,
        quantity: 1,
      })
    );
  };

  // const {
  //   data: KoiLists,
  //   isLoading: isLoadingKoiLists,
  //   isError: isErrorLoadingKoiLists,
  // } = useQuery({
  //   queryKey: ["KoiLists", currentPage],
  //   queryFn: () => FishApi.getListBatchFishByCategory(currentPage),
  //   keepPreviousData: true,
  // });


  //koibatchfish
  const {
    data: KoiList,
    isLoading: isLoadingKoiList,
    isError: isErrorLoadingKoiList,
  } = useQuery({
    queryKey: ["KoiList", currentPage, pageSize],
    queryFn: () => FishApi.getListBatchFish(currentPage, pageSize),
    keepPreviousData: true,
  });



  //koiListFilter
  const {
    data: filteredKoiBatchList,
    isLoading: isLoadingFilteredKoiBatchList,
    isError: isErrorLoadingFilteredKoiBatchList,
  } = useQuery({
    queryKey: [
      "filteredKoiBatchList",
      currentPage,
      pageSize,
      selectedCategory,
      avgSize,
      selectAge,
      300000,
      currentPrice,
      "",
      sortDirection,
    ],
    queryFn: () =>
      FishApi.getFilteredBatchKoiFish(
        currentPage,
        pageSize,
        selectedCategory,
        avgSize,
        selectAge,
        300000,
        currentPrice,
        "price",
        sortDirection
      ),
    enabled: isFiltered,
    keepPreviousData: true,
  });



  filteredKoiBatchList;



  const koiResponseList = KoiList?.batchReponses;
  const updateKoiList = koiResponseList?.map((item) => {
    return {
      ...item,
      koiImage: "./img/showa2.jpg",
    };
  });


  const koiToDisplay = isFiltered
    ? filteredKoiBatchList?.batchReponses
    : updateKoiList;

  const totalItems = isFiltered
    ? filteredKoiBatchList?.totalElements
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
      value: ""
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

  // const newDateFilterCategoryItem = [
  //   {
  //     key: "latest",
  //     label: "Ngày Mới nhất",
  //     value: "1",
  //   },
  //   {
  //     key: "oldest",
  //     label: "Ngày Cũ nhất",
  //     value: "2",
  //   },
  // ];
  const priceCategoryItem = [
    {
      key: "HighestPrices",
      label: "Giá từ thấp đến cao",
      value: "1",
    },
    {
      key: "LowestPrices",
      label: "Giá từ cao đến thấp",
      value: "2",
    },
  ];
  const ageCategoryItem = [
    {
      key: "HighestAge",
      label: "Giá từ thấp đến cao",
      value: "1",
    },
    {
      key: "LowestAge",
      label: "Giá từ Thấp đến Cao",
      value: "2",
    },
  ];
  // const genderCategoryItem = [
  //   {
  //     key: "Koi Cái",
  //     label: "Koi Cái",
  //     value: "0",
  //   },
  //   {
  //     key: "Koi Đực",
  //     label: "Koi Đực",
  //     value: "1",
  //   },
  // ];

  const handleMenuClickCategory = (item) => {

    setSelectedCategory(item.value);
    setIsFiltered(true);
  };

  // const handleMenuClickGender = (item) => {
  //   setSelectedGender(+item.value);
  //   setIsFiltered(true);
  // };
  // const handleMenuClickDate = (item) => {
  //   setSelectDate(item.value);
  //   setIsFiltered(true);
  // };
  const handleMenuClickAge = (item) => {
    setSelectAge(item.value);
    setIsFiltered(true);
  };
  const handleMenuClickPrice = (item) => {
    setSelectPrice(item.value);
    setSortDirection(item.value);
    setIsFiltered(true);
  };

  const handleAddToCompare = (item) => {
    if (selectedItems.length < 2 && !selectedItems.some((i) => i.batchID === item.batchID)) {
      setSelectedItems([...selectedItems, item]); // Add item to the comparison list
    } else if (selectedItems.some((i) => i.batchID === item.batchID)) {
      alert('Lô cá này đã được thêm vào để so sánh');
    } else {
      alert('Bạn chỉ có thể thêm tối đa 2 lô cá.');
    }
  };
  const removeItemFromCompare = (itemToRemove) => {
    const updatedItems = selectedItems.filter((item) => item.batchID !== itemToRemove.batchID);
    setSelectedItems(updatedItems);
  };
  const handleCompare = () => {
    if (selectedItems.length > 0) {
      setIsModalOpen(true);
    } else {
      alert('Vui lòng chọn ít nhất một lô cá để so sánh.');
    }
  };

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
      <div className="grid grid-cols-12 gap-2 mt-20">
        <div className="flex  items-start justify-end filter col-span-3">
          <div
            style={{
              border: "1px solid black",
              borderRadius: "10px",
              boxShadow: "10px 10px 4px 0 rgba(0, 0, 0, 0.25)",
            }}
            className="w-[280px] h-[920px]  "
          >
            <div className="flex flex-col justify-center items-center mt-2">
              <div className="filter name">
                <p className="text-xl font-bold">Tìm kiếm Nâng cao</p>
              </div>
              <div className="grid grid-cols-1 gap-5 ">
                <div className="dropdown_filter">

                  {/* //handlMenuClickCate */}
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
                                  : selectedCategory === " "
                                    ? "Danh Mục" : 'Danh Mục'
                          }
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
                {/* <div className="dropdown_filter">
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
                        <p>{selectedGender ? "Koi Đực" : "Koi Cái"}</p>
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
                          {selectDate == 1 ? "Ngày mới nhất" : "Ngày cũ nhất"}
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
                {/* <div className="dropdown_filter">
                  <Dropdown
                    menu={{
                      items: ageCategoryItem.map((item) => ({
                        ...item,
                        key: item.key,
                        label: item.label,
                        onClick: () => handleMenuClickAge(item),
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
                          {selectAge == 1
                            ? "Tuổi từ cao đến thấp"
                            : "Tuổi từ thấp đến cao"}
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
                            ? "Giá từ thấp đến cao"
                            : selectPrice === "2"
                              ? "Giá từ cao đến thấp"
                              : "Sắp xếp theo giá"
                          }

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
                  {/* <div>
                    <div className="text-xl font-bold">Kích thước (cm)</div>
                    <Slider
                      marks={{
                        0: "1 cm",
                        20: "20 cm",
                        40: "40 cm",
                        60: "60 cm",
                        80: "80 cm",
                        100: "100 cm",
                      }}
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
                  </div> */}
                </div>
                <div className="dropdown_filter">
                  <div>
                    <div className="text-xl font-bold">Giá bán</div>
                    <Slider
                      min={300000}
                      max={1000000000}
                      defaultValue={300000}
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
            <Flex className="justify-center ">

              <Row
                gutter={[16, 16]}
                justify="center"
                className="w-[950px] grid grid-cols-3"
              >
                {koiToDisplay?.map((card) => {
                  return (
                    <>
                      <Link to={`/batch-detail/${card.batchID}`}>
                        <Col
                          key={card.id}
                          className="w-[250px] h-[645px] mx-10 mb-10"
                        >
                          <div className="relative w-[250px]">
                            <div
                              className="absolute w-[86px] 
                                                bg-[#FFFFFF] rounded-ee-[10px] 
                                                rounded-tl-[5px] text-center 
                                                text-[#FA4444]"
                            >
                              {card.status === 1
                                ? "Đang bán"
                                : card.status === 2
                                  ? "Đã bán"
                                  : null}
                            </div>
                            <div className="rounded-[10px]">
                              <img
                                src={card.batchImg}
                                className="w-[250px] h-[354px] rounded-t-[8px] box-border"
                                alt={card.categoryName}
                                style={{ width: "250px" }}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col w-[250px] h-[320px] bg-[#FFFFFF] border border-t-0 border-x-2 border-b-2 border-[#FA4444] rounded-b-[10px]">
                            <h1 className="my-0 mx-auto text-[#FA4444] font-bold text-[20px]">
                              {card.categoryName} số lượng {card.quantity} độ tuổi {card.age}
                            </h1>
                            <div className="my-[10px] mx-[10px]  ">
                              <div className="flex flex-col ">
                                <div className="h-7">Người bán: {card.origin}</div>
                                <div className="h-6">
                                  Số lượng: {card.quantity}
                                </div>
                                <div className="h-6">Tuổi: {card.age}</div>
                                <div className="h-6">Kích thước: {card.avgSize}cm</div>
                                <div className="h-6">Nguồn gốc: {card.origin}</div>
                                <div className="h-6">Giống: {card.categoryName}</div>
                              </div>
                              <div className="text-center">
                                <div className="my-[10px] text-[20px] font-bold">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(card.price)}
                                </div>
                                {card.status !== 2 ? (
                                  <>
                                    <Link to='#'>
                                      <Button
                                        onClick={() => {
                                          handleAddToCart(card);
                                        }}
                                        className="w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]"
                                      >
                                        Đặt Mua
                                      </Button>
                                      <Button
                                        onClick={() => handleAddToCompare(card)}
                                        className="w-[120px] h-[30px] absolute top-[3px] right-[3px] text-[#FFFFFF] bg-[#EA9B00] rounded-[10px] mt-2"
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          width='1em'
                                          height='1em'
                                          className='flex'
                                          viewBox='0 0 24 24'
                                        >
                                          <g fill='none' fillRule='evenodd'>
                                            <path
                                              d='M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4z'
                                              fill='currentColor'
                                            />
                                          </g>
                                        </svg>
                                        So Sánh
                                      </Button>
                                    </Link>

                                  </>
                                ) : null}
                              </div>
                              {/* <>
                                <Button
                                  onClick={() => {
                                    handleAddToCart(card);
                                  }}
                                  className="w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]"
                                >
                                  Đặt Mua
                                </Button>
                              </> */}
                            </div>
                          </div>
                        </Col>
                        <Link>

                        </Link>

                      </Link>

                    </>

                  );
                })}
              </Row>

            </Flex>
          </div>

          {koiToDisplay?.length > 0 && (
            <div className="pagination flex justify-end mb-3 me-3">
              <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={pageSize}
                onChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <BatchComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBatches={selectedItems}
        setSelectedBatches={setSelectedItems}
        removeBatch={removeItemFromCompare}
      />
      <Button
        onClick={handleCompare}
        className={`bg-[#FA4444] text-white fixed z-40 left-[100px] top-[200px] ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={selectedItems.length === 0}
      >
        Xem So Sánh ({selectedItems.length}) Lô Cá Koi
      </Button>

    </div>
  );
};

export default BatchFish;
