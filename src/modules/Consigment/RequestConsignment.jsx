import { Breadcrumb } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const RequestConsignment = () => {
    return (
        <>
            <div className="filter flex justify-center items-center  mb-5">
                <div
                    style={{ backgroundColor: "#FFF8F8" }}
                    className="w-[950px] h-[30px] flex items-center ps-3 "
                >
                    <Breadcrumb
                        separator=">"
                        className="flex justify-center items-center font-bold text-lg m-3"
                    >
                        <Breadcrumb.Item>
                            <Link to="/" style={{ color: "#EA4444" }} className="">
                                Home
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link style={{ color: "#EA4444" }} className="">
                                KoiList
                            </Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <div className='flex flex-col items-center'>
                <div className="w-[950px] h-[89px] relative ">
                    <div className="w-[199px] h-[13px] left-0 top-[18px] absolute bg-[#d9d9d9]" />
                    <div className="w-[198px] h-[13px] left-[251px] top-[18px] absolute bg-[#d9d9d9]" />
                    <div className="w-[198px] h-[13px] left-[501px] top-[18px] absolute bg-[#d9d9d9]" />
                    <div className="w-[199px] h-[13px] left-[751px] top-[18px] absolute bg-[#d9d9d9]" />
                    <div className="w-[50px] h-[50px] left-[200px] top-0 absolute">
                        <div className="w-[50px] h-[50px] left-0 top-0 absolute bg-[#d9d9d9] rounded-full" />
                        <div className="w-5 h-5 left-[15px] top-[15px] absolute bg-white rounded-full" />
                        <div className="left-[19px] top-[14px] absolute text-black text-xl font-bold font-['Arial']">1</div>
                    </div>
                    <div className="w-[50px] h-[50px] left-[450px] top-0 absolute">
                        <div className="w-[50px] h-[50px] left-0 top-0 absolute bg-[#d9d9d9] rounded-full" />
                        <div className="w-5 h-5 left-[15px] top-[15px] absolute bg-white rounded-full" />
                        <div className="left-[19px] top-[14px] absolute text-black text-xl font-bold font-['Arial']">2</div>
                    </div>
                    <div className="w-[626px] h-[89px] left-[124px] top-0 absolute">
                        <div className="w-[50px] h-[50px] left-[576px] top-0 absolute bg-[#d9d9d9] rounded-full" />
                        <div className="w-5 h-5 left-[591px] top-[15px] absolute bg-white rounded-full" />
                        <div className="left-[595px] top-[14px] absolute text-black text-xl font-bold font-['Arial']">3</div>
                        <div className="left-0 top-[66px] absolute text-black text-xl font-bold font-['Arial']">Điền thông tin ký gửi</div>
                    </div>
                    <div className="left-[394px] top-[66px] absolute text-black text-xl font-bold font-['Arial']">Chờ duyệt ký gửi</div>
                    <div className="left-[642px] top-[66px] absolute text-black text-xl font-bold font-['Arial']">Trạng thái Ký gửi </div>
                </div>
                <div className="w-[950px] h-[1463px] relative mt-10">
                    <div className="w-[950px] h-[1463px] left-0 top-0 absolute bg-[#d9d9d9]" />
                    <div className="w-[780px] h-[1308px] left-[78px] top-[130px] absolute">
                        <div className="w-[217px] h-[221px] left-0 top-0 absolute">
                            <div className="w-[217px] h-[221px] left-0 top-0 absolute bg-[#d9d9d9] rounded-[10px] border-2 border-[#e94444]" />
                        </div>
                        <div className="w-[464px] h-[1308px] left-[316px] top-0 absolute justify-start items-start ">
                            <div className="w-[464px] text-black text-2xl font-bold font-['Arial']">BIỂU MẪU YÊU CẦU KÝ GỬI</div>
                            <div>
                                <div>
                                    <div className="w-[464px] text-black text-2xl font-bold font-['Arial']">Giá bán</div>
                                </div>
                                <div>
                                    <div className="w-[140px] h-7 text-black text-2xl font-bold font-['Arial']">Tuổi</div>
                                </div>
                                <div>
                                    <div className="w-[464px] text-black text-2xl font-bold font-['Arial']">Nguồn gốc</div>
                                </div>
                                <div>
                                    <div className="w-[464px] text-black text-2xl font-bold font-['Arial']">Giới tính</div>
                                </div>
                                <div>
                                    <div className="w-[464px] text-black text-2xl font-bold font-['Arial']">Kích thước</div>
                                </div>
                                <div>
                                    <div className="w-[464px] text-black text-2xl font-bold font-['Arial']">Tính cách</div>
                                </div>
                                <div>
                                    <div className="w-[464px] text-black text-2xl font-bold font-['Arial']">Giống</div>
                                </div>
                                <div>
                                    <div className="w-[464px] text-black text-2xl font-bold font-['Arial']">Chứng chỉ</div>
                                </div>
                                <div>
                                    <div className="w-[464px] text-black text-2xl font-bold font-['Arial']">Loại ký gửi</div>
                                </div>
                                <div>
                                    <div className="w-[464px] text-black text-2xl font-bold font-['Arial']">Số điện thoại:</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RequestConsignment
