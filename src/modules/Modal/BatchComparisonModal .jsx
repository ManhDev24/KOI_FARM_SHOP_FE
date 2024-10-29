// BatchComparisonModal.jsx

import { Button } from 'antd';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToCart, addToCartBatch } from '../../Redux/Slices/Cart_Slice';
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


  const handleAddToCart = (fish) => {
    console.log("fish: ", fish);
    dispatch(addToCartBatch([{ ...fish, quantity: 1, isBatch: true }]));
  };
  return (
    <div className={`${isOpen ? 'fixed' : 'hidden'} z-40 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75`}>
      <div className="bg-white rounded-lg shadow-lg max-h-[80vh] p-6 w-full max-w-4xl overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">So Sánh Lô Cá Koi</h2>
          <button
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>

        {/* If no batches are selected */}
        {selectedBatches.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-20">
            Không có lô cá nào để so sánh
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2  gap-4">
            {selectedBatches.map((batch) => (
              <Link to={`/batch-detail/${batch.batchID}`} key={batch.batchID} className=" ">
                <div className="flex justify-center ">
                  <img
                    src={batch.batchImg}
                    alt={batch.categoryName || "Không có tên"}
                    className="w-full h-[300px] lg:w-[270px] rounded-t-lg  object-cover"
                  />
                </div>

                <div className="border-b-2 border-x-2 w-full lg:w-[272px]  flex-col  rounded-b-lg justify-center relative left-[72px] border-red-500 p-4">
                  <h3 className="text-lg font-semibold text-center text-red-500">
                    {batch.categoryName || "Không có tên"} - Số lượng: {batch.quantity}
                  </h3>
                  <p className="mt-2 text-gray-600">Độ tuổi: {batch.age || "Không có thông tin"}</p>
                  <p className="mt-1 text-gray-600">Kích thước trung bình: {batch.avgSize || "Không có thông tin"} cm</p>
                  <p className="mt-1 text-gray-600">Nguồn gốc: {batch.origin || "Không có thông tin"}</p>
                  <p className="mt-1 text-gray-600">Giống: {batch.categoryName || "Không có thông tin"}</p>
                  <p className="mt-2 font-bold text-lg text-center text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(batch.price)}
                  </p>
                  <Link>
                    <button
                      onClick={() => {
                        removeBatch(batch);
                        setSelectedBatches(prevBatches => prevBatches.filter(b => b.batchID !== batch.batchID));
                      }}
                      className="bg-red-500 absolute bottom-[508px] left-[202px] z-50  text-white font-bold py-1 px-4 rounded"
                    >
                      Xóa
                    </button>
                  </Link>
                  <div className="flex justify-center mt-4">
                    <Link>

                      <Button
                        onClick={() => handleAddToCart(batch)}
                        className="text-white bg-red-500 rounded px-4 py-1"
                      >
                        Đặt Mua
                      </Button>
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default BatchComparisonModal;
