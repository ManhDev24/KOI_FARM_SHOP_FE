import React, { useEffect, useState } from 'react';
import { Steps, Button, Flex, Spin, Image, message, Card, Descriptions, Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ConsignmentApi } from '../../apis/Consignment.api';
import { saveConsignmentID, saveFormData } from '../../Redux/Slices/consignmentID_Slice';
import { LoadingOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';

const StatusConsignment = () => {
  const descriptions = [
    'Chính sách ký gửi',
    'Điền thông tin ký gửi',
    'Trạng thái duyệt đơn ký gửi',
    'Thanh toán',
    'Hoàn tất',
  ];

  const [currentPage, setCurrentPage] = useState(2);
  const consignmentID = useSelector((state) => state.consignment.consignmentID);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    if (consignmentID) {
      localStorage.setItem('consignmentID', consignmentID);
    }
  }, [consignmentID]);

  useEffect(() => {
    if (!consignmentID) {
      const storedID = localStorage.getItem('consignmentID');
      if (storedID) {
        dispatch(saveConsignmentID(storedID));
      }
    }
  }, [consignmentID, dispatch]);


  const { data: consignmentDetails, isLoading, error } = useQuery({
    queryKey: ['consignmentStatus', consignmentID],
    queryFn: () => ConsignmentApi.statusConsignment(consignmentID),
    enabled: !!consignmentID,
  });
  useEffect(() => {
    if (consignmentDetails?.data?.serviceFee) {
      console.log(consignmentDetails.data.serviceFee)
      dispatch(saveFormData(consignmentDetails.data.serviceFee));

    }
  }, [consignmentDetails, dispatch]);

  const handleCurrentPage = (prevPage) => {
    prevPage = 2;
    if (prevPage <= 2) {
      setCurrentPage(prevPage => prevPage + 1);
      navigate('/Form-consignment');
    }
  };
  const handleCurrentPages = (prevPage) => {
    prevPage = 2;
    if (prevPage <= 2) {
      setCurrentPage(prevPage => prevPage + 1);
      console.log();
      navigate(`/servicefee-consignment`);
    }
  };
  const handleError = () => {

    toast.error('Vui lòng chờ duyệt đơn');
  };
  if (!consignmentDetails) {
    return null;
  }

  const { data } = consignmentDetails;
  const { koiFish } = data;

  return (
    <>
      <div className="w-full max-w-[950px] h-[89px] relative mx-auto p-4">
        <Steps current={currentPage}>
          {descriptions.map((desc, index) => (
            <Steps.Step key={index} title={`Step ${index + 1}`} description={desc} />
          ))}
        </Steps>
      </div>

      <div className="form-container w-[950px] mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <Card className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Chi tiết ký gửi cá Koi</h1>
          </div>

          {/* Mã ký gửi và Trạng thái */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl font-bold text-gray-700">
              Mã ký gửi: <span className="text-[#FA4444]">#{data.consignmentID}</span>
            </p>
            {console.log(data.status)}
            <p className={`text-lg font-semibold ${data.status === 1 ? 'text-blue-500' : 'text-green-500'}`}>
              Trạng thái: {data.status === 1 ? 'Đang duyệt' : 'Đã duyệt'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Thông tin ký gửi */}
            <div className="flex justify-center items-center">
              <Image
                src={koiFish.koiImage}
                height={476}
                alt="Hình ảnh cá Koi"
                className="rounded-lg shadow-lg object-contain  border border-gray-300"
              />
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Thông tin ký gửi</h2>
              <ul className="space-y-2 text-lg text-gray-700">
                <li><strong className="font-semibold text-gray-800">Ngày ký gửi:</strong> {moment(data.consignmentDate).format('DD/MM/YYYY')}</li>
                <li><strong className="font-semibold text-gray-800">Loại ký gửi:</strong> {data.consignmentType ? 'Bán' : 'Chăm sóc'}</li>
                {/* <li><strong className="font-semibold text-gray-800">Ghi chú:</strong> {data.notes || 'Không có ghi chú'}</li> */}
                <li><strong className="font-semibold text-gray-800">Email:</strong> {data.email}</li>
                <li><strong className="font-semibold text-gray-800">Họ tên:</strong> {data.fullname}</li>
                <li><strong className="font-semibold text-gray-800">Số điện thoại:</strong> {data.phoneNumber}</li>
                <li><strong className="font-semibold text-gray-800">Thời hạn:</strong> {data.duration} tháng</li>
                <li><strong className="font-semibold text-gray-800">Trực tuyến:</strong> {data.online ? 'Trực tuyến' : 'Trực tiếp'}</li>
                <li className="flex  items-center py-2 border-b border-gray-200">
                  <strong className="font-semibold  w-1/3 text-gray-900 text-lg">Giá Koi:</strong>
                  <span className="text-gray-600 w-full text-xl text-center">{data.agreedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </li>
                <li className="flex  items-center py-2 border-b border-gray-200">
                  <strong className="font-semibold w-1/3 text-gray-900 text-lg">Chi phí:</strong>
                  <span className="text-gray-600 w-full text-xl text-center">{data.serviceFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </li>



              </ul>
            </div>

            {/* Hình ảnh cá Koi */}

          </div>

          {/* Nút hành động */}
          <div className="flex justify-center space-x-4 mt-6">
            {/* Nút xem chi tiết */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-gray-300 hover:text-gray-900 hover:shadow-lg transition duration-200"
            >
              {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
            </button>

            {/* Nút tới trang thanh toán */}
            {data.status === 1 ? (
              <button
                onClick={handleError}
                className="px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 hover:shadow-lg transition duration-200"
              >
                Tới trang Thanh toán
              </button>
            ) : data.status === 4 ? (
              <button
                onClick={handleCurrentPages}
                className="px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 hover:shadow-lg transition duration-200"
              >
                Tới bước Thanh toán
              </button>
            ) : null}
          </div>

          {/* Thông tin chi tiết cá Koi, được điều khiển bởi state showDetails */}
          {showDetails && (
            <div className="mt-8">
              <Card title="Thông tin chi tiết cá Koi" bordered={false} className="mb-4">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <p><strong>ID:</strong> {koiFish.id}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Giới tính:</strong> {koiFish.gender ? 'Koi Đực' : 'Koi Cái'}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Giống:</strong> {koiFish.category}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Tuổi:</strong> {koiFish.age} tuổi</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Kích thước:</strong> {koiFish.size} cm</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Tính cách:</strong> {koiFish.personality || 'Không có thông tin'}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Nguồn gốc:</strong> {koiFish.origin}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Thuần chủng:</strong> {koiFish.purebred === 1 ? 'Có' : 'Không'}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Sức khỏe:</strong> {koiFish.health}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Nhiệt độ thích hợp:</strong> {koiFish.temperature} °C</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Môi trường nước:</strong> {koiFish.water}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Thức ăn:</strong> {koiFish.food}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Độ pH:</strong> {koiFish.ph}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p><strong>Giá thỏa thuận:</strong> {koiFish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  </Col>
                </Row>
              </Card>

              {koiFish.certificate && (
                <Card title="Chứng nhận" bordered={false} className="mt-4">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <p><strong>Tên chứng nhận:</strong> {koiFish.certificate.name}</p>
                    </Col>
                    <Col xs={24} sm={12}>
                      <p><strong>Ngày cấp:</strong> {moment(koiFish.certificate.createdDate).format('DD/MM/YYYY')}</p>
                    </Col>
                    <Col xs={24}>
                      <Image
                        width={300}
                        src={koiFish.certificate.image}
                        alt="Hình ảnh chứng nhận"
                        className="rounded-lg shadow-lg"
                      />
                    </Col>
                  </Row>
                </Card>
              )}
            </div>
          )}

        </Card>







        <div className="text-center mt-8">
          <button
            onClick={handleCurrentPage}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300"
          >
            Quay lại
          </button>
        </div>
      </div>
    </>
  );
};

export default StatusConsignment;
