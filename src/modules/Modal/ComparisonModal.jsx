// src/components/ComparisonModal.js
import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const ComparisonModal = ({ isOpen, onClose, selectedItems, removeItem }) => {
  if (!isOpen) return null; // Only render modal if it's open

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">

        <div className="flex justify-between ">
          <h2 className="text-2xl font-bold mb-4">So Sánh Cá Koi</h2>
          <button
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
        {/* Kiểm tra nếu không có item nào được chọn */}
        {selectedItems.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-20">
            Không có cá nào để so sánh
          </div>
        ) : (
          <div className="flex justify-around col-span-2-2 gap-4 mx-auto my-0 ">
            {/* Render thông tin cá Koi được chọn */}
            {selectedItems.map((item) => (
              <div key={item.id} className="">
                {/* Hiển thị ảnh cá Koi */}
                <div className="mb-4">
                  <img
                    src={item.koiImage}
                    alt={item.category || "Không có tên"}
                    className="w-[265px] h-[400px] object-cover rounded-lg"
                  />
                </div>

                {/* Thông tin chi tiết cá Koi */}
                <h3 className="text-xl font-semibold ms-3 mb-2 text-[#FA4444]">{selectedItems?.category || item.category}</h3>
                <p className="mb-2 ms-3">Giới tính: {item?.gender || "Không có thông tin"}</p>
                <p className="mb-2 ms-3">Tuổi: {item?.age || "Không có thông tin"}</p>
                <p className="mb-2 ms-3">Kích thước: {item?.size || "Không có thông tin"} cm</p>
                <p className="mb-2 ms-3">Nguồn gốc: {item?.origin || "Không có thông tin"}</p>
                <p className="mb-2 ms-3">Giống: {item?.category || "Không có thông tin"}</p>
                <p className="font-bold text-lg text-center">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price)}
                </p>
                <p>
                  {
                    console.log(item)
                  }
                </p>
                {/* Nút xóa item khỏi so sánh */}
                <button
                  className="bg-red-500 text-white font-bold py-1 px-4 rounded mt-4 relative z-50  top-[-670px] left-[200px]  "
                  onClick={() => removeItem(item)}
                >
                  Xóa
                </button>
                <Link to={`/product/${item.id}`}>
                  <Button className='w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]'>
                    Đặt Mua
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Hành động đóng modal */}

      </div>
    </div>
  );
};

export default ComparisonModal;
