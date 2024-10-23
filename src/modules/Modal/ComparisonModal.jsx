import { Button, Image } from 'antd';
import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/Slices/Cart_Slice';
import { Link } from 'react-router-dom';


const ComparisonModal = ({ isOpen, onClose, selectedItems, setSelectedItems, removeItem }) => {
  const dispatch = useDispatch();

  // Load items from localStorage when modal opens
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('comparisonItems')) || [];
    setSelectedItems(savedItems);
  }, [isOpen, setSelectedItems]);

  // Update localStorage when selectedItems changes
  useEffect(() => {
    localStorage.setItem('comparisonItems', JSON.stringify(selectedItems));
  }, [selectedItems]);

  if (!isOpen) return null; // Only render modal if it's open

  const handleAddToCart = (fish) => {
    dispatch(
      addToCart({
        ...fish,
        quantity: 1,
      })
    );
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl h-auto overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center \">
          <h2 className="text-xl md:text-2xl font-bold">So Sánh Cá Koi</h2>
          <button
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>

        {/* Display message if no items are selected */}
        {selectedItems.length === 0 ? (
          <div className="text-center text-gray-500 text-lg md:text-xl py-20">
            Không có cá nào để so sánh
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {selectedItems.map((item) => (
              <Link to={`/fish-detail/${item.id}`}>
                <div key={item.id} className="relative rounded p-4 flex flex-col">
                  <div className="flex justify-center">
                    <Image
                      src={item.koiImage}
                      Full width of container
                      
                      alt={item.category || "Không có tên"}
                      className="object-cover rounded-t-[10px] h-[80vh] "
                    />
                  </div>
                  <div className='border-2 md:w-[100%] xl:w-[100%] lg:w-[100%] h-full border-[#FA4444] border-t-0 mx-auto my-0'>
                    <h3 className="text-lg md:text-xl text-center font-semibold text-[#FA4444] mb-2 mt-2">
                      {item.category || "Không có tên"} - {item.size} cm - {item.age} tuổi
                    </h3>
                    <p className="mb-2 ms-2">Giới tính: {item.gender ? 'Koi Cái' : 'Koi Đực'}</p>
                    <p className="mb-2  ms-2">Tuổi: {item.age || "Không có thông tin"}</p>
                    <p className="mb-2  ms-2">Kích thước: {item.size || "Không có thông tin"} cm</p>
                    <p className="mb-2  ms-2">Nguồn gốc: {item.origin || "Không có thông tin"}</p>
                    <p className="mb-2  ms-2">Giống: {item.category || "Không có thông tin"}</p>
                    <p className="font-bold text-lg md:text-xl text-center">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                    </p>
                    {/* Buttons for Remove and Add to Cart */}
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="text-white bg-[#FA4444] hover:bg-red-600 rounded-[10px] "
                      >
                        Đặt Mua
                      </Button>
                    </div>
                  </div>

                  <button
                    className="bg-red-500 w-[40%] md:w-[30%] lg:w-[25%] xl:w-[20%] relative bottom-[1030px] z-50 left-[330px] text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition"
                    onClick={() => {
                      removeItem(item);
                      setSelectedItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonModal;
