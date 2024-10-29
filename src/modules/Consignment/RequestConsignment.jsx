
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Form, Input, Row, Select, Upload, Image, Steps, message, Col, Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import imageSrc from '/img/SOWA.webp'
import './requestConsignment.css'
import { ConsignmentApi } from '../../apis/Consignment.api';
import { useMutation } from '@tanstack/react-query';
import LoadingModal from '../Modal/LoadingModal';
import { toast, ToastContainer } from 'react-toastify';
import { saveConsignmentID } from '../../Redux/Slices/consignmentID_Slice';
import { useDispatch } from 'react-redux';
import FishApi from '../../apis/Fish.api';
import { saveTypePayment } from '../../Redux/Slices/Type_Slice';
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

    const [serviceFee, setServiceFee] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedKoiImage, setSelectedKoiImage] = useState(null);
    const [selectedKoiCertificate, setSelectedKoiCertificate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1)
    const [consignmentID, setConsignmentID] = useState();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [consignmentPackForSell, setConsignmentPackForSell] = useState([]);
    const [consignmentPackForTakeCare, setConsignmentPackForTakeCare] = useState([]);
    const [consignmentRates, setConsignmentRates] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);



    useEffect(() => {
        const fetchConsignmentFees = async () => {
            try {
                const response = await ConsignmentApi.getAllServiceFee();
                const packages = response.data.content; // Access nested data

                // Filter packages and set dropdown options
                setConsignmentPackForSell(
                    packages
                        .filter((item) => item.sale === true && item.status === true) // Include active status filter
                        .map((item) => ({
                            key: item.consignmentFeeId,
                            value: item.duration,
                            label: `Gói: ${item.duration} tháng - Phí: ${item.rate * 100}%`,
                        }))
                );

                setConsignmentPackForTakeCare(
                    packages
                        .filter((item) => item.sale === false && item.status === true) // Include active status filter
                        .map((item) => ({
                            key: item.consignmentFeeId,
                            value: item.duration,
                            label: `Gói: ${item.duration} tháng - Phí: ${item.rate * 100}%`,
                        }))
                );

                // Store rates in an accessible structure for calculations
                const rates = {};
                packages.forEach((item) => {
                    if (item.status) { // Only include active items
                        const type = item.sale ? '1' : '0';
                        if (!rates[type]) rates[type] = {};
                        rates[type][item.duration] = item.rate;
                    }
                });
                setConsignmentRates(rates);
            } catch (error) {
                console.error("Failed to fetch consignment fees:", error.message);
            }
        };

        fetchConsignmentFees();
    }, []);

    const handleCurrentPage = (prevPage) => {
        localStorage.setItem('agreedToPolicy', false);
        prevPage = 1
        if (prevPage <= 1) {
            setCurrentPage(prevPage => prevPage + 1);
            navigate('/request-consignment');
        }
    };

    const handleCurrentPages = (prevPage) => {
        prevPage = 1;
        if (prevPage <= 1) {
            setCurrentPage(prevPage => prevPage + 1);
            navigate(`/status-consignment/`);
        }
    };
    const fishFromOrderDetail = localStorage.getItem('fishConsignmentID');

    useEffect(() => {
        const fishFromOrderDetail = localStorage.getItem('fishConsignmentID');
        const consignmentIDs = localStorage.getItem('consignmentID');

        if (fishFromOrderDetail || consignmentIDs) {
            const fetchKoiData = async () => {
                try {
                    const koiData = await FishApi.getFishDetail(fishFromOrderDetail);
                    const certificate = await ConsignmentApi.getCertificateByID(fishFromOrderDetail);

                    const selectedCateId = koiData.categoryId?.toString() || '';
                    setSelectedCategory(selectedCateId);

                    const gender = koiData.gender === true || koiData.gender === 'true' || koiData.gender === 1 ? '1' : '0';
                    setSelectedGender(gender);

                    const pureBredValue = koiData.purebred?.toString() || '';
                    setSelectedPureBred(pureBredValue);
                    setInputPrice(koiData.price);

                    setImageSrc(koiData.koiImage);
                    setImageSrcCer(certificate.data.image);
                    setSelectedKoiImage(koiData.koiImage);
                    setSelectedKoiCertificate(certificate.data.image);

                    // Đặt giá trị cho form
                    form.setFieldsValue({
                        origin: koiData.origin,
                        gender: gender,
                        age: koiData.age,
                        koiImg: koiData.koiImage,
                        certImg: certificate.data.image,
                        size: koiData.size,
                        categoryId: selectedCateId,
                        pureBred: pureBredValue,
                        personality: koiData.personality,
                        health: koiData.health,
                        ph: koiData.ph,
                        temperature: koiData.temperature,
                        price: koiData.price,
                    });
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu cá Koi:', error);

                }
            };

            fetchKoiData();
        } else {

            // toast.error('Không tồn tại đơn yêu cầu ký gửi nào, vui lòng tạo mới');
        }

    }, [inputPrice, SelectedPackage]);

    // Second useEffect to handle service fee calculation
    useEffect(() => {
        if (inputPrice && SelectedPackage) {

            const fee = handleFee(inputPrice, SelectedPackage);

            setServiceFee(fee);
            setServiceFee(fee);


        }
    }, [inputPrice, SelectedPackage, setSelectedConsignmentType]);

    useEffect(() => {
    }, [SelectedPackage]);

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
            value: "0",
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
            value: "0",
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



    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });


    const { mutate: handleConsignmentSubmit } = useMutation({
        mutationFn: async (formData) => {
            setIsLoading(true);
            return await ConsignmentApi.requestConsignment(formData);
        },
        onSuccess: async (response, formData) => {

            //   await new Promise((resolve) => setTimeout(resolve, 3000));

            const consignmentID = response.data;
            dispatch(saveConsignmentID(consignmentID));
            localStorage.removeItem('fishConsignmentID');
            handleCurrentPages(currentPage);
            message.success('Đăng ký ký gửi thành công');
            setIsLoading(false);
        },
        onError: async (error) => {

            //   await new Promise((resolve) => setTimeout(resolve, 3000));

            const errorMessage =
                error?.response?.data?.message || 'An error occurred, please try again!';
            message.error(errorMessage);
            setIsLoading(false);
        },
    });

    const onFinish = async (values) => {
        try {
            const typ = 'false';
            dispatch(saveTypePayment(typ));
            const formData = new FormData();
            formData.append('koiImg', selectedKoiImage);
            formData.append('certImg', selectedKoiCertificate);


            Object.keys(values).forEach((key) => {
                if (key !== 'koiImg' && key !== 'certImg' && key !== 'accountId') {
                    formData.append(key, values[key]);
                }
            });


            const dataProfile = JSON.parse(localStorage.getItem('user'));
            const accountId = dataProfile && dataProfile.id ? Number(dataProfile.id) : null;
            if (!accountId) {
                throw new Error('Account ID not found in localStorage');
            }
            const userAddress = dataProfile?.address;
           

            if (!userAddress) {

                setIsModalVisible(true);
                return;
            }

            const x = serviceFee;
            formData.append('serviceFee', x);
            formData.append('accountId', accountId);
            formData.append('water', 'lanh');
            if (selectedKoiImage instanceof File) {
                formData.append('koiImgURL', '');
            } else if (typeof selectedKoiImage === 'string') {
                formData.append('koiImgURL', selectedKoiImage);
            }

            if (selectedKoiCertificate instanceof File) {
                formData.append('certImgURL', '');
            } else if (typeof selectedKoiCertificate === 'string') {
                formData.append('certImgURL', selectedKoiCertificate);
            }

            handleConsignmentSubmit(formData);

        } catch (error) {
            console.error('Error in form submission:', error);
            toast.error('Error in form submission');
        }
    };
    const handleModalOk = () => {
        setIsModalVisible(false);
        navigate('/profile');
    };

    const onFinishFailed = (errorInfo) => {
        errorInfo.values.serviceFee = serviceFee;
        errorInfo.values.koiImg = imageSrc; errorInfo.values.certImg = imageSrcCer;

    };
    const onSubmit = (data) => {
    };
    const handleUploadKoiImage = ({ file }) => {
        if (validateFile(file)) {
            setSelectedKoiImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImageSrc(previewUrl);
        }
    };

    const handleUploadKoiCertificate = ({ file }) => {
        if (validateFile(file)) {
            setSelectedKoiCertificate(file);
            const previewUrl = URL.createObjectURL(file);
            setImageSrcCer(previewUrl);
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

        setLoading(true);

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
        const typeRates = consignmentRates[SelectedConsignmentType];
        const rate = typeRates ? typeRates[selectedPackages] : 0;

        // Calculate and round the fee
        return Math.round(price * rate);
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
    };
    const handleSelectPackage = (value) => {
        setSelectedPackage(value);


    };


    const handleSelectGender = (value) => {

        setSelectedGender(value);
    };
    const handleSelectPureBred = (value) => {
        setSelectedPureBred(value);
    };

    const handleSelectConsigmentType = (value) => {

        setSelectedConsignmentType(value);

        if (value)
            if (fishFromOrderDetail) {
                form.setFieldsValue({
                    duration: '',
                    price: inputPrice,

                });

                setServiceFee(0)
            } else {
                form.setFieldsValue({
                    duration: '',

                });
                setServiceFee(0)
            }


    };
    const handleDeleteImage = () => {
        setImageSrc(null);   // Clear image preview
        setFileList([]);
        // Clear file list
        message.success('Image deleted successfully');
    };
    const description = "Chính sách ký gửi";
    const description1 = "Điền thông tin ký gửi";
    const description2 = "Trạng thái duyệt đơn ký gửi";
    const description3 = "Thanh toán";
    const description4 = "Hoàn tất";

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
                                Yêu Cầu Ký gửi
                            </Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <div className='flex flex-col items-center'>
                <div class="w-full max-w-[950px] h-[89px] relative mx-auto p-4">
                    {/* <!-- Lines --> */}
                    <div class="w-full max-w-[950px] h-[89px] relative mx-auto my-0 p-4">
                        <Steps current={currentPage} status="process">
                            <Steps title="&nbsp;" description={description} />
                            <Steps title="&nbsp;" description={description1} />
                            <Steps title="&nbsp;" description={description2} />
                            <Steps title="&nbsp;" description={description3} />
                            <Steps title="&nbsp;" description={description4} />
                        </Steps>
                    </div>
                </div>

                <div className="w-[70%] border m-10 p-10 form-container">
                    <Modal
                        title="Địa chỉ chưa được cập nhật"
                        visible={isModalVisible}
                        onOk={handleModalOk}
                        onCancel={() => setIsModalVisible(false)}
                        okText="Cập nhật thông tin cá nhấn"
                        cancelText="Hủy"
                    >
                        <p>Địa chỉ của bạn chưa được cập nhật. Vui lòng cập nhật thông tin cá nhân để tiệp tục trãi nghiệm tính năng ký gửi</p>
                    </Modal>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        {/* Form Title */}
                        <Row justify="center">
                            <Col span={24}>
                                <h1 className="text-2xl font-bold text-center my-4">
                                    BIỂU MẪU KÝ GỬI CÁ KOI
                                </h1>
                            </Col>
                        </Row>

                        {/* Main Content */}
                        <Row gutter={24} span={24}>
                            {/* Left Column */}
                            <Col xs={24} sm={24} md={12}>
                                {/* Koi Image Upload */}
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    label="Ảnh Koi"
                                    name="koiImg"
                                    className="flex justify-center mt-0 p-0"
                                    rules={[
                                        {
                                            required: true,
                                            message: <span className='w-[500px] relative '>Ảnh Koi là bắt buộc</span>
                                        }
                                    ]}
                                >
                                    {imageSrc && (
                                        <div className="relative top-[112px] left-[39px] w-[221px] h-0 bg-white flex items-center justify-center">
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
                                        <div className="w-[225px] h-[224px] bg-white border-2  flex items-center justify-center">
                                            <span className="text-gray-400">Kéo và thả ảnh hoặc nhấn để chọn</span>
                                        </div>
                                    </Upload>
                                    {/* */}
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}

                                    name="koiImg"
                                    className="mt-0 p-0"
                                    rules={[
                                        {
                                            required: true,
                                            message: <span className='w-[500px] relative '></span>
                                        }
                                    ]}
                                >
                                    {imageSrc && (
                                        <div className="relative top-[112px] left-[25px] w-[221px] h-0 bg-white flex items-center justify-center">
                                            <Image hidden
                                                width={222}
                                                height={220}
                                                src={imageSrc}
                                            />
                                        </div>

                                    )}

                                    <Upload
                                        name="koiImg"

                                        className="flex justify-center"
                                        showUploadList={false}
                                        onChange={handleUploadKoiImage}
                                        beforeUpload={() => false}
                                    >

                                        {imageSrc ? <Button className="">
                                            <div className=" ">
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
                                                <span className="mx-6 text-center">Thay đổi ảnh</span>
                                            </div>
                                        </Button> : <Button className="">
                                            <div className="  ">
                                                <svg
                                                    className="absolute w-5 h-5 "
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
                                                <span className="mx-6 text-center">Tải ảnh lên</span>
                                            </div>
                                        </Button>

                                        }



                                    </Upload>
                                </Form.Item>

                                {/* Certificate Image Upload */}

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    label={<span >Chứng chỉ</span>}
                                    name="certImg"
                                    className="flex justify-center "
                                    rules={[
                                        {
                                            required: true,
                                            message: <span className='w-[500px] relative '>Chứng chỉ của Koi là bắt buộc</span>
                                        }
                                    ]}
                                >
                                    {imageSrcCer && (
                                        <div className="relative top-[112px] left-[47px] w-[221px] h-0 bg-white flex items-center justify-center">
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
                                        <div className="w-[225px] h-[224px] bg-white border-2  flex items-center justify-center">
                                            <span className="text-gray-400">Kéo và thả ảnh hoặc nhấn để chọn</span>
                                        </div>
                                    </Upload>
                                    {/**/}
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}

                                    name="certImg"
                                    className="mt-0 p-0"
                                    rules={[
                                        {
                                            required: true,
                                            message: <span className='w-[500px] relative '></span>
                                        }
                                    ]}
                                >
                                    {imageSrcCer && (
                                        <div className="relative top-[112px] left-[25px] w-[221px] h-0 bg-white flex items-center justify-center">
                                            <Image hidden
                                                width={222}
                                                height={220}
                                                src={imageSrcCer}
                                            />
                                        </div>

                                    )}

                                    <Upload
                                        name="certImg"

                                        className="flex justify-center"
                                        showUploadList={false}
                                        onChange={handleUploadKoiCertificate}
                                        beforeUpload={() => false}
                                    >

                                        {imageSrcCer ? <Button className="">
                                            <div className=" ">
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
                                                <span className="mx-6 text-center">Thay đổi ảnh</span>
                                            </div>
                                        </Button> : <Button className="">
                                            <div className="  ">
                                                <svg
                                                    className="absolute w-5 h-5 "
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
                                                <span className="mx-6 text-center">Tải ảnh lên</span>
                                            </div>
                                        </Button>

                                        }



                                    </Upload>
                                </Form.Item>

                                <div >
                                    <Form.Item
                                        label={<span className="w-[200px]">Tên chứng chỉ</span>}

                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        name="name"
                                        className='flex justify-center '
                                        rules={[{
                                            required: true, message: <span className='w-[500px] relative '>Vui lòng điền tên chứng chỉ</span>
                                        },

                                        ]}
                                    >

                                        <TextArea className=' ' placeholder='Vui lòng điền tên chứng chỉ' cols={12} rows={2}
                                            autoSize={{ minRows: 2, maxRows: 4 }} />



                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        label={<span className="w-[200px]">Ghi chú</span>}

                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        name="notes"
                                        className='flex justify-center '
                                        rules={[{
                                            required: true, message: <span className='w-[500px] relative '>Vui lòng điền ghi chú</span>
                                        },

                                        ]}
                                    >
                                        <TextArea className='' placeholder='Vui lòng điền nội dung' cols={12} rows={2}
                                            autoSize={{ minRows: 2, maxRows: 4 }} />

                                    </Form.Item>
                                </div>

                            </Col>

                            {/* Right Column */}
                            <Col xs={24} sm={24} md={12}>
                                {/* Koi Information */}
                                <div className="border p-4 rounded-md">
                                    <h2 className="text-xl font-bold text-center mb-4">
                                        Thông tin cá Koi
                                    </h2>


                                    <Row gutter={16}>
                                        {/* Category */}
                                        <Col span={8}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                label="Giống"
                                                name="categoryId"
                                                rules={[{ required: true, message: 'Vui lòng chọn giống' }]}
                                            >
                                                <Select placeholder="Chọn giống" onChange={handleSelectCategory}>
                                                    {CategoryItem.map((item) => (
                                                        <Option key={item.key} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        {/* Gender */}
                                        <Col span={8}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                label="Giới tính"
                                                name="gender"
                                                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                                            >
                                                <Select placeholder="Chọn giới tính" onChange={handleSelectGender}>
                                                    {gender.map((item) => (
                                                        <Option key={item.key} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        {/* Pure Bred */}
                                        <Col span={8}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                label="Độ thuần chủng"
                                                name="pureBred"
                                                rules={[{ required: true, message: 'Vui lòng chọn độ thuần chủng' }]}
                                            >
                                                <Select placeholder="--Lựa chọn--" onChange={handleSelectPureBred}>
                                                    {pureBred.map((item) => (
                                                        <Option key={item.key} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={24}>
                                        <Col span={8}>
                                            {/* Age Input */}
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                label="Tuổi"
                                                name="age"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập tuổi' },
                                                    {
                                                        pattern: /^[0-9]+$/,
                                                        message: 'Tuổi phải là số!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Nhập tuổi" />
                                            </Form.Item>
                                        </Col>
                                        {/* Size Input */}
                                        <Col span={8}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                label="Kích thước (cm)"
                                                name="size"
                                                rules={[
                                                    { required: true, message: 'Vui lòng điền kích thước' },
                                                    {
                                                        pattern: /^[0-9]+(\.[0-9]+)?$/,
                                                        message: 'Kích thước phải là số và có thể chứa số thập phân!',
                                                    },
                                                    {
                                                        validator: (_, value) =>
                                                            value && (value <= 0 || value > 200)
                                                                ? Promise.reject('Kích thước phải trong khoảng từ 0 đến 200!')
                                                                : Promise.resolve(),
                                                    },
                                                ]}

                                            >
                                                <Input placeholder="Nhập kích thước" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {/* Personality */}
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        label="Tính cách"
                                        name="personality"
                                        rules={[
                                            { required: true, message: 'Vui lòng mô tả tính cách Koi của bạn' },
                                        ]}
                                    >
                                        <TextArea
                                            placeholder="Viết một vài điều về cá của bạn"
                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                        />
                                    </Form.Item>

                                    {/* Food */}
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        label="Thức ăn chính"
                                        name="food"
                                        rules={[
                                            { required: true, message: 'Vui lòng điền thức ăn của Koi' },
                                        ]}
                                    >
                                        <TextArea
                                            placeholder="Viết về thức ăn mà Koi yêu thích"
                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                        />
                                    </Form.Item>

                                    {/* Health */}
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        label="Sức khỏe"
                                        name="health"
                                        rules={[
                                            { required: true, message: 'Vui lòng điền trạng thái sức khỏe của Koi' },
                                        ]}
                                    >
                                        <TextArea
                                            placeholder="Mô tả về sức khỏe của Koi"
                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                        />
                                    </Form.Item>

                                    {/* pH Level */}
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        label="Độ pH"
                                        name="ph"
                                        rules={[
                                            { required: true, message: 'Vui lòng điền độ pH thích hợp với Koi' },
                                        ]}
                                    >
                                        <Input placeholder="7 - 7.5" />
                                    </Form.Item>

                                    {/* Temperature */}
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        label="Nhiệt độ môi trường sống (°C)"
                                        name="temperature"
                                        rules={[
                                            { required: true, message: 'Vui lòng điền nhiệt độ phù hợp với Koi' },
                                        ]}
                                    >
                                        <Input placeholder="20 - 27" />
                                    </Form.Item>

                                    {/* Origin */}
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        label="Nguồn gốc"
                                        name="origin"
                                        rules={[
                                            { required: true, message: 'Vui lòng điền thông tin nguồn gốc' },
                                        ]}
                                    >
                                        <TextArea
                                            placeholder="Trang trại Koi Farm"
                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                        />
                                    </Form.Item>



                                    {/* First Row: Consignment Form and Consignment Type */}
                                    <Row gutter={16}>
                                        {/* Consignment Form */}
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                label="Hình thức ký gửi"
                                                name="online"
                                                rules={[
                                                    { required: true, message: 'Vui lòng chọn hình thức ký gửi' },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Chọn hình thức ký gửi"
                                                    onChange={handleSelectCategory}
                                                >
                                                    {consignmentForm.map((item) => (
                                                        <Option key={item.key} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        {/* Consignment Type */}
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                label="Loại ký gửi"
                                                name="consignmentType"
                                                rules={[
                                                    { required: true, message: 'Vui lòng chọn loại ký gửi' },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Chọn loại ký gửi"
                                                    onChange={handleSelectConsigmentType}
                                                    value={SelectedConsignmentType}

                                                >
                                                    {consignmentType.map((item) => (
                                                        <Option key={item.key} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    {/* Second Row: Package and Phone Number */}
                                    <Row gutter={16}>
                                        {/* Package */}
                                        {SelectedConsignmentType === '1' ? (
                                            <>
                                                {/* Consignment for Sale */}
                                                <Col xs={24} sm={12}>
                                                    <Form.Item
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        label="Gói ký gửi"
                                                        name="duration"
                                                        rules={[
                                                            { required: true, message: 'Vui lòng chọn gói ký gửi' },
                                                        ]}
                                                    >
                                                        <Select
                                                            placeholder="Chọn gói ký gửi"
                                                            onChange={handleSelectPackage}
                                                            value={SelectedPackage}
                                                        >
                                                            <Option value="" disabled>
                                                                --Lựa chọn--
                                                            </Option>
                                                            {consignmentPackForSell.map((item) => (
                                                                <Option key={item.key} value={item.value}>
                                                                    {item.label}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} sm={12}>
                                                    <Form.Item
                                                        label="Số điện thoại"
                                                        name="phoneNumber"
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        rules={[
                                                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                                                            { pattern: /^[0-9]+$/, message: 'Số điện thoại phải là số!' },
                                                            {
                                                                pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                                                                message: 'Số điện thoại không đúng định dạng!',
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="Nhập số điện thoại" />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ) : SelectedConsignmentType === '0' ? (
                                            <>
                                                {/* Consignment for Take Care */}
                                                <Col xs={24} sm={12}>
                                                    <Form.Item
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        label="Gói ký gửi"
                                                        name="duration"
                                                        rules={[
                                                            { required: true, message: 'Vui lòng chọn gói ký gửi' },
                                                        ]}
                                                    >
                                                        <Select
                                                            placeholder="Chọn gói ký gửi"
                                                            onChange={handleSelectPackage}
                                                            value={SelectedPackage}
                                                        >
                                                            <Option value="" disabled>
                                                                --Lựa chọn--
                                                            </Option>
                                                            {consignmentPackForTakeCare.map((item) => (
                                                                <Option key={item.key} value={item.value}>
                                                                    {item.label}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} sm={12}>
                                                    <Form.Item
                                                        label="Số điện thoại"
                                                        name="phoneNumber"
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        rules={[
                                                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                                                            { pattern: /^[0-9]+$/, message: 'Số điện thoại phải là số!' },
                                                            {
                                                                pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                                                                message: 'Số điện thoại không đúng định dạng!',
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="Nhập số điện thoại" />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ) : null}



                                    </Row>
                                    <Row gutter={16}>
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                label="Giá bán (VND)"
                                                name="price"
                                                labelCol={{ span: 24 }}
                                                wrapperCol={{ span: 24 }}
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập giá bán' },
                                                    {
                                                        pattern: /^[0-9]+$/,
                                                        message: 'Giá bán phải là số!',
                                                    },
                                                    {
                                                        validator: (_, value) => {
                                                            if (!value) {
                                                                return Promise.resolve();
                                                            }
                                                            if (value < 100000) {
                                                                return Promise.reject('Giá bán phải lớn hơn hoặc bằng 100.000!');
                                                            }
                                                            if (value > 150000000) {
                                                                return Promise.reject('Giá bán không được vượt quá 150.000.000!');
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                ]}

                                            >
                                                <Input
                                                    placeholder="Nhập giá bán"
                                                    value={inputPrice}
                                                    onChange={handleInputPrice}
                                                />
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    {/* Conditional Fields for Price and Service Fee */}
                                    {SelectedConsignmentType === '1' ? (
                                        <>





                                            {/* Display Entered Price */}
                                            <Row >
                                                {/* Price */}
                                                <div className=" mb-4 w-full">
                                                    <h3 className="font-bold">Giá đã nhập:</h3>
                                                    <div className="text-2xl flex justify-center text-center text-red-500">
                                                        {inputPrice > 0 ? formatVND(Number(inputPrice)) : '0 ₫'}
                                                    </div>
                                                </div>

                                            </Row>

                                            {/* Fourth Row: Service Fee */}
                                            <Row>
                                                <div className='w-full'>
                                                    <h3 className="font-bold">Chi phí (xem chi tiết):</h3>
                                                    <div className="text-2xl flex justify-center text-red-500">
                                                        {formatVND(serviceFee)}
                                                    </div>
                                                </div>

                                            </Row>
                                        </>
                                    ) :
                                        SelectedConsignmentType === '0' ?

                                            <>



                                                <Row >
                                                    {/* Price */}
                                                    <div className=" mb-4 w-full">
                                                        <h3 className="font-bold">Giá của cá:</h3>
                                                        <div className="text-2xl flex justify-center text-center text-red-500">
                                                            {inputPrice > 0 ? formatVND(Number(inputPrice)) : '0 ₫'}
                                                        </div>
                                                    </div>

                                                </Row>

                                                {/* Fourth Row: Service Fee */}
                                                <Row>
                                                    <div className='w-full'>
                                                        <h3 className="font-bold">Chi phí (xem chi tiết):</h3>
                                                        <div className="text-2xl flex justify-center text-red-500">
                                                            {formatVND(serviceFee)}
                                                        </div>
                                                    </div>

                                                </Row>
                                            </> : <></>
                                    }


                                </div>
                            </Col>
                        </Row>

                        {/* Consignment Information */}
                        <Row gutter={24} className="mt-6">

                        </Row>

                        {/* Submit Button */}
                        <div className='flex justify-center'>
                            <Row justify="center" className="mt-6">
                                <Col>
                                    <Button
                                        onClick={() => handleCurrentPage(currentPage)}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300"
                                    >
                                        Quay lại
                                    </Button>
                                </Col>
                            </Row>
                            <Row justify="center" className="mt-6">
                                <Col>
                                    <Form.Item>
                                        <Button
                                            className=" text-white px-6 bg-[#FA4444] py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300"
                                            type="primary" htmlType="submit">
                                            Nộp đơn
                                        </Button>
                                    </Form.Item>
                                    <LoadingModal isLoading={isLoading} />
                                </Col>
                            </Row>

                            {/* Back Button */}

                        </div>

                    </Form>


                </div >

            </div >
        </>
    )
}

export default RequestConsignment
