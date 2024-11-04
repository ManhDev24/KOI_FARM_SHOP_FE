import { Button } from 'antd';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../Redux/Slices/Cart_Slice';
import { useDispatch } from 'react-redux';

const ComparisonModal = ({ isOpen, onClose, selectedItems, setSelectedItems, removeItem }) => {
  const dispatch = useDispatch();

  // Lấy item từ localStorage khi mở modal
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('comparisonItems')) || [];
    setSelectedItems(savedItems);
  }, [isOpen, setSelectedItems]);

  // Cập nhật localStorage khi selectedItems thay đổi
  useEffect(() => {
    localStorage.setItem('comparisonItems', JSON.stringify(selectedItems));
  }, [selectedItems]);

  if (!isOpen) return null; // Only render modal if it's open

  const handleAddToCart = (fish) => {
    dispatch(
      addToCart({
        ...fish,
        quantity: 1,
        isBatch: false,
      })
    );
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between">
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
          <div className="flex justify-around col-span-2-2 gap-4 mx-auto my-0">
            {/* Render thông tin cá Koi được chọn */}
            {selectedItems.map((item) => (
              <Link to={`/fish-detail/${item.id} `} key={item.id}>
                <div key={item.id} className="">
                  {/* Hiển thị ảnh cá Koi */}
                  <div className="">
                    <img
                      src={item.koiImage}
                      alt={item.category || "Không có tên"}
                      className="w-[265px] h-[400px] object-cover rounded-t-lg"
                    />
                  </div>

                  {/* Thông tin chi tiết cá Koi */}
                  <div className='border-2 border-[#FA4444] border-t-0 rounded-b-lg'>
                    <h3 className="text-xl text-center font-semibold ms-3 mb-2 text-[#FA4444]">
                      {item.category || "Không có tên"}
                    </h3>
                    <p className="mb-2 ms-3">Giới tính: {(item.gender) ? 'Koi Cái' : 'Koi Đực' || "Không có thông tin"}</p>
                    <p className="mb-2 ms-3">Tuổi: {item.age || "Không có thông tin"}</p>
                    <p className="mb-2 ms-3">Kích thước: {item.size || "Không có thông tin"} cm</p>
                    <p className="mb-2 ms-3">Nguồn gốc: {item.origin || "Không có thông tin"}</p>
                    <p className="mb-2 ms-3">Giống: {item.category || "Không có thông tin"}</p>
                    <p className="font-bold text-lg text-center">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                    </p>

                    {/* Nút xóa item khỏi so sánh */}
                    <Link>
                      <button
                        className="bg-red-500 relative  bottom-[652px] left-[198px] text-white font-bold py-1 px-4 rounded mt-[32px]"
                        onClick={() => {
                          removeItem(item);
                          // Cập nhật localStorage sau khi xóa item
                          setSelectedItems(prevItems => prevItems.filter(i => i.id !== item.id));
                        }}
                      >
                        Xóa
                      </button>
                    </Link>
                    <Link>
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]"
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

export default ComparisonModal;