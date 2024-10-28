import React, { useEffect, useState } from "react";
import {
  Steps,
  Button,
  Flex,
  Spin,
  Image,
  message,
  Card,
  Descriptions,
  Col,
  Row,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ConsignmentApi } from "../../apis/Consignment.api";
import {
  saveConsignmentID,
  saveFormData,
} from "../../Redux/Slices/consignmentID_Slice";
import { LoadingOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import CheckoutApi from "../../apis/Checkout.api";
import { saveTypePayment } from "../../Redux/Slices/Type_Slice";
import LoadingModal from "../Modal/LoadingModal";

const StatusConsignment = () => {
  const descriptions = [
    "Chính sách ký gửi",
    "Điền thông tin ký gửi",
    "Trạng thái duyệt đơn ký gửi",
    "Thanh toán",
    "Hoàn tất",
  ];

  const [currentPage, setCurrentPage] = useState(2);
  const [showDetails, setShowDetails] = useState(false);
  const consignmentID = useSelector((state) => state.consignment.consignmentID);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Centralized localStorage fetching logic
   // Centralized localStorage fetching logic
   // Centralized localStorage fetching logic
   useEffect(() => {
    const user = localStorage.getItem("user");
    if (!consignmentID) {
     
      const storedID = localStorage.getItem("consignmentID");
      if (storedID && !isNaN(storedID)) {
        dispatch(saveConsignmentID(Number(storedID))); // Convert to number
      }
    } else if(consignmentID && user) {
      localStorage.setItem("consignmentID", consignmentID);
    }
  }, [consignmentID, dispatch]);


  // Fetch consignment status

  //  const status = consignmentDetails.data.status === 4 ? 50000 : null;
  const { data: consignmentDetails, isLoading, error } = useQuery({
    queryKey: ['consignmentStatus', consignmentID],
    queryFn: () => ConsignmentApi.statusConsignment(consignmentID),
    enabled: !!consignmentID,
    
  });

  // Save service fee to store
  useEffect(() => {
    if (consignmentDetails?.data?.serviceFee) {
      dispatch(saveFormData(consignmentDetails.data.serviceFee));
    }
  }, [consignmentDetails, dispatch]);

  // Initial payment status
  useEffect(() => {
    const initialPaymentStatus = false;
    dispatch(saveTypePayment(initialPaymentStatus));
  }, [dispatch]);

  const consignmentIDs = localStorage.getItem("fishConsignmentID");

  // Cancel consignment mutation
  const { mutate: cancelConsignment, isPending: isCancelConsignment } =
    useMutation({
      mutationFn: async () => {
        let consignmentid = consignmentID || consignmentIDs;
        if (!consignmentid) {
          throw new Error("Consignment ID is not available.");
        }
        return await ConsignmentApi.cancelConsignment(consignmentid);
      },
      onSuccess: (response) => {
        if (typeof response.data === "number") {
          dispatch(saveConsignmentID(response.data));

        navigate('/Form-consignment');
        message.success('Hủy ký gửi thành công');


      } else {
        navigate('/Form-consignment')
        localStorage.setItem('consignmentID', '');
        localStorage.setItem('fishConsignmentID');
        message.success('Hủy ký gửi thành công');
      }
    },
    onError: (error) => {

    },
  });

  // Handle cancel button click
  const handleCancelClick = () => {
    localStorage.setItem('fishConsignmentID', '');
    localStorage.setItem('consignmentID', '');

    cancelConsignment();
  };

  const handleCurrentPage = (prevPage) => {
    localStorage.removeItem("fishConsignmentID")
    localStorage.removeItem("consignmentID")
    prevPage = 2;
    if (prevPage <= 2) {
      setCurrentPage((prevPage) => prevPage + 1);
      navigate("/Form-consignment");
    }
  };

  // Formatting service fee for payment
  const formatServiceFee = (fee) => {
    return typeof fee === "number" ? fee.toString() : String(fee);
  };

  // Handle order submission
  const handleOrder = () => {
    const serviceFee = formatServiceFee(consignmentDetails?.data?.serviceFee);
    handlePayOrderByVnPay(serviceFee);
  };

  const handleError = () => {
    toast.error("Vui lòng chờ duyệt đơn");
  };

  // Handle payment mutation
  const { mutate: handlePayOrderByVnPay, isPending: isVnPayLoading } =
    useMutation({
      mutationFn: (amount) => CheckoutApi.payByVnPay(amount, "NCB", false),
      onSuccess: (data) => {
        localStorage.setItem('typePayment','false');
        window.location.assign(data.data.paymentUrl);
      },
      onError: (error) => {
        message.error("Lỗi xảy ra khi thanh toán");
      },
    });

  // Show loading modal during any ongoing process
  if (isLoading || isVnPayLoading || isCancelConsignment) {
    return <LoadingModal isLoading={true} />;
  }

  if (error) {
    navigate("/Form-consignment");
    return null;
  }

  if (!consignmentDetails) {
    return null;
  }

  const { data } = consignmentDetails;
  const { koiFish } = data;
  return (
    <>
      <div className="w-full max-w-[950px] h-[89px] relative mx-auto p-4">
        <Steps
          current={currentPage}
          status={data.status === 1 ? "process" : "finish"}
        >
          {descriptions.map((desc, index) => (
            <Steps.Step key={index} title="&nbsp;" description={desc} />
          ))}
        </Steps>
      </div>

      <div className="form-container w-[950px] mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <Card className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Chi tiết ký gửi cá Koi
            </h1>
          </div>

          {/* Mã ký gửi và Trạng thái */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl font-bold text-gray-700">
              Mã ký gửi:{" "}
              <span className="text-[#FA4444]">#{data.consignmentID}</span>
            </p>
            <p
              className={`text-lg font-semibold ${data.status === 1 ? "text-blue-500" : "text-green-500"
                }`}
            >
              Trạng thái: {data.status === 1 ? "Đang duyệt" : "Đã duyệt"}
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
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Thông tin ký gửi
              </h2>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>
                  <strong className="font-semibold text-gray-800">
                    Ngày ký gửi:
                  </strong>{" "}
                  {moment(data.consignmentDate).format("DD/MM/YYYY")}
                </li>
                <li>
                  <strong className="font-semibold text-gray-800">
                    Loại ký gửi:
                  </strong>{" "}
                  {data.consignmentType ? "Bán" : "Chăm sóc"}
                </li>
                {/* <li><strong className="font-semibold text-gray-800">Ghi chú:</strong> {data.notes || 'Không có ghi chú'}</li> */}
                <li>
                  <strong className="font-semibold text-gray-800">
                    Email:
                  </strong>{" "}
                  {data.email}
                </li>
                <li>
                  <strong className="font-semibold text-gray-800">
                    Họ tên:
                  </strong>{" "}
                  {data.fullname}
                </li>
                <li>
                  <strong className="font-semibold text-gray-800">
                    Số điện thoại:
                  </strong>{" "}
                  {data.phoneNumber}
                </li>
                <li>
                  <strong className="font-semibold text-gray-800">
                    Thời hạn:
                  </strong>{" "}
                  {data.duration} tháng
                </li>
                <li>
                  <strong className="font-semibold text-gray-800">
                    Trực tuyến:
                  </strong>{" "}
                  {data.online ? "Trực tuyến" : "Trực tiếp"}
                </li>
                <li className="flex  items-center py-2 border-b border-gray-200">
                  <strong className="font-semibold  w-1/3 text-gray-900 text-lg">
                    Giá Koi:
                  </strong>
                  <span className="text-gray-600 w-full text-xl text-center">
                    {data.agreedPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </li>
                <li className="flex  items-center py-2 border-b border-gray-200">
                  <strong className="font-semibold w-1/3 text-gray-900 text-lg">
                    Chi phí:
                  </strong>
                  <span className="text-gray-600 w-full text-xl text-center">
                    {data.serviceFee.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
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
              {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
            </button>

            {/* Nút tới trang thanh toán */}
            {data.status === 1 ? (
              <>
                <button
                  onClick={handleCurrentPage}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300"
                >
                  Tạo mới
                </button>
                <button
                  onClick={handleCancelClick}
                  className="px-6 py-3 bg-[#FA4444] text-white rounded-md shadow hover:bg-blue-600 hover:shadow-lg transition duration-200"
                >
                  Hủy ký gửi
                </button>

                {/* <button
                  onClick={handleError}
                  className="px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 hover:shadow-lg transition duration-200"
                >
                  Thanh toán
                </button> */}
              </>
            ) : data.status === 4 ? (
              <>
                {/* <button
                  onClick={handleCurrentPages}
                  className="px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 hover:shadow-lg transition duration-200"
                >
                  Tới bước Thanh toán
                </button> */}
                <button
                  onClick={handleCurrentPage}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleCancelClick}
                  className="px-6 py-3 bg-[#FA4444] text-white rounded-md shadow hover:bg-blue-600 hover:shadow-lg transition duration-200"
                >
                  Hủy ký gửi
                </button>

                <button
                  onClick={() => {
                    handleOrder();
                  }}
                  className="px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 hover:shadow-lg transition duration-200"
                >
                  Thanh toán
                </button>
              </>
            ) :
              data.status === 2 ? (
                <>
                  {/* <button
                    onClick={handleCurrentPages}
                    className="px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 hover:shadow-lg transition duration-200"
                  >
                    Tới bước Thanh toán
                  </button> */}
                  <button
                    onClick={() => {
                      handleCancelClick();
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300"
                  >
                    Tạo mới
                  </button>
                </>

              )

                : null}
          </div>

          {/* Thông tin chi tiết cá Koi, được điều khiển bởi state showDetails */}
          {showDetails && (
            <div className="mt-8">
              <Card
                title="Thông tin chi tiết cá Koi"
                bordered={false}
                className="mb-4"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>ID:</strong> {koiFish.id}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Giới tính:</strong>{" "}
                      {koiFish.gender ? "Koi Đực" : "Koi Cái"}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Giống:</strong> {koiFish.category}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Tuổi:</strong> {koiFish.age} tuổi
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Kích thước:</strong> {koiFish.size} cm
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Tính cách:</strong>{" "}
                      {koiFish.personality || "Không có thông tin"}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Nguồn gốc:</strong> {koiFish.origin}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Thuần chủng:</strong>{" "}
                      {koiFish.purebred === 1 ? "Có" : "Không"}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Sức khỏe:</strong> {koiFish.health}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Nhiệt độ thích hợp:</strong> {koiFish.temperature}{" "}
                      °C
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Môi trường nước:</strong> {koiFish.water}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Thức ăn:</strong> {koiFish.food}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Độ pH:</strong> {koiFish.ph}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Giá thỏa thuận:</strong>{" "}
                      {koiFish.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </Col>
                </Row>
              </Card>

      {koiFish.certificate && (
        <Card title="Chứng nhận" bordered={false} className="mt-4">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <p>
                <strong>Tên chứng nhận:</strong>{" "}
                {koiFish.certificate.name}
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <p>
                <strong>Ngày cấp:</strong>{" "}
                {moment(koiFish.certificate.createdDate).format(
                  "DD/MM/YYYY"
                )}
              </p>
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
  )
}
        </Card >

  {/* return to create new */ }
      </div >
    </>
  );
};

export default StatusConsignment;
