import React from 'react';
import { Link } from 'react-router-dom';



const Error = () => {
    const errorType = {
        status: "404",
        typeOfStatus: "Không tìm thấy Trang",
        content: `Xin lỗi dường như bạn đang tìm kiếm trang không tồn tại, 
        có thể đã bị xóa, đã bị đổi tên hoặc tạm thời không khả dụng`,
    };
    return (
        <div className="w-full h-[500px] bg-white justify-center items-center inline-flex">
            <div className="w-[764px] self-stretch pb-[18px] justify-center items-center gap-5 inline-flex">
                <div className="w-[200px] h-[200px] relative flex-col justify-start items-start flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M168.75 100C168.75 118.234 161.507 135.72 148.614 148.614C135.72 161.507 118.234 168.75 100 168.75C81.7664 168.75 64.2795 161.507 51.3864 148.614C38.4933 135.72 31.25 118.234 31.25 100C31.25 81.7664 38.4933 64.2795 51.3864 51.3864C64.2795 38.4933 81.7664 31.25 100 31.25C118.234 31.25 135.72 38.4933 148.614 51.3864C161.507 64.2795 168.75 81.7664 168.75 100ZM187.5 100C187.5 123.206 178.281 145.462 161.872 161.872C145.462 178.281 123.206 187.5 100 187.5C76.7936 187.5 54.5376 178.281 38.1282 161.872C21.7187 145.462 12.5 123.206 12.5 100C12.5 76.7936 21.7187 54.5376 38.1282 38.1282C54.5376 21.7187 76.7936 12.5 100 12.5C123.206 12.5 145.462 21.7187 161.872 38.1282C178.281 54.5376 187.5 76.7936 187.5 100ZM116.625 135.438C117.136 136.6 117.878 137.647 118.806 138.514C119.734 139.382 120.829 140.051 122.024 140.482C123.218 140.914 124.488 141.098 125.756 141.023C127.024 140.949 128.264 140.618 129.4 140.05C130.536 139.482 131.545 138.689 132.365 137.719C133.185 136.749 133.8 135.623 134.172 134.408C134.544 133.194 134.665 131.916 134.528 130.654C134.391 129.391 133.999 128.169 133.375 127.062C128.35 116.95 115.237 109.375 100 109.375C84.7625 109.375 71.6625 116.95 66.625 127.062C66.0015 128.169 65.6093 129.391 65.4724 130.654C65.3354 131.916 65.4565 133.194 65.8282 134.408C66.2 135.623 66.8146 136.749 67.6349 137.719C68.4552 138.689 69.464 139.482 70.6001 140.05C71.7362 140.618 72.9758 140.949 74.2438 141.023C75.5118 141.098 76.7817 140.914 77.9764 140.482C79.1711 140.051 80.2656 139.382 81.1937 138.514C82.1217 137.647 82.8638 136.6 83.375 135.438C84.5875 133.05 90.225 128.125 100 128.125C109.775 128.125 115.412 133.05 116.625 135.438ZM125 100C122.514 100 120.129 99.0123 118.371 97.2541C116.613 95.496 115.625 93.1114 115.625 90.625V78.125C115.625 75.6386 116.613 73.254 118.371 71.4959C120.129 69.7377 122.514 68.75 125 68.75C127.486 68.75 129.871 69.7377 131.629 71.4959C133.387 73.254 134.375 75.6386 134.375 78.125V90.625C134.375 93.1114 133.387 95.496 131.629 97.2541C129.871 99.0123 127.486 100 125 100ZM65.625 90.625C65.625 93.1114 66.6127 95.496 68.3709 97.2541C70.129 99.0123 72.5136 100 75 100C77.4864 100 79.871 99.0123 81.6291 97.2541C83.3873 95.496 84.375 93.1114 84.375 90.625V78.125C84.375 75.6386 83.3873 73.254 81.6291 71.4959C79.871 69.7377 77.4864 68.75 75 68.75C72.5136 68.75 70.129 69.7377 68.3709 71.4959C66.6127 73.254 65.625 75.6386 65.625 78.125V90.625Z" fill="#EA4444" />
                    </svg>
                </div>
                <div className="w-[544px] h-[244px] relative">
                    <div className="left-0 top-0 absolute text-black text-[64px] font-normal font-['Concert One']">
                        {errorType.status}
                    </div>
                    <div className="left-0 top-[74px] absolute text-black text-4xl font-normal font-['Arial']">
                        {errorType.typeOfStatus}
                    </div>
                    <div className="w-[544px] left-0 top-[129px] absolute text-black text-xl font-normal font-['Arial']">
                        {errorType.content.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                    <div className="h-[244px] left-0 top-[221px]  flex justify-s items-end flex-r gap-[5px] ">
                        <Link to="/" className='flex '>
                            <div className="text-black text-xl font-bold font-['Arial'] ">
                                Quay lại trang chủ
                            </div>
                            <div className="w-5 h-[23px] ms-2 ">
                                <div className="w-[13.75px] h-[15.33px] left-[2.92px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="23" viewBox="0 0 20 23" fill="none">
                                        <path d="M3.54134 13.4163C4.28301 16.7226 6.89134 19.1663 9.99967 19.1663C13.683 19.1663 16.6663 15.7355 16.6663 11.4997C16.6663 7.26384 13.683 3.83301 9.99967 3.83301C8.00801 3.83301 6.22467 4.83926 4.99967 6.43009L3.33301 8.62467" stroke="#EA4444" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4.6915 7.0725L2.9165 5.03125V9.10417H6.45817L4.6915 7.0725Z" fill="#EA4444" stroke="#EA4444" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error;
