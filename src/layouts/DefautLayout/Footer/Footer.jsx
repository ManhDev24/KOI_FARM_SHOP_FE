import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#12324b] text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">

        {/* Company Logo and Name */}
        <div className="flex flex-col items-start md:items-start">
          <img src="/img/logo.png" alt="Koi Farm Shop Logo" className="w-20 mb-2" />
          <h2 className="text-lg font-bold">Cửa hàng cá koi <br />Koi Farm Shop</h2>
        </div>

        {/* About the Shop */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Về cửa hàng</h3>
          <ul className="space-y-2">
            <li className="hover:text-gray-300 cursor-pointer">Giới thiệu</li>
            <li className="hover:text-gray-300 cursor-pointer">Chọn Koi Farm Shop</li>
            <li className="hover:text-gray-300 cursor-pointer">Hình ảnh hoạt động</li>
            <li className="hover:text-gray-300 cursor-pointer">Chính sách</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Dịch Vụ</h3>
          <ul className="space-y-2">
            <li className="hover:text-gray-300 cursor-pointer">Tư vấn cá Koi</li>
            <li className="hover:text-gray-300 cursor-pointer">Kiểm tra  cá Koi</li>
            <li className="hover:text-gray-300 cursor-pointer">ký gửi</li>
            <li className="hover:text-gray-300 cursor-pointer">mua bán</li>
          </ul>
        </div>

        {/* Google Maps Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Google Maps</h3>
          <div className="rounded-lg overflow-hidden mb-3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6099415305157!2d106.80730807573657!3d10.841132857995461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1730434786119!5m2!1svi!2s"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        
        </div>
      </div>

      {/* Footer Bottom Text */}
      <div className="text-center mt-8 border-t border-gray-600 pt-4 text-sm text-gray-300">
        © 2024 Cửa hàng cá koi Koi Farm Shop. Tất cả các quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;
