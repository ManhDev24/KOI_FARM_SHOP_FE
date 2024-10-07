import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FishApi from '../../apis/Fish.api';
import { Button } from 'antd';
import { addToCart } from '../../Redux/Slices/Cart_Slice';
import { useDispatch } from 'react-redux';
import fish from '/img/SOWA.webp';

const BatchFishDetail = () => {
  const { id } = useParams();  // Get the fish ID from the URL
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch fish details using the useQuery hook
  const { data, error, isLoading } = useQuery({
    queryKey: ['fishDetail', id],
    queryFn: () => FishApi.getBatchFishDetail(id),  // API call to fetch fish details
  });

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const fishDetails = data || {};  // Access the fish data from the API response

  // If koiImage is a string, wrap it in an array for the carousel
  const images = Array.isArray(fishDetails.koiImage) ? fishDetails.koiImage : [fishDetails.koiImage || '/default-fish.jpg'];

  // Handle moving to the next image
  const handleNextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);  // Move to the next image
    }
  };

  // Handle moving to the previous image
  const handlePreviousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);  // Move to the previous image
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
      })
    );
  };

  const selectedImage = images[currentIndex];

  const formatPrice = (price) => {
    if (!price) return 'Chưa có giá';  // Handle missing price
    return `${price.toLocaleString('vi-VN')} VND`;  // Format with 'vi-VN' locale
  };

  return (
    <>
      <div className="flex justify-center my-[80px]">
        <div className="flex w-[950px] flex-col">
          {/* Detail section of the selected fish */}
          {fishDetails && (
            <div className="grid grid-cols-4">
              <div className="col-span-2">
                <div className="flex justify-end me-10">
                  <img
                    src={selectedImage}
                    // {selectedImage}  // Use the selected image from the carousel
                    className="w-[250px] h-[350px] rounded-[10px]"
                    alt={fishDetails.category || 'Koi Fish'}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className='w-[300px] h-[350px] rounded-[10px] border-2 border-[#FA4444]'>
                  <div className='text-center my-2 text-[#FA4444] font-bold'>
                    {fishDetails.category} {" "}
                    {fishDetails.gender ? 'Đực' : 'Cái'} {" "}
                    {fishDetails.age} tuổi {" "}  
                    {fishDetails.size} cm
                  </div>
                  <div className='ms-6'>
                    <div className='mb-2 '>Giới tính: {fishDetails.gender ? 'Koi Đực' : 'Koi Cái'}</div>
                    <div className='mb-2'>Giống: {fishDetails.category}</div>
                    <div className='mb-2'>Tuổi: {fishDetails.age}</div>
                    <div className='mb-2'>Kích thước: {fishDetails.size} cm</div>
                    <div className='mb-2'>Tính cách: {fishDetails.personality || 'Không có thông tin'}</div>
                    <div className='mb-2'>Nguồn gốc: {fishDetails.origin}</div>
                    <div className=''>
                      Giá: <div className='text-center font-bold text-[24px] !mb-[5px] text-[#FA4444]'>
                        {fishDetails.price != null && !isNaN(fishDetails.price)
                          ? fishDetails.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                          : 'Chưa có giá'}
                      </div>
                    </div>
                    <div className='flex justify-center me-6'>
                      <Link>
                        <Button
                          onClick={() => handleAddToCart(fishDetails)}
                          className='w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]'
                        >
                          Đặt Mua
                        </Button>
                      </Link>
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
        </div>
      </div>

    </>
  );
};

export default BatchFishDetail;
