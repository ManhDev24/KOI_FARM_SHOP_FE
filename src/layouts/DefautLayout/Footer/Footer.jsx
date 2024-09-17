import React from 'react';
import './Footer.css';
const Footer = () => {
  return (
    <div className='w-full h-[494px] grid grid-cols-3  box-border border-t-2 border-t-red-500 pt-[90px]' style={{ fontFamily: 'Arial' }}>
      <div className='containers'>
        <div className='font-bold'>
          CÔNG TY TNHH TMDV FARM KOI
        </div>
        <div className='text-left'>
          <div>Hotline: 9999999999</div>
          <div>Email: admin@farmkoi.com</div>
          <div>Địa chỉ: 299 Tên Lửa, Bình Trị Đông B, Bình Tân, Hồ Chí Minh</div>
        </div>
      </div>
      <div >
        <div className='font-bold'> CHÍNH SÁCH</div>
        <div className='flex flex-col items-center text-left'>
          <div>Chính sách bảo mật thông tin</div>
          <div>Chính sách thanh toán</div>
          <div>Chính sách giao hàng</div>
          <div>Chính sách đổi trả</div></div>
      </div>
      <div >
        <div className='font-bold'>CHỨNG NHẬN LIÊN KẾT</div>
      </div>
    </div>
  );
};

export default Footer;
