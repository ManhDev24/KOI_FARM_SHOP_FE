import React, { useState, useEffect } from 'react';
import './introduction.css';
import { Link } from 'react-router-dom';
import FishApi from '../../../apis/Fish.api';
import ComparisonModal from '../../../modules/Modal/ComparisonModal';
import { Button, Col, Flex, Row } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../Redux/Slices/Cart_Slice';
import LoadingModal from '../../../modules/Modal/LoadingModal';
import { motion } from 'framer-motion'
import { toast } from 'react-toastify';
const Knowledge = () => {
  const [categoryResponses, setCategoryResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [selectedItems, setSelectedItems] = useState([]); // State to store the selected items for comparison

  const dispatch = useDispatch(); // Initialize the dispatch hook

  // Helper function to handle image paths
  const getImageUrl = (imgPath) => {
    if (!imgPath) return '/img/default-banner.jpg'; // Default image if there's no cateImg
    return imgPath.startsWith('http') ? imgPath : imgPath.replace('./', '/');
  };

  // Fetch fish data from API
  useEffect(() => {
    const fetchKoiFishData = async () => {
      try {
        const data = await FishApi.getKnowledgeFishList();

        const categoryResponses = data.categoryReponses;
        if (!Array.isArray(categoryResponses)) {
          throw new Error('categoryReponses không phải là mảng');
        }
        setCategoryResponses(categoryResponses);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
        setError(error.message || 'Đã xảy ra lỗi khi lấy danh mục.');
      } finally {
        setLoading(false);
      }
    };

    fetchKoiFishData();
  }, []);


  const handleAddToCompare = (item) => {
    if (selectedItems.length < 2 && !selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]); // Thêm mục vào danh sách so sánh
    } else if (selectedItems.some((i) => i.id === item.id)) {
      toast('Mục này đã được thêm vào danh sách so sánh.');
    } else {
      toast('Bạn chỉ có thể so sánh tối đa 2 mục.');
    }
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


  const removeItemFromCompare = (itemToRemove) => {
    const updatedItems = selectedItems.filter((item) => item.id !== itemToRemove.id);
    setSelectedItems(updatedItems);
  };


  const handleCompare = () => {
    if (selectedItems.length > 0) {
      setIsModalOpen(true);
    } else {
      toast('Hãy lựa chọn ít nhất 1 cá.');
    }
  };


  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return LoadingModal;
  }

  return (
    <div className='group'>
      {/* Title */}
      <Row justify='center'>
        <div className='w-[950px] h-[50px] bg-white text-[36px] text-[#FA4444] text-center border border-3 border-[#FA4444] my-[80px]'>
          <span className='h-[38px]' style={{ fontFamily: 'Merriweather, serif' }}>KIẾN THỨC CÁ KOI</span>
        </div>
      </Row>

      {/* Display each category with a banner and Koi fish list */}
      {categoryResponses.map((category, index) => (
        <div key={index} className='group'>
          {/* Banner for each category */}
          <Row justify='center' style={{ marginBottom: '80px' }}>
            <Col>
              <img
                src={getImageUrl(category.cateImg)}
                alt={`Banner ${index}`}
                className='w-[2000px] h-[525px]'
              />
            </Col>
          </Row>

          {/* Koi fish list in the category */}
          <Flex horizontal className="justify-center">
            <Row gutter={[16, 16]} justify="center" className="w-[950px] grid grid-cols-3">
              {category.koiFishList && category.koiFishList.length > 0 ? (
                category.koiFishList.map((card) => (
                  <Link to={`/fish-detail/${card.id}`} key={card.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Col className="w-[250px] h-[645px] mx-10 mb-10">
                        {/* Card content */}
                        <div className="relative w-[250px]">
                          {/* Tag */}
                          <div className="absolute w-[86px] bg-[#FFFFFF] rounded-ee-[10px] rounded-tl-[5px] border-[#FA4444] border-2 text-center text-[#FA4444]">
                            {card.status === 1 ? 'Đang bán' : card.status === 3 ? 'ký gửi' : 'Đã bán'}
                          </div>
                          {/* Koi fish image */}
                          <div className="rounded-[10px]">
                            <img
                              src={getImageUrl(card.koiImage)}
                              className="w-[250px] h-[354px] rounded-t-[8px] box-border"
                              alt={category.categoryName}
                            />
                          </div>
                        </div>
                        {/* Koi fish details */}
                        <div className="flex flex-col w-[250px] h-[290px] bg-[#FFFFFF] border border-t-0 border-x-2 border-b-2 border-[#FA4444] rounded-b-[10px]">
                          <h1 className="my-0 mx-auto text-[#FA4444] font-bold text-[20px]">
                            {category.categoryName}
                          </h1>
                          <div className="my-[10px] mx-[10px]">
                            <div className="flex flex-col">
                              <div className="h-7">Người bán: {card.origin}</div>
                              <div className="h-6">Giới tính: {card.gender ? "Koi Cái" : "Koi đực"}</div>
                              <div className="h-6">Tuổi: {card.age}</div>
                              <div className="h-6">Kích thước: {card.size}cm</div>
                              <div className="h-6">Nguồn gốc: {card.origin}</div>
                              <div className="h-6">Giống: {card.category}</div>
                            </div>
                            <div className="text-center">
                              <div className="my-[10px] text-[20px] font-bold">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(card.price)}
                              </div>
                              {card.status === 1 ? <Link>
                                <Button
                                  onClick={() => {
                                    handleAddToCart(card);
                                  }}
                                  className="w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]"
                                >
                                  Đặt Mua
                                </Button>
                              </Link> : card.status === 3 ? <Link>
                                <Button
                                  onClick={() => {
                                    handleAddToCart(card);
                                  }}
                                  className="w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]"
                                >
                                  Đặt Mua
                                </Button>
                              </Link> : <></>}
                              <Link>
                                <div
                                  className="absolute top-[10px] right-[10px] z-10"

                                >
                                  <Button
                                    onClick={() => {
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
                                      <h5 className="mx-1 my-0 !text-center">So sánh</h5>
                                    </div>
                                  </Button>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <p>Cá tạm thời không khả dụng.</p>
              )}
            </Row>
          </Flex>
        </div>
      ))
      }

      {/* Comparison Modal */}
      <ComparisonModal

        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        removeItem={removeItemFromCompare}
      />

      <Button
        onClick={handleCompare}
        className={`bg-[#FA4444] text-white fixed z-50 left-[100px] top-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${selectedItems.length === 0 ? 'disabled' : ''}`}
        disabled={selectedItems.length === 0}
      >
        Xem So Sánh ({selectedItems.length}) Cá Koi
      </Button>
    </div >
  );
};

export default Knowledge;