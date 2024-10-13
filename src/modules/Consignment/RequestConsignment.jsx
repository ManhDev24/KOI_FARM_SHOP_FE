
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Form, Input, Row, Select, Upload, Image } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import imageSrc from '/img/SOWA.webp'
import './requestConsignment.css'
import { ConsignmentApi } from '../../apis/Consignment.api';
const validationSchema = Yup.object().shape({
    origin: Yup.string()
        .required('Nguồn gốc là bắt buộc'),
    gender: Yup.boolean()
        .required('Giới tính là bắt buộc'),
    age: Yup.number()
        .integer('Tuổi phải là số nguyên và lớn hơn 0')
        .min(0, 'Tuổi không thể nhỏ hơn 0')
        .max(100, 'Tuổi không thể lớn hơn 100')
        .required('Tuổi là bắt buộc'),
    size: Yup.number()
        .min(10, 'Kích thước tối thiểu là 10 cm')
        .max(100, 'Kích thước tối đa là 100 cm')
        .required('Kích thước là bắt buộc'),
    personality: Yup.string()
        .required('Tính cách là bắt buộc'),
    price: Yup.number()
        .min(1000, 'Giá tối thiểu là 1000 VND')
        .max(100000000, 'Giá tối đa là 100 triệu VND')
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
        .min(0, 'Chỉ số thuần chủng tối thiểu là 0')
        .max(1, 'Chỉ số thuần chủng tối đa là 1')
        .required('Chỉ số thuần chủng là bắt buộc'),
    categoryId: Yup.string()
        .required('Lựa chọn danh mục là bắt buộc'),
    name: Yup.string()
        .required('Tên chứng chỉ là bắt buộc'),
    notes: Yup.string()
        .required('Ghi chú là bắt buộc'),
    phoneNumber: Yup.string()
        .required('Số điện thoại là bắt buộc')
        .matches(/^[0-9]{10,15}$/, 'Số điện thoại phải bao gồm 10 hoặc 15 chữ số'),
    consignmentType: Yup.boolean()
        .required('Loại ký gửi là bắt buộc'),
    duration: Yup.number()
        .integer('Thời gian ký gửi phải là số nguyên')
        .min(1, 'Thời gian ký gửi tối thiểu là 1 ngày')
        .max(365, 'Thời gian ký gửi tối đa là 365 ngày')
        .required('Thời gian ký gửi là bắt buộc'),
    online: Yup.boolean()
        .required('Trạng thái trực tuyến là bắt buộc')
});
const CustomSVGIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 21 21" fill="none">
        <path d="M2.99983 4.81624H17.9998C18.1517 4.81671 18.3006 4.8586 18.4304 4.93739C18.5602 5.01617 18.6661 5.12887 18.7367 5.26336C18.8072 5.39785 18.8397 5.54904 18.8307 5.70064C18.8218 5.85224 18.7716 5.99852 18.6857 6.12374L11.1857 16.9571C10.8748 17.4062 10.1265 17.4062 9.81483 16.9571L2.31483 6.12374C2.22801 5.99879 2.17711 5.85243 2.16763 5.70057C2.15816 5.54872 2.19048 5.39717 2.26109 5.2624C2.3317 5.12762 2.43789 5.01478 2.56813 4.93612C2.69837 4.85746 2.84768 4.816 2.99983 4.81624Z" fill="#EA4444" />
    </svg>
);


console.log(validationSchema);
const RequestConsignment = () => {
    const [form] = Form.useForm();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedPureBred, setSelectedPureBred] = useState("");
    const [inputPrice, setInputPrice] = useState('');
    const [SelectedConsignmentType, setSelectedConsignmentType] = useState('');
    const [SelectedPackage, setSelectedPackage] = useState('');
    const [imageSrc, setImageSrc] = useState(null);
    const [imageSrcCer, setImageSrcCer] = useState(null);
    const [fee, setFee] = useState('');
    const [serviceFee, setServiceFee] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedKoiImage, setSelectedKoiImage] = useState(null);
    const [selectedKoiCertificate, setSelectedKoiCertificate] = useState(null);

    useEffect(() => {
        const fee = handleFee(inputPrice, SelectedPackage);

        setServiceFee(fee);
        form.setFieldsValue({ serviceFee: formatVND(serviceFee) });
    }, [inputPrice, SelectedPackage, SelectedConsignmentType]);

    const CategoryItem = [
        {
            key: "Giống",
            label: "Chọn Giống",
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
            label: "--Lựa chọn--",
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
            label: "--Lựa chọn--",
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
            label: "--Lựa chọn--",
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
            value: "0",
        },

    ];

    const consignmentPackForSell = [
        {
            key: "17",
            label: "--Lựa chọn--",
            value: "",
        },
        {
            key: "18",
            label: "1 Tháng 10% giá trị ",
            value: "1",
        },
        {
            key: "19",
            label: "3 Tháng 15% giá trị",
            value: "2",
        },
        {
            key: "20",
            label: "6 Tháng 20% giá trị",
            value: "3",
        },

    ];
    const consignmentPackForTakeCare = [
        {
            key: "21",
            label: "--Lựa chọn--",
            value: "",
        },
        {
            key: "22",
            label: "1 Tháng 6% giá trị ",
            value: "1",
        },
        {
            key: "23",
            label: "3 Tháng 12% giá trị",
            value: "2",
        },
        {
            key: "24",
            label: "6 Tháng 18% giá trị",
            value: "3",
        },

    ];


    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const onFinish = async (values) => {
        try {
            // Helper function to convert Blob URL to File object
            const blobToFile = async (blobUrl, fileName) => {
                const response = await fetch(blobUrl);
                const blob = await response.blob();
                return new File([blob], fileName, { type: blob.type });
            };

            // Convert the koi and cert images from Blob URLs to actual file objects
            const koiImageFile = await blobToFile(values.koiImg, 'koiImage.jpg');
            const certImageFile = await blobToFile(values.certImg, 'certImage.jpg');

            // Initialize FormData to handle file and text data
            const formData = new FormData();

            // Append the image files to FormData
            formData.append('koiImg', koiImageFile);
            formData.append('certImg', certImageFile);

            // Append other form fields except koiImg, certImg, and accountId
            Object.keys(values).forEach(key => {
                if (key !== 'koiImg' && key !== 'certImg' && key !== 'accountId') {
                    formData.append(key, values[key]);
                }
            });

            // Retrieve the accountId from local storage
            const dataProfile = JSON.parse(localStorage.getItem('user'));
            const accountId = dataProfile && dataProfile.id ? Number(dataProfile.id) : null;
            if (!accountId) {
                throw new Error("Account ID not found in localStorage");
            }
            formData.append('accountId', accountId);
            formData.append('water', 'lanh');
            // Send the form data through the API request
            const response = await ConsignmentApi.requestConsignment(formData); // FormData is passed directly

            console.log('Success:', response);
            return response;
        } catch (error) {
            console.error('Error in form submission:', error);
        }
    };


    const onFinishFailed = (errorInfo) => {
        errorInfo.values.serviceFee = serviceFee;
        errorInfo.values.koiImg = imageSrc; errorInfo.values.certImg = imageSrcCer;
        // Add userID dynamically
        console.log('Failed:', errorInfo);
    };
    const onSubmit = (data) => {
        console.log(data);
    };
    const handleUploadKoiImage = ({ file }) => {
        if (validateFile(file)) {
            setSelectedKoiImage(file); // Save the file for later upload
            const previewUrl = URL.createObjectURL(file); // Create preview URL
            setImageSrc(previewUrl); // Set image source for preview
        }
    };

    const handleUploadKoiCertificate = ({ file }) => {
        if (validateFile(file)) {
            console.log(file)
            setSelectedKoiCertificate(file); // Save the file for later upload
            const previewUrl = URL.createObjectURL(file); // Create preview URL
            setImageSrcCer(previewUrl); // Set image source for preview
        }
    };

    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            message.error('Định dạng file không hợp lệ. Chỉ chấp nhận JPEG hoặc PNG.');
            return false;
        }

        if (file.size > 20000000) {
            message.error('File quá lớn. Kích thước tối đa là 20MB.');
            return false;
        }
        return true;
    };

    const handleUploadBothFiles = async () => {
        if (!selectedKoiImage || !selectedKoiCertificate) {
            message.error('Vui lòng tải lên cả ảnh Koi và chứng nhận.');
            return;
        }

        const formData = new FormData();
        formData.append('koiImg', selectedKoiImage);
        formData.append('koiCertificate', selectedKoiCertificate);

        setLoading(true); // Set loading state

        try {
            const dataProfile = JSON.parse(localStorage.getItem('user'));
            const id = dataProfile?.id;

            if (!id) {
                message.error('Không tìm thấy thông tin người dùng.');
                return;
            }

            const response = await fetch(`http://localhost:8080/koifarm/account/profile/updateAvatar/${id}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Có lỗi xảy ra khi upload ảnh.');
            }

            const data = await response.json();
            message.success('Upload ảnh Koi và chứng nhận thành công!');
            console.log(data);
        } catch (error) {
            message.error(error.message || 'Đã xảy ra lỗi khi upload ảnh, vui lòng thử lại.');
        } finally {
            setLoading(false);
            URL.revokeObjectURL(imageSrc);
            URL.revokeObjectURL(imageSrcCer);
        }
    };



    const handleInputPrice = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setInputPrice(Number(value));
    };
    const handleFee = (price, selectedPackages) => {
        return SelectedConsignmentType === '1' ? price * selectedPackages : 0;
    };


    const formatVNDs = (value) => {
        if (typeof value !== 'number') {
            return '0';
        }
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const formatVND = (value) => {
        if (typeof value !== 'number') {
            return '0';
        }
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const handleSelectCategory = (value) => {
        setSelectedCategory(value);
        console.log("Selected category:", value);
    };
    const handleSelectPackage = (value) => {
        setSelectedPackage(value);
        console.log("Selected category:", value);
    };


    const handleSelectGender = (value) => {
        setSelectedGender(value);
        console.log("Selected gender:", value);
    };
    const handleSelectPureBred = (value) => {
        setSelectedPureBred(value);
        console.log("Độ thuần chủng đã chọn:", value);
    };
    const handleSelectConsigmentType = (value) => {
        setSelectedConsignmentType(value);
        console.log("Loại ký gửi", value);
    };

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
                <div className="w-[950px]  mt-10 form-container">
                    <Form onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        <div className="w-[950px] h-[2530px] px-20 py-[50px]   placeholder: bg-white border border-[#FA4444] justify-between items-start  grid grid-cols-4">
                            <div className='col-span-4 flex justify-center'>
                                <h1 className='text-[28px] font-bold'>BIỂU MẪU KÝ GỬI CÁ KOI</h1>
                            </div>
                            <div className=" col-span-2 left w-[311px] h-[1387px] flex-col justify-start items-start gap-[250px] inline-flex">
                                <div className="self-stretch h-[300px] flex-col justify-center items-center gap-2.5 flex">
                                    <div className="flex-col justify-center items-center gap-2.5 flex">
                                        <Form.Item
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                            label="Ảnh Koi"
                                            name="koiImg"
                                            className="flex mx-10 mt-0 p-0"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <span className='w-[500px] relative bottom-1 left-[10px]'>Ảnh Koi là bắt buộc</span>
                                                }
                                            ]}
                                        >
                                            {imageSrc && (
                                                <div className="relative top-[112px] left-[5px] w-[221px] h-0 bg-white flex items-center justify-center">
                                                    <Image
                                                        width={222}
                                                        height={220}
                                                        src={imageSrc}
                                                    />
                                                </div>

                                            )}

                                            <Upload
                                                name="koiImg"
                                                listType="picture"
                                                className="flex flex-col items-center"
                                                showUploadList={false}
                                                onChange={handleUploadKoiImage}
                                                beforeUpload={() => false}
                                            >
                                                <div className="w-[225px] h-[224px] bg-white border-2 border-[#e94444] flex items-center justify-center">
                                                    <span className="text-gray-400">Kéo và thả ảnh hoặc nhấn để chọn</span>
                                                </div>
                                            </Upload>
                                            {/* */}
                                        </Form.Item>
                                        <Form.Item
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}

                                            name="koiImg"
                                            className="flex mx-10 mt-0 p-0"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <span className='w-[500px] relative bottom-1 left-[10px]'>Ảnh Koi là bắt buộc</span>
                                                }
                                            ]}
                                        >
                                            {imageSrc && (
                                                <div className="relative top-[112px] left-[5px] w-[221px] h-0 bg-white flex items-center justify-center">
                                                    <Image hidden
                                                        width={222}
                                                        height={220}
                                                        src={imageSrc}
                                                    />
                                                </div>

                                            )}

                                            <Upload
                                                name="koiImg"

                                                className="flex flex-col items-center"
                                                showUploadList={false}
                                                onChange={handleUploadKoiImage}
                                                beforeUpload={() => false}
                                            >



                                                <Button className="m-0 flex justify-between items-center">
                                                    <div className="relative flex items-center">
                                                        <svg
                                                            className="absolute w-5 h-5"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M12.5 6.66667H12.5083M10.4167 17.5H5C4.33696 17.5 3.70107 17.2366 3.23223 16.7678C2.76339 16.2989 2.5 15.663 2.5 15V5C2.5 4.33696 2.76339 3.70107 3.23223 3.23223C3.70107 2.76339 4.33696 2.5 5 2.5H15C15.663 2.5 16.2989 2.76339 16.7678 3.23223C17.2366 3.70107 17.5 4.33696 17.5 5V10.4167"
                                                                stroke="#EA4444"
                                                                strokeWidth="1.66667"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M2.5 13.3334L6.66667 9.16677C7.44 8.4226 8.39333 8.4226 9.16667 9.16677L12.5 12.5001"
                                                                stroke="#EA4444"
                                                                strokeWidth="1.66667"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M11.667 11.6666L12.5003 10.8333C13.0587 10.2966 13.7087 10.1466 14.3187 10.3833M13.3337 15.8333H18.3337M15.8337 13.3333V18.3333"
                                                                stroke="#EA4444"
                                                                strokeWidth="1.66667"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <span className="ml-6">Tải ảnh lên</span>
                                                    </div>
                                                </Button>

                                            </Upload>
                                        </Form.Item>
                                    </div>

                                </div>
                                <div className="w-[300px] h-[725px] flex-col justify-start items-center gap-5 flex">
                                    <div className="flex-col justify-center items-center gap-2.5 flex">

                                        <div className="flex-col justify-center items-center gap-2.5 flex">
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                label="Ảnh Koi"
                                                name="certImg"
                                                className="flex mx-10 mt-0 p-0"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: <span className='w-[500px] relative bottom-1 left-[10px]'>Ảnh Koi là bắt buộc</span>
                                                    }
                                                ]}
                                            >
                                                {imageSrcCer && (
                                                    <div className="relative top-[112px] left-[5px] w-[221px] h-0 bg-white flex items-center justify-center">
                                                        <Image
                                                            width={222}
                                                            height={220}
                                                            src={imageSrcCer}
                                                        />
                                                    </div>

                                                )}

                                                <Upload
                                                    name="certImg"
                                                    listType="picture"
                                                    className="flex flex-col items-center"
                                                    showUploadList={false}
                                                    onChange={handleUploadKoiCertificate}
                                                    beforeUpload={() => false}
                                                >
                                                    <div className="w-[225px] h-[224px] bg-white border-2 border-[#e94444] flex items-center justify-center">
                                                        <span className="text-gray-400">Kéo và thả ảnh hoặc nhấn để chọn</span>
                                                    </div>
                                                </Upload>
                                                {/**/}
                                            </Form.Item>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}

                                                name="certImg"
                                                className="flex mx-10 mt-0 p-0"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: <span className='w-[500px] relative bottom-1 left-[10px]'>Ảnh Koi là bắt buộc</span>
                                                    }
                                                ]}
                                            >
                                                {imageSrcCer && (
                                                    <div className="relative top-[112px] left-[5px] w-[221px] h-0 bg-white flex items-center justify-center">
                                                        <Image hidden
                                                            width={222}
                                                            height={220}
                                                            src={imageSrcCer}
                                                        />
                                                    </div>

                                                )}

                                                <Upload
                                                    className="flex flex-col items-center"
                                                    showUploadList={false}
                                                    name="certImg"
                                                    listType="picture"
                                                    onChange={handleUploadKoiCertificate}
                                                    beforeUpload={() => false} >

                                                    <Button className="m-2 flex justify-between items-center">
                                                        <div className="relative flex items-center">
                                                            <svg
                                                                className="absolute w-5 h-5"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="none"
                                                            >
                                                                <path
                                                                    d="M12.5 6.66667H12.5083M10.4167 17.5H5C4.33696 17.5 3.70107 17.2366 3.23223 16.7678C2.76339 16.2989 2.5 15.663 2.5 15V5C2.5 4.33696 2.76339 3.70107 3.23223 3.23223C3.70107 2.76339 4.33696 2.5 5 2.5H15C15.663 2.5 16.2989 2.76339 16.7678 3.23223C17.2366 3.70107 17.5 4.33696 17.5 5V10.4167"
                                                                    stroke="#EA4444"
                                                                    strokeWidth="1.66667"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M2.5 13.3334L6.66667 9.16677C7.44 8.4226 8.39333 8.4226 9.16667 9.16677L12.5 12.5001"
                                                                    stroke="#EA4444"
                                                                    strokeWidth="1.66667"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M11.667 11.6666L12.5003 10.8333C13.0587 10.2966 13.7087 10.1466 14.3187 10.3833M13.3337 15.8333H18.3337M15.8337 13.3333V18.3333"
                                                                    stroke="#EA4444"
                                                                    strokeWidth="1.66667"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                            <span className="ml-6">Tải ảnh lên</span>
                                                        </div>
                                                    </Button>
                                                </Upload>
                                            </Form.Item>

                                        </div>

                                        <div className='mt-20'>
                                            <div >
                                                <Form.Item
                                                    label={<span className="relative top-1">Tên chứng chỉ</span>}

                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 24 }}
                                                    name="name"
                                                    className='p-0 m-0 w-[full] relative bottom-28  left-10  '
                                                    rules={[{
                                                        required: true, message: <span className='w-[500px] relative bottom-1 left-[10px]'>Vui long tên chứng chỉ</span>
                                                    },

                                                    ]}
                                                >
                                                    <div className='flex justify-center '>
                                                        <TextArea className='w-full me-20' showCount maxLength={50} placeholder='Vui lòng điền tên chứng chỉ' cols={12} rows={2}
                                                            autoSize={{ minRows: 2, maxRows: 4 }} />

                                                    </div>

                                                </Form.Item>
                                            </div>
                                            <div>
                                                <Form.Item
                                                    label={<span className="relative top-1">Nội dung</span>}

                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 24 }}
                                                    name="notes"
                                                    className='p-0 m-0 w-[full] relative bottom-28 left-10  '
                                                    rules={[{
                                                        required: true, message: <span className='w-[500px] relative bottom-1 left-[10px]'>Vui lòng điền nội dung của chứng chỉ</span>
                                                    },

                                                    ]}
                                                >
                                                    <div className='flex justify-center '>
                                                        <TextArea className='w-full me-20' showCount maxLength={200} placeholder='Vui lòng điền nội dung' cols={12} rows={2} />

                                                    </div>

                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className=" col-span-2 right flex-col justify-start items-start gap-10 inline-flex">
                                <div className="self-stretch h-[2215.65px] flex-col justify-start items-start gap-[25px] flex">
                                    <div className="self-stretch w-full h-[1250px] px-2.5 py-5  border-2 border-gray-200  flex-col justify-start items-start gap-[25px] flex  relative right-5">

                                        <div className="w-full text-black text-2xl font-bold font-['Arial']">Thông tin cá Koi</div>
                                        <div className="self-stretch h-[55.65px] justify-start items-start gap-2.5 inline-flex">
                                            <div className="h-[50px] w-full m-0 p-0 justify-start items-start gap-2.5 flex">
                                                <Form.Item
                                                    label={<span className="relative top-1">Giống</span>}
                                                    labelAlign="right"
                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 15 }}
                                                    name="categoryId"
                                                    className='p-0 w-[200px]'
                                                    rules={[{ required: true, message: <span className='!w-[500px] relative bottom-3 left-[10px]'>Vui lòng chọn giống</span> }]}
                                                >
                                                    <Select
                                                        className="w-full h-[40px] ms-10 relative bottom-3 right-[30px]"
                                                        defaultValue=""
                                                        onChange={handleSelectCategory}
                                                        dropdownStyle={{ width: 150, marginLeft: 20 }}
                                                        suffixIcon={<CustomSVGIcon />}
                                                    >

                                                        {CategoryItem.map(item => (
                                                            <Option key={item.key} value={item.value}>
                                                                {item.label}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            <div className="w-full h-[42px] p-2.5 bg-white relative right-[50px] bottom-[10px] ">
                                                <Form.Item

                                                    label={<span className="relative top-1 w-full">Giới tính</span>}
                                                    labelAlign=""
                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 24 }}
                                                    name="gender"
                                                    className='p-0 w-full  '
                                                    rules={[{ required: true, message: <span className='!w-[500px] relative bottom-3 left-[10px]'>Vui lòng chọn giới tính</span> }]}
                                                >
                                                    <Select
                                                        className="w-full h-[40px] flex items-center justify-between relative left-[12px] bottom-3 "
                                                        defaultValue=""
                                                        onChange={handleSelectGender}
                                                        dropdownStyle={{ width: 100, marginLeft: 20 }}

                                                        suffixIcon={<CustomSVGIcon />}
                                                    >

                                                        {gender.map(item => (
                                                            <Option key={item.key} value={item.value}>
                                                                {item.label}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="justify-start items-start inline-flex">
                                            <div className="flex items-center mt-4">
                                                <Form.Item

                                                    label={<span className="relative top-1">Tuổi</span>}
                                                    labelAlign=""
                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 9 }}
                                                    name="age"

                                                    className='p-0 m-0 w-[300px]  '
                                                    rules={[{
                                                        required: true, message: <span className='!w-[500px] relative left-[50px] bottom-[30px]'>Vui lòng nhập tuổi</span>
                                                    },
                                                    {
                                                        pattern: new RegExp(/^[0-9]+$/),
                                                        message: <span className='!w-[500px] relative left-[50px]  bottom-[30px]'>Tuổi phải là số!</span>
                                                    }
                                                    ]}
                                                >
                                                    <Input placeholder="Nhập tuổi" className='w-[150px] relative left-12 bottom-8'></Input>
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div className="relative bottom-10">
                                            <Form.Item
                                                label={<span className="relative top-1">Độ thuần chủng</span>}
                                                labelAlign=""
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 9 }}
                                                name="pureBred"
                                                className='p-0 w-[500px]  '
                                                rules={[{ required: true, message: <span className='!w-[500px] relative bottom-1 left-[10px]'>Vui lòng chọn độ thuần chủng</span> }]}
                                            >
                                                <Select
                                                    className="w-full h-[40px] flex items-center justify-between relative left-[12px] bottom-3 "
                                                    defaultValue=""
                                                    onChange={handleSelectPureBred}
                                                    dropdownStyle={{ width: 200, marginLeft: 20 }}

                                                    suffixIcon={<CustomSVGIcon />}
                                                >

                                                    {pureBred.map(item => (
                                                        <Option key={item.key} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div className="w-[464px] justify-start items-start gap-2.5 inline-flex">
                                            <Form.Item
                                                label={<span className="relative top-1">Kích thước (centimet)</span>}
                                                labelAlign=""
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 9 }}
                                                name="size"
                                                className='p-0 m-0 w-[300px] relative bottom-24  '
                                                rules={[{
                                                    required: true, message: <span className='!w-[500px] relative bottom-1 left-[10px]'>Vui lòng kích thước</span>
                                                },
                                                {
                                                    pattern: new RegExp(/^[0-9]+$/),
                                                    message: <span className='!w-[500px] relative bottom-1 left-[10px]'>Kích thước phải là số!</span>
                                                },
                                                {
                                                    validator: (_, value) => {
                                                        if (value && (value < 0 || value > 200)) {
                                                            return Promise.reject(<span className='!w-[500px] relative bottom-1 left-[10px]'>Kích thước phải trong khoảng từ 0 đến 200!</span>);
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                                ]}
                                            >
                                                <Input placeholder='10000' className='w-[100px] ms-10'></Input>
                                            </Form.Item>
                                        </div>
                                        <div className="self-stretch w-full h-[103px] ">
                                            <Form.Item
                                                label={<span className="relative top-1">Tính cách</span>}

                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                name="personality"
                                                className='p-0 m-0 w-[full] relative bottom-28  '
                                                rules={[{
                                                    required: true, message: <span className='w-[500px] relative bottom-1 left-[10px]'>Vui lòng mô tả tính cách Koi của bạn</span>
                                                },

                                                ]}
                                            >
                                                <div className='flex justify-center '>
                                                    <TextArea className='w-full mx-10' showCount maxLength={200} placeholder='Viết một vài điều gì đó về cá của bạn' cols={12} rows={2} />

                                                </div>

                                            </Form.Item>
                                        </div>
                                        <div className="self-stretch h-[103px] ">
                                            <Form.Item
                                                label={<span className="relative top-1">Thức ăn chính</span>}

                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                name="food"
                                                className='p-0 m-0 w-[full] relative bottom-28  '
                                                rules={[{
                                                    required: true, message: <span className='w-[500px] relative bottom-1 left-[10px]'>Vui long điền thức ăn của Koi</span>
                                                },

                                                ]}
                                            >
                                                <div className='flex justify-center '>
                                                    <TextArea className='w-full mx-10' showCount maxLength={200} placeholder='Viết về thức ăn mà Koi yêu thích' cols={12} rows={2} />

                                                </div>

                                            </Form.Item>
                                        </div>
                                        <div className="self-stretch h-[103px] ">
                                            <Form.Item
                                                label={<span className="relative top-1">Sức khỏe</span>}

                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                name="health"
                                                className='p-0 m-0 w-[full] relative bottom-28  '
                                                rules={[{
                                                    required: true, message: <span className='w-[500px] relative bottom-1 left-[10px]'>Vui lòng điền trạng thái sức khỏe của cá</span>
                                                },

                                                ]}
                                            >
                                                <div className='flex justify-center '>
                                                    <TextArea className='w-full mx-10' showCount maxLength={200} placeholder='Mô tả về sức khỏe của Koi' cols={12} rows={2} />

                                                </div>

                                            </Form.Item>
                                        </div>
                                        <div className="self-stretch h-[103px] ">
                                            <Form.Item
                                                label={<span className="relative top-1">Độ pH</span>}

                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                name="ph"
                                                className='p-0 m-0 w-[full] relative bottom-28  '
                                                rules={[{
                                                    required: true, message: <span className='w-[500px] relative bottom-1 left-[10px]'>Vui lòng điền trạng thái sức khỏe của cá</span>
                                                },

                                                ]}
                                            >
                                                <div className='flex '>
                                                    <Input placeholder='7 - 7.5' className='w-[200px] ms-10'></Input>
                                                </div>

                                            </Form.Item>
                                        </div>
                                        <div className="self-stretch h-[103px] ">
                                            <Form.Item
                                                label={<span className="relative top-1">Nhiệt độ môi trường sống (&deg;C)</span>}

                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                name="temperature"
                                                className='p-0 m-0 w-[full] relative bottom-28  '
                                                rules={[{
                                                    required: true, message: <span className='w-[500px] relative bottom-1 left-[10px]'>Vui lòng điền trạng thái sức khỏe của cá</span>
                                                },

                                                ]}
                                            >
                                                <div className='flex '>
                                                    <Input placeholder='20 - 27' className='w-[200px] ms-10'></Input>
                                                </div>

                                            </Form.Item>
                                        </div>
                                        <div className="self-stretch h-[103px]">
                                            <Form.Item
                                                label={<span className="relative top-1">Nguồn gốc</span>}

                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                name="origin"
                                                className='p-0 m-0 w-[full] relative bottom-28  '
                                                rules={[{
                                                    required: true, message: <span className='w-[500px] relative bottom-1 left-[10px]'>Vui lòng điền thông tin nguồn gốc</span>
                                                },

                                                ]}
                                            >
                                                <div className='flex justify-center '>
                                                    <TextArea className='w-full mx-10' showCount maxLength={200} placeholder='Trang trại Koi Farm' cols={12} rows={2} />

                                                </div>

                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="self-stretch h-[full] px-2.5 py-5 rounded-[10px] border border-black flex-col justify-start items-start gap-[25px] flex">
                                        <div className="text-black text-2xl w-full font-bold font-['Arial'] text-center">Thông tin ký gửi & liên hệ</div>
                                        <div className="h-[50px] pr-[243px] justify-start items-center inline-flex">
                                            <div className="w-full self-stretch p-2.5 bg-white  justify-center items-center gap-2.5 inline-flex">
                                                <Form.Item
                                                    label={<span className="relative top-1 w-[10rem]">Hình thức ký gửi</span>}
                                                    labelAlign="right"
                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 15 }}
                                                    name="online"
                                                    className='p-0 w-[20rem]'
                                                    rules={[{ required: true, message: <span className='!w-[500px] relative bottom-3 left-[10px]'>Vui lòng chọn hình thức ký gửi</span> }]}
                                                >
                                                    <Select
                                                        className="w-full h-[40px] ms-10 relative bottom-3 right-[30px]"
                                                        defaultValue=""
                                                        onChange={handleSelectCategory}
                                                        dropdownStyle={{ width: 200, marginLeft: 20 }}
                                                        suffixIcon={<CustomSVGIcon />}
                                                    >

                                                        {consignmentForm.map(item => (
                                                            <Option key={item.key} value={item.value}>
                                                                {item.label}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="h-[50px] pr-[304px] justify-start items-center inline-flex">
                                            <div className="w-full self-stretch p-[10px] bg-white  justify-center items-center gap-2.5 inline-flex">
                                                <Form.Item
                                                    label={<span className="relative top-1 w-[200px] p-0">Loại ký gửi</span>}
                                                    labelAlign="right"
                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 15 }}
                                                    name="consignmentType"
                                                    className="pt-4 w-[20rem]"
                                                    rules={[{ required: true, message: <span className='!w-[500px] relative top-1 left-[10px]'>Vui lòng chọn loại ký gửi</span> }]}
                                                >
                                                    <Select
                                                        className="w-full h-[40px] flex justify-between items-center" // Flexbox for centering
                                                        defaultValue=""
                                                        onChange={handleSelectConsigmentType}
                                                        dropdownStyle={{ width: 200, marginLeft: 20 }}
                                                        suffixIcon={<CustomSVGIcon />}
                                                    >
                                                        {consignmentType.map(item => (
                                                            <Option key={item.key} value={item.value}>
                                                                {item.label}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div className="h-[50px] pr-[304px] justify-start items-center inline-flex">
                                            <div className="w-full p-[10px] mt-12 self-stretch  bg-white rounded-[10px]  justify-center items-center gap-2.5 inline-flex">
                                                <Form.Item
                                                    label={<span className="relative top-1">Gói ký gửi</span>}
                                                    labelAlign="right"
                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 15 }}
                                                    name="duration"
                                                    className='p-0 w-[20rem]'
                                                    rules={[{ required: true, message: <span className='!w-[500px] relative bottom-3 left-[10px]'>Vui lòng chọn gói ký gửi</span> }]}
                                                >
                                                    <Select
                                                        className="w-full h-[40px] ms-10 relative bottom-3 right-[30px]"
                                                        defaultValue=""
                                                        onChange={handleSelectPackage}
                                                        dropdownStyle={{ width: 200, marginLeft: 20 }}
                                                        suffixIcon={<CustomSVGIcon />}
                                                    >

                                                        {SelectedConsignmentType === "1"
                                                            ? consignmentPackForSell.map(item => (
                                                                <Option key={item.key} value={item.value}>
                                                                    {item.label}
                                                                </Option>
                                                            ))
                                                            : consignmentPackForTakeCare.map(item => (
                                                                <Option key={item.key} value={item.value}>
                                                                    {item.label}
                                                                </Option>
                                                            ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="w-full h-full ">
                                            <div className=" grid grid-flow-col p-[10px] pt-0 grid-cols-5 text-black  font-['Arial']">
                                                <Form.Item
                                                    label={<span className="relative top-1">Số điện thoại</span>}
                                                    labelAlign=""
                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 11 }}
                                                    name="phoneNumber"
                                                    className='m-0 w-[500px] right-2 relative self-stretch p-[10px] '
                                                    rules={[{
                                                        required: true, message: <span className='!w-[500px] relative top-1 left-10'>Vui lòng nhập số điện thoại</span>
                                                    },
                                                    {
                                                        pattern: new RegExp(/^[0-9]+$/),
                                                        message: <span className='!w-[500px] relative top-1 left-10'>Số điện thoại phải là số!</span>
                                                    },

                                                    ]}
                                                >
                                                    <Input placeholder='' className='w-full ms-10'></Input>

                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="self-stretch h-full flex-col justify-start items-start gap-[25px] flex">

                                            {SelectedConsignmentType === "1"
                                                ?
                                                <>
                                                    <Form.Item
                                                        label={<span className="relative top-1">Giá  bán(VND)  nếu người dùng chọn ký gửi để bán</span>}
                                                        labelAlign=""
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 11 }}
                                                        name="price"
                                                        className='m-0 w-[500px] relative self-stretch p-[10px] text-black text-2xl font-bold '
                                                        rules={[{
                                                            required: true, message: <span className='!w-[500px] relative top-1 left-10'>Vui lòng nhập giá bán</span>
                                                        },
                                                        {
                                                            pattern: new RegExp(/^[0-9]+$/),
                                                            message: <span className='!w-[500px] relative top-1 left-10'>Giá bán phải là số!</span>
                                                        },

                                                        ]}
                                                    >
                                                        <Input value={SelectedConsignmentType === '1' ? inputPrice : ''} onChange={handleInputPrice} placeholder='10000' className='w-full ms-10'></Input>

                                                    </Form.Item>
                                                    <div className="p-[10px] mt-2 w-full">
                                                        <h1 className='text-black font-bold'>
                                                            Giá đã nhập
                                                        </h1>
                                                        <div className='text-center text-2xl m-0 font-bold text-[#FA4444]'> {

                                                            inputPrice > 0 ? formatVND(Number(inputPrice)) : '0 ₫'
                                                        }</div>
                                                    </div></>

                                                : <></>}





                                            <div className="w-full h-full ">
                                                <div className=" grid grid-flow-col p-[10px] pt-0 grid-cols-5 text-black text-2xl font-bold font-['Arial']">
                                                    <Form.Item name="serviceFee"
                                                        initialValue={serviceFee}
                                                        preserve={true} hidden >
                                                        <Input value="12345" disabled hidden />
                                                    </Form.Item>

                                                    {/* Display Service Fee */}
                                                    <Form.Item
                                                        label={
                                                            <>
                                                                <span className="text-black font-['Arial']">Chi phí(</span>
                                                                <span className="text-[#e94444] font-['Arial']">xem chi tiết</span>
                                                                <span className="text-black font-['Arial']">): </span>
                                                            </>
                                                        }
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        className="w-full col-span-5"
                                                    >
                                                        <div className="text-center text-[#FA4444] text-2xl">
                                                            {SelectedConsignmentType === '1' ? formatVND(serviceFee) : '0 ₫'}
                                                        </div>
                                                    </Form.Item>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full'>
                                <Form.Item
                                    wrapperCol={{
                                        offset: 24,
                                        span: 24,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>

                    </Form >


                </div >

            </div >
        </>
    )
}

export default RequestConsignment
