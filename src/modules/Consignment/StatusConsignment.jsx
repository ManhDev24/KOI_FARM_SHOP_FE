import React, { useEffect, useState } from 'react';
import { Steps, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ConsignmentApi } from '../../apis/Consignment.api';
import { saveConsignmentID, saveFormData } from '../../Redux/Slices/consignmentID_Slice';

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
        <div className="overflow-x-auto">
          {isLoading ? (
            <p>Loading consignment details...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error.message}</p>
          ) : consignmentDetails ? (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-200 text-left">
                  <th className="border border-gray-300 px-4 py-2">Field</th>
                  <th className="border border-gray-300 px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">Consignment ID</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {consignmentDetails.data.consignmentID}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Consignment Date</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {consignmentDetails.data.consignmentDate}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">Consignment Status</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {(consignmentDetails.data.status) === 1 ? "Chờ giải quyết" : (consignmentDetails.data.status) === 2 ? 'Đã duyệt' : (consignmentDetails.data.status) === 3 ? 'Từ chối' : (consignmentDetails.data.status) === 4 ? 'chờ thanh toán' : 'quán hạn 3 ngày'}
                  </td>
                </tr>

                <tr className="bg-blue-100">
                  <th colSpan="2" className="text-left px-4 py-2">
                    Koi Fish Data
                  </th>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Koi ID</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {consignmentDetails.data.koiFish.id}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">Origin</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {consignmentDetails.data.koiFish.origin}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Gender</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {consignmentDetails.data.koiFish.gender ? "Koi Cái" : "Koi Đực"}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Phí dịch vụ</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {consignmentDetails.data.serviceFee }
                  </td>
                </tr>
              </tbody>
            </table>
          ) : null}
        </div>
        {consignmentDetails?.data?.status === 1 ? <> </> : consignmentDetails?.data?.status === 4 ? <Button onClick={handleCurrentPages}>Tới bước Thanh toán</Button> : <></>}
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
