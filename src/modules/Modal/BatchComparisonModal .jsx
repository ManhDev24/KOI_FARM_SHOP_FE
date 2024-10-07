// BatchComparisonModal.jsx

import { Button } from 'antd';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../Redux/Slices/Cart_Slice';
import { useDispatch } from 'react-redux';

const BatchComparisonModal = ({ isOpen, onClose, selectedBatches, setSelectedBatches, removeBatch }) => {
  const dispatch = useDispatch();

  // Retrieve items from localStorage when the modal opens
  useEffect(() => {
    const savedBatches = JSON.parse(localStorage.getItem('comparisonBatches')) || [];
    setSelectedBatches(savedBatches);
  }, [isOpen, setSelectedBatches]);


  useEffect(() => {
    localStorage.setItem('comparisonBatches', JSON.stringify(selectedBatches));
  }, [selectedBatches]);

  if (!isOpen) return null; // Only render modal if it's open

  const handleAddToCart = (batch) => {
    dispatch(
      addToCart({
        ...batch,
        quantity: 1,
      })
    );
  };

  return (
    <div className="fixed z-40 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4">So Sánh Lô Cá Koi</h2>
          <button
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
        {/* Check if no items are selected */}
        {selectedBatches.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-20">
            Không có lô cá nào để so sánh
          </div>
        ) : (
          <div className="flex justify-around gap-4 mx-auto my-0">
            {/* Render selected batch fish information */}
            {selectedBatches.map((batch) => (
              <div key={batch.batchID} className="">
                {/* Display batch fish image */}
                <div className="mb-4">
                  <img
                    src={batch.batchImg}
                    alt={batch.categoryName || "Không có tên"}
                    className="w-[265px] h-[400px] object-cover rounded-lg"
                  />
                </div>

                {/* Batch fish details */}
                <h3 className="text-xl font-semibold ms-3 mb-2 text-[#FA4444]">
                  {batch.categoryName || "Không có tên"} - Số lượng: {batch.quantity}
                </h3>
                <p className="mb-2 ms-3">Độ tuổi: {batch.age || "Không có thông tin"}</p>
                <p className="mb-2 ms-3">Kích thước trung bình: {batch.avgSize || "Không có thông tin"} cm</p>
                <p className="mb-2 ms-3">Nguồn gốc: {batch.origin || "Không có thông tin"}</p>
                <p className="mb-2 ms-3">Giống: {batch.categoryName || "Không có thông tin"}</p>
                <p className="font-bold text-lg text-center">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(batch.price)}
                </p>

                {/* Remove item from comparison */}
                <button
                  className="bg-red-500 z-50  relative bottom-[640px] left-[200px]  text-white font-bold py-1 px-4 rounded mt-4"
                  onClick={() => {
                    removeBatch(batch);
                    // Update localStorage after removing item
                    setSelectedBatches(prevBatches => prevBatches.filter(b => b.batchID !== batch.batchID));
                  }}
                >
                  Xóa
                </button>
                <Link >
                  <Button
                    onClick={() => handleAddToCart(batch)}
                    className="w-[138px] h-[40px]  text-[#FFFFFF] bg-[#FA4444] rounded-[10px] mt-2"
                  >
                    Đặt Mua
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchComparisonModal;
