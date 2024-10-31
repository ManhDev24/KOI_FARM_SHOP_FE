import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FishApi from "../../apis/Fish.api";
import { Breadcrumb, Button, Col, Image } from "antd";
import { addToCart } from "../../Redux/Slices/Cart_Slice";
import { useDispatch } from "react-redux";
import fish from "/img/SOWA.webp";
import LoadingModal from "../Modal/LoadingModal";
import ComparisonModal from "../Modal/ComparisonModal";
const FishDetail = () => {
  const { id } = useParams(); // Get the fish ID from the URL
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddToCompare = (item) => {
    if (
      selectedItems.length < 2 &&
      !selectedItems.some((i) => i.id === item.id)
    ) {
      setSelectedItems([...selectedItems, item]);
    } else if (selectedItems.some((i) => i.id === item.id)) {
      alert("This item has already been added to the comparison.");
    } else {
      alert("You can only compare a maximum of 2 items.");
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
      alert("Please select at least one fish to compare.");
    }
  };

  // Close comparison modal
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Fetch fish details using the useQuery hook
  const { data, error, isLoading } = useQuery({
    queryKey: ["fishDetail", id],
    queryFn: () => FishApi.getFishDetail(id),
  });

  // Handle loading state
  if (isLoading) {
    return LoadingModal;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const fishDetails = data || {}; // Access the fish data from the API response
  const fishRecommend = data.list;
  // If koiImage is a string, wrap it in an array for the carousel
  const images = Array.isArray(fishDetails.koiImage)
    ? fishDetails.koiImage
    : [fishDetails.koiImage || "/default-fish.jpg"];

  // Handle moving to the next image
  const handleNextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1); // Move to the next image
    }
  };

  // Handle moving to the previous image
  const handlePreviousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Move to the previous image
    }
  };

  const getTranslateX = () => {
    const itemWidth = 90;
    const itemMargin = 16;
    const totalItemWidth = itemWidth + itemMargin;
    return -(currentIndex * totalItemWidth);
  };

  const handleAddToCart = (fish) => {
    dispatch(
      addToCart({
        ...fish,
        quantity: 1,
        isBatch: false,
      })
    );
  };

  const selectedImage = images[currentIndex];

  const formatPrice = (price) => {
    if (!price) return "Chưa có giá"; // Handle missing price
    return `${price.toLocaleString("vi-VN")} VND`; // Format with 'vi-VN' locale
  };

  return (
    <div className=" group flex-col w-full items-center justify-center my-[80px]">
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

      <div className="w-full flex justify-center">
        <div className="flex- w-[950px] flex-col my-[80px]">
          {/* Detail section of the selected fish */}
          {fishDetails && (
            <div className="grid grid-cols-4">
              <div className="col-span-2">
                <div className="flex justify-end me-10">
                  <div className="relative h-[26px] z-50 w-[86px] bg-[#FFFFFF] rounded-ee-[10px] rounded-tl-[5px] left-[86px] border-[#FA4444] border-2 text-center text-[#FA4444]">
                    {fishDetails.status === 2 ? 'Đã bán' : fishDetails.status === 1 ? 'Đang bán' : fishDetails.status === 3 ? 'ký gửi' : null}</div>
                  <Image
                    src={selectedImage}
                    // {selectedImage}  // Use the selected image from the carousel
                    width={250}
                    height={350}
                    className="w-[250px] h-[350px] rounded-[10px]"
                    alt={fishDetails.category || "Koi Fish"}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="w-[300px] h-[350px] rounded-[10px] border-2 border-[#FA4444]">
                  <div className="text-center my-2 text-[#FA4444] font-bold">
                    {fishDetails.category} {fishDetails.gender ? "Đực" : "Cái"}{" "}
                    {fishDetails.age} tuổi {fishDetails.size} cm
                  </div>
                  <div className="ms-6">
                    <div className="mb-2 ">
                      Giới tính: {fishDetails.gender ? "Koi Đực" : "Koi Cái"}
                    </div>
                    <div className="mb-2">Giống: {fishDetails.category}</div>
                    <div className="mb-2">Tuổi: {fishDetails.age}</div>
                    <div className="mb-2">
                      Kích thước: {fishDetails.size} cm
                    </div>
                    <div className="mb-2">
                      Tính cách:{" "}
                      {fishDetails.personality || "Không có thông tin"}
                    </div>
                    <div className="mb-2">Nguồn gốc: {fishDetails.origin}</div>
                    <div className="">
                      Giá:{" "}
                      <div className="text-center font-bold text-[24px] !mb-[5px] text-[#FA4444]">
                        {fishDetails.price != null && !isNaN(fishDetails.price)
                          ? fishDetails.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                          : "Chưa có giá"}
                      </div>
                    </div>
                    <div className="flex justify-center me-6">
                      {fishDetails.status === 1 || fishDetails.status === 3 ?
                        < Link >
                          <Button
                            onClick={() => handleAddToCart(fishDetails)}
                            className="w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]"
                          >
                            Đặt Mua
                          </Button>
                        </Link>
                        : <></>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Thumbnail Carousel */}
          {/* <div className="flex justify-start mt-5 ms-14">
            <div className="border-2 border-[#FA4444]">
              <div className="overflow-hidden w-[850px] my-4">
                <div
                  className="flex transition-transform duration-300"
                  style={{ transform: `translateX(${getTranslateX()}px)` }}
                >
                  {images.map((image, index) => (
                    <div key={index} className="mr-4 last:mr-0">
                      <img
                        src={image}
                        className={`h-[120px] w-[90px] transition-transform duration-300 ${index === currentIndex ? 'scale-125' : ''}`}
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Controls */}
          {/* <div className="flex justify-between mt-4">
                <button
                  className={`px-4 py-2 bg-blue-500 text-white rounded ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handlePreviousImage}
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>
                <button
                  className={`px-4 py-2 bg-blue-500 text-white rounded ${currentIndex >= images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleNextImage}
                  disabled={currentIndex >= images.length - 1}
                >
                  Next
                </button>
              </div> */}

          {/* fishDetail */}
          <div className=" flex justify-center my-[40px]">
            <div className="">
              {fishDetails && (
                <>
                  <div className="w-[592px] border-2 border-[#FA4444] ms-[12px] ">
                    <div className="flex justify-center mt-4 font-bold ">
                      MÔ TẢ CHI TIẾT
                    </div>
                    <div className="ms-3 font-bold">
                      <div>Giống: {fishDetails.category}</div>
                      <div>Tuổi: {fishDetails.age}</div>
                      <div>
                        Độ thuần chủng:{" "}
                        {fishDetails.purebred ? "Nhập khẩu nhật" : "Lai F1"}
                      </div>
                      <div>Nguồn gốc: {fishDetails.origin}</div>
                      <div>Tính cách: {fishDetails.personality}</div>
                      <div>Chế độ ăn:</div>
                      <div>Độ cứng nước: {fishDetails.water}</div>
                      <div>Nhiệp độ nước: {fishDetails.temperature} &deg;C</div>
                      <div>Độ pH: {fishDetails.ph}</div>
                      <div>Sức khỏe: {fishDetails.health}</div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            <h1
              className="flex justify-center font-bold font- border-2 border-[#FA4444]"
              style={{ fontSize: "24px", fontFamily: "Merriweather, serif" }}
            >
              Gợi ý Koi
            </h1>
            {fishRecommend && fishRecommend.length > 0 ? (
              <div className="flex mt-10">
                {fishRecommend.map((card) => (
                  <Link to={`/fish-detail/${card.id}`}>
                    <Col
                      key={card.id} // Use `id` as key
                      className="w-[250px] h-[645px] mx-10 mb-10"
                    >
                      {/* Card content */}
                      <div className="relative w-[250px]">
                        {/* Tag */}
                        <div className="absolute w-[86px] bg-[#FFFFFF] rounded-ee-[10px] rounded-tl-[5px] text-center text-[#FA4444]">
                          {card.status ? "Đang bán" : "Đã bán"}
                        </div>
                        {/* Koi fish image */}
                        <div className="rounded-[10px]">
                          <img
                            src={card.koiImage}
                            className="w-[250px] h-[354px] rounded-t-[8px] box-border"
                            alt={card.category}
                          />
                        </div>
                      </div>
                      {/* Koi fish details */}
                      <div className="flex flex-col w-[250px] h-[320px] bg-[#FFFFFF] border border-t-0 border-x-2 border-b-2 border-[#FA4444] rounded-b-[10px]">
                        <h1 className="my-0 mx-auto text-[#FA4444] font-bold text-[20px]">
                          {card.category} {card.gender ? "Koi Cái" : "Koi đực"}
                          <div>
                            {card.age} tuổi {card.size}cm
                          </div>
                        </h1>
                        <div className="my-[10px] mx-[10px]">
                          <div className="flex flex-col">
                            <div className="h-7">Người bán: {card.origin}</div>
                            <div className="h-6">
                              Giới tính: {card.gender ? "Koi Cái" : "Koi đực"}
                            </div>
                            <div className="h-6">Tuổi: {card.age}</div>
                            <div className="h-6">Kích thước: {card.size}cm</div>
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
                            <Link>
                              <Button
                                onClick={(e) => {
                                  handleAddToCart(card);
                                }}
                                className="w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]"
                              >
                                Đặt Mua
                              </Button>
                            </Link>
                            <Link>
                              <div
                                className="absolute top-[10px] right-[10px] z-50" // Adjusted position: top right of the card
                                onClick={(e) => {
                                  handleAddToCompare(card);
                                }}
                              >
                                <Button
                                  onClick={(e) => {
                                    handleAddToCompare(card);
                                  }}
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
                                    <h5 className="mx-1 my-0 !text-center">
                                      So sánh
                                    </h5>
                                  </div>
                                </Button>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Link>
                ))}
              </div>
            ) : (
              <div></div>
            )}
            <div>
              <div>
                <ComparisonModal
                  isOpen={isModalOpen}
                  onClose={handleModalClose}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  removeItem={removeItemFromCompare}
                />

                <Button
                  onClick={handleCompare}
                  className={`bg-[#FA4444] text-white fixed z-50 left-[100px] top-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${selectedItems.length === 0 ? "disabled" : ""
                    }`}
                  disabled={selectedItems.length === 0}
                >
                  Xem So Sánh ({selectedItems.length}) Cá Koi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default FishDetail;
