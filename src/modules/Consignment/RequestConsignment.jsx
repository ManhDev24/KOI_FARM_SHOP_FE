import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Form } from 'antd'
import React from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
const validationSchema = Yup.object().shape({
    origin: Yup.string()
        .required('Nguồn gốc là bắt buộc'),
    gender: Yup.boolean()
        .required('Giới tính là bắt buộc'),
    age: Yup.number()
        .integer('Tuổi phải là số nguyên và lớn hơn 0')
        .required('Tuổi là bắt buộc'),
    size: Yup.number()
        .required('Kích thước là bắt buộc'),
    personality: Yup.string()
        .required('Tính cách là bắt buộc'),
    price: Yup.number()
        .required('Giá là bắt buộc'),
    food: Yup.string()
        .required('Thức ăn là bắt buộc'),
    health: Yup.string()
        .required('Tình trạng sức khỏe là bắt buộc'),
    ph: Yup.string()
        .required('pH là bắt buộc'),
    temperature: Yup.string()
        .required('Nhiệt độ sống là bắt buộc ví dụ: 25 - 27')
        .matches(/^\d{1,3}\s*-\s*\d{1,3}$/, 'Nhiệt độ phải theo định dạng: ví dụ "25 - 27"'),
    water: Yup.string()
        .required('Loại nước là bắt buộc'),
    pureBred: Yup.number()
        .required('Chỉ số thuần chủng là bắt buộc'),
    categoryId: Yup.string()
        .required('Lựa chọn danh mục là bắt buộc'),
    name: Yup.string()
        .required('Tên chứng chỉ là bắt buộc'),
    notes: Yup.string()
        .required('Ghi chú là bắt buộc'),
    phoneNumber: Yup.string()
        .required('Số điện thoại là bắt buộc')
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải bao gồm 10 hoặc 11 chữ số'),
    consignmentType: Yup.boolean()
        .required('Loại ký gửi là bắt buộc'),
    duration: Yup.number()
        .integer('Thời gian ký gửi phải là số nguyên')
        .required('Thời gian ký gửi là bắt buộc'),
    online: Yup.boolean()
        .required('Trạng thái trực tuyến là bắt buộc')
});


const RequestConsignment = () => {
    const CategoryItem = [
        {
            key: "Giống",
            label: "Giống",
            value: "",
        },
        {
            key: "Koi showa",
            label: "Koi showa",
            value: "1",
        },
        {
            key: "Koi asagi",
            label: "Koi asagi",
            value: "2",
        },
        {
            key: "Koi karashi",
            label: "Koi karashi",
            value: "3",
        },
        {
            key: "Koi Benikoi",
            label: "Koi Benikoi",
            value: "4",
        },
    ];


    const gender = [
        {
            key: "5",
            label: "Giới tính",
            value: "",
        },
        {
            key: "6",
            label: "Koi Đực",
            value: "1",
        },
        {
            key: "7",
            label: "Koi Cái",
            value: "0",
        },

    ];
    const pureBred = [
        {
            key: "8",
            label: "Đời",
            value: "",
        },
        {
            key: "9",
            label: "Thuần chủng",
            value: "1",
        },
        {
            key: "10",
            label: "F1",
            value: "2",
        },

    ];
    const consignmentForm = [
        {
            key: "11",
            label: "Hình thức ký gửi",
            value: "",
        },
        {
            key: "12",
            label: "Ký gửi Online",
            value: "1",
        },
        {
            key: "13",
            label: "Ký gửi Offline",
            value: "2",
        },

    ];


    const consignmentType = [
        {
            key: "14",
            label: "Loại ký gửi",
            value: "",
        },
        {
            key: "15",
            label: "Ký gửi để bán",
            value: "1",
        },
        {
            key: "16",
            label: "Ký gửi chăm sóc",
            value: "2",
        },

    ];

    const consignmentPack = [
        {
            key: "17",
            label: "Gói ký gửi",
            value: "",
        },
        {
            key: "18",
            label: "1 Tháng",
            value: "1",
        },
        {
            key: "19",
            label: "3 Tháng",
            value: "2",
        },
        {
            key: "19",
            label: "6 Tháng",
            value: "3",
        },

    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });
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
                                Trang chủ
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link style={{ color: "#EA4444" }} className="">
                                Ký gửi
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
                <div className="w-[950px]  mt-10">
                    <Form  >
                        <div className="w-[950px] h-[2530px] px-20 py-[50px]  bg-white border border-[#FA4444] justify-between items-start  grid grid-cols-2">
                            <div className='col-span-3 flex justify-center'>
                                <h1 className='text-[28px] font-bold'>BIỂU MẪU KÝ GỬI CÁ KOI</h1>
                            </div>
                            <div className=" col-span-1 left w-[311px] h-[1387px] flex-col justify-start items-start gap-[250px] inline-flex">
                                <div className="self-stretch h-[300px] flex-col justify-center items-center gap-2.5 flex">
                                    <div className="flex-col justify-center items-center gap-2.5 flex">
                                        <div className="text-black text-2xl font-bold font-['Arial']">Ảnh Koi</div>
                                        <div className="w-[221px] h-[221px] bg-white rounded-[10px] border-2 border-[#e94444]" />

                                        <label className="w-[130px] h-[34px] px-1.5 py-[11px] bg-white rounded-[10px] border border-[#e94444] flex items-center gap-1.5 cursor-pointer">
                                            <div className="w-5 h-5 relative">
                                                <div className="w-5 h-5  flex">

                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                                                        <path d="M12.5 6.66667H12.5083M10.4167 17.5H5C4.33696 17.5 3.70107 17.2366 3.23223 16.7678C2.76339 16.2989 2.5 15.663 2.5 15V5C2.5 4.33696 2.76339 3.70107 3.23223 3.23223C3.70107 2.76339 4.33696 2.5 5 2.5H15C15.663 2.5 16.2989 2.76339 16.7678 3.23223C17.2366 3.70107 17.5 4.33696 17.5 5V10.4167" stroke="#EA4444" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M2.5 13.3334L6.66667 9.16677C7.44 8.4226 8.39333 8.4226 9.16667 9.16677L12.5 12.5001" stroke="#EA4444" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M11.667 11.6666L12.5003 10.8333C13.0587 10.2966 13.7087 10.1466 14.3187 10.3833M13.3337 15.8333H18.3337M15.8337 13.3333V18.3333" stroke="#EA4444" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />

                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-black font-bold text-center w-full   my-0 font-['Arial'] ">Tải ảnh lên</span>
                                            
                                        </label>

                                    </div>
                                </div>
                                <div className="w-[300px] h-[725px] flex-col justify-start items-center gap-5 flex">
                                    <div className="flex-col justify-center items-center gap-2.5 flex">
                                        <div className="w-[130px] text-black text-2xl font-bold font-['Arial']">Chứng chỉ</div>
                                        <div className="w-[220px] h-[220px] bg-white rounded-[10px] border-2 border-[#e94444]" />
                                        <label className="w-[130px] h-[34px] px-1.5 py-[11px] bg-white rounded-[10px] border border-[#e94444] flex items-center gap-1.5 cursor-pointer">
                                            <div className="w-5 h-5 relative">
                                                <div className="w-5 h-5  flex">

                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                                                        <path d="M12.5 6.66667H12.5083M10.4167 17.5H5C4.33696 17.5 3.70107 17.2366 3.23223 16.7678C2.76339 16.2989 2.5 15.663 2.5 15V5C2.5 4.33696 2.76339 3.70107 3.23223 3.23223C3.70107 2.76339 4.33696 2.5 5 2.5H15C15.663 2.5 16.2989 2.76339 16.7678 3.23223C17.2366 3.70107 17.5 4.33696 17.5 5V10.4167" stroke="#EA4444" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M2.5 13.3334L6.66667 9.16677C7.44 8.4226 8.39333 8.4226 9.16667 9.16677L12.5 12.5001" stroke="#EA4444" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M11.667 11.6666L12.5003 10.8333C13.0587 10.2966 13.7087 10.1466 14.3187 10.3833M13.3337 15.8333H18.3337M15.8337 13.3333V18.3333" stroke="#EA4444" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />

                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-black font-bold text-center w-full   my-0 font-['Arial'] ">Tải ảnh lên</span>
                                            
                                        </label>
                                    </div>
                                    <div className="flex-col justify-start items-start gap-[22px] flex">
                                        <div className="flex-col justify-center items-center gap-[22.25px] flex">
                                            <div className="self-stretch h-7 text-black text-2xl font-bold font-['Arial']">*Tên chứng chỉ:</div>
                                            <div className="self-stretch px-2.5 flex-col justify-start items-start gap-2.5 inline-flex" />
                                        </div>
                                        <div className="pb-[0.75px] flex-col justify-center items-center gap-[22.25px] flex">
                                            <div className="self-stretch text-black text-2xl font-bold font-['Arial']">Nội dung:</div>
                                            <div className="self-stretch px-2.5 flex-col justify-start items-start gap-2.5 inline-flex" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" col-span-1 right flex-col justify-start items-start gap-10 inline-flex">
                                <div className="self-stretch h-[2215.65px] flex-col justify-start items-start gap-[25px] flex">
                                    <div className="self-stretch h-[1269.65px] px-2.5 py-5 rounded-[10px] border border-black flex-col justify-start items-start gap-[25px] flex">
                                        <div className="w-[436px] text-black text-2xl font-bold font-['Arial']">Thông tin cá Koi</div>
                                        <div className="self-stretch h-[55.65px] justify-start items-start gap-2.5 inline-flex">
                                            <div className="h-[50px] justify-start items-start gap-2.5 flex">
                                                <div className="w-36 h-[50px] p-2.5 bg-white rounded-[10px] border border-black justify-center items-center gap-2.5 flex">
                                                    <div className="text-black text-2xl font-bold my-0 font-['Arial']">Giống</div>
                                                    <div className="w-5 h-5 relative" />
                                                </div>
                                            </div>
                                            <div className="w-[158px] h-[50px] p-2.5 bg-white rounded-[10px] border border-black justify-center items-center gap-2.5 flex">
                                                <div className="text-black text-2xl font-bold my-0 font-['Arial']">Giới tính</div>
                                                <div className="w-5 h-5 relative" />
                                            </div>
                                        </div>
                                        <div className="justify-start items-start inline-flex">
                                            <div className="w-20 text-black text-2xl font-bold font-['Arial']">*Tuổi: <input className='border-2 rounded-md w-40' type="text" /></div>
                                        </div>
                                        <div className="justify-start items-start inline-flex">
                                            <div className="w-52 text-black text-2xl font-bold font-['Arial']">*Thuần chủng:</div>
                                        </div>
                                        <div className="w-[464px] justify-start items-start gap-2.5 inline-flex">
                                            <div className="text-black text-2xl font-bold font-['Arial']">*Kích thước (cm) <input className='border-2 rounded-md w-40' type="text" /></div>
                                        </div>
                                        <div className="self-stretch h-[103px] flex-col justify-center items-center gap-[25px] flex">
                                            <div className="self-stretch text-black text-2xl font-bold font-['Arial']">Tính cách: <input className='border-2 ' type="text" /></div>
                                           
                                        </div>
                                        <div className="self-stretch h-[103px] flex-col justify-center items-center gap-[25px] flex">
                                            <div className="self-stretch text-black text-2xl font-bold font-['Arial']">*Thức ăn chính:</div>
                                        </div>
                                        <div className="self-stretch h-[103px] flex-col justify-center items-center gap-[25px] flex">
                                            <div className="self-stretch text-black text-2xl font-bold font-['Arial']">*Sức khỏe:</div>
                                        </div>
                                        <div className="flex-col justify-start items-start gap-[25px] flex">
                                            <div className="w-[444px] text-black text-2xl font-bold font-['Arial']">*Độ pH:</div>
                                            <div className="px-2.5 flex-col justify-start items-start gap-2.5 flex" />
                                        </div>
                                        <div className="self-stretch h-[103px] flex-col justify-start items-start gap-[25px] flex">
                                            <div className="self-stretch text-black text-2xl font-bold font-['Arial']">*Nhiệt độ môi trường sống:</div>
                                            <div className="px-2.5 flex-col justify-start items-start gap-2.5 flex" />
                                        </div>
                                        <div className="h-[103px] flex-col justify-start items-start gap-[25px] flex">
                                            <div className="self-stretch text-black text-2xl font-bold font-['Arial']">*Nhiệt độ môi trường sống:</div>
                                            <div className="px-2.5 flex-col justify-start items-start gap-2.5 flex" />
                                        </div>
                                        <div className="h-[103px] relative bg-white">
                                            <div className="w-full text-black text-2xl font-bold font-['Arial']">*Nguồn gốc:</div>
                                        </div>
                                    </div>
                                    <div className="self-stretch h-[921px] px-2.5 py-5 rounded-[10px] border border-black flex-col justify-start items-start gap-[25px] flex">
                                        <div className="text-black text-2xl font-bold font-['Arial']">Thông tin ký gửi & liên hệ</div>
                                        <div className="h-[50px] pr-[243px] justify-start items-center inline-flex">
                                            <div className="w-[260px] self-stretch p-2.5 bg-white rounded-[10px] border border-black justify-center items-center gap-2.5 inline-flex">
                                                <div className="text-black text-2xl font-bold w-f my-0 font-['Arial']">Hình thức ký gửi</div>
                                                <div className="w-5 h-5 relative" />
                                            </div>
                                        </div>
                                        <div className="h-[50px] pr-[304px] justify-start items-center inline-flex">
                                            <div className="w-[180px] self-stretch p-0 bg-white rounded-[10px] border border-black justify-center items-center gap-2.5 inline-flex">
                                                <div className="text-black text-2xl font-bold my-0 font-['Arial']">Loại ký gửi</div>
                                                <div className="w-5 h-5 relative" />
                                            </div>
                                        </div>
                                        <div className="h-[50px] pr-[304px] justify-start items-center inline-flex">
                                            <div className="w-[180px] self-stretch p-0 bg-white rounded-[10px] border border-black justify-center items-center gap-2.5 inline-flex">
                                                <div className="text-black text-2xl my-0 font-bold font-['Arial']">Gói ký gửi</div>
                                                <div className="w-5 h-5 relative" />
                                            </div>
                                        </div>
                                        <div className="self-stretch h-[259px] flex-col justify-start items-start gap-[25px] flex">
                                            <div className="self-stretch text-black text-2xl font-bold font-['Arial']">*Giá  bán(VND)  nếu người dùng chọn ký gửi để bán</div>
                                            <div className="self-stretch"><span className="text-black text-2xl font-bold font-['Arial']">Chi phí(</span><span className="text-[#e94444] text-2xl font-bold font-['Arial']">xem chi tiết</span><span className="text-black text-2xl font-bold font-['Arial']">): </span></div>
                                            <div className="w-[380px] h-[50px] ">
                                                <div className=" grid grid-flow-col grid-cols-5 text-black text-2xl font-bold font-['Arial']"><div className='text-center col-span-4'>10000000000 </div> <div className='text-center'>VND</div></div>

                                            </div>
                                        </div>
                                        <div className="pr-5 flex-col justify-center items-start gap-[25px] flex">
                                            <div className="text-black text-2xl font-bold font-['Arial']">*Số điện thoại:</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>

            </div>
        </>
    )
}

export default RequestConsignment
