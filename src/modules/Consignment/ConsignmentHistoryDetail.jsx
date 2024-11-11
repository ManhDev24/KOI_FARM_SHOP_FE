// ConsignmentHistoryDetail.jsx

import { useMutation, useQuery } from '@tanstack/react-query';
import { Breadcrumb, Button, message, Table, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConsignmentApi } from '../../apis/Consignment.api';
import moment from 'moment';
import LoadingModal from '../Modal/LoadingModal';
import CheckoutApi from '../../apis/Checkout.api';
import { useDispatch } from 'react-redux';
import { saveConsignmentDetailID } from '../../Redux/Slices/consignmentDetail_Slice';

const ConsignmentHistoryDetail = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Adjusted default page size
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState(null);
  


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      message.warning('Người dùng đang không đăng nhập. Vui lòng đăng nhập.');
      navigate('/'); 
    } else {
     
      setAccountId(user.id);
    }
  }, [navigate]);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['consignments', currentPage, pageSize, accountId],
    queryFn: () => ConsignmentApi.getAllConsignment(currentPage, pageSize, accountId),
    keepPreviousData: true,
    enabled: !!accountId, // Only run if accountId exists
  });

  // Handle error case
  if (error) {
    console.error('Error fetching consignments:', error);
    message.error(error.message || 'Đã xảy ra lỗi khi tải dữ liệu ký gửi');
  }

  const handleOrder = (amount) => {
    handlePayOrderByVnPay(amount);
  };

  const {
    mutate: handlePayOrderByVnPay,
    isLoading: isVnPayLoading,
  } = useMutation({
    mutationFn: (amount) => CheckoutApi.payByVnPay(amount, 'NCB', false),
    onSuccess: (data) => {
      window.location.assign(data.data.paymentUrl);
    },
    onError: (error) => {
      console.error('Error during payment:', error);
      message.error('Lỗi xảy ra khi thanh toán');
    },
  });

  const {
    mutate: cancelConsignment,
    isLoading: isCancelConsignment,
  } = useMutation({
    mutationFn: async (consignmentID) => {
      return await ConsignmentApi.cancelConsignment(consignmentID);
    },
    onSuccess: () => {
      message.success('Hủy ký gửi thành công');
      // Refresh the consignments data
      refetch();
    },
    onError: (error) => {
      console.error('Error during cancellation:', error);
      message.error('Lỗi xảy ra khi hủy ký gửi');
    },
  });

  // Handle cancel button click with confirmation
  const handleCancelClick = (id) => {
    Modal.confirm({
      title: 'Xác nhận hủy ký gửi',
      content: 'Bạn có chắc chắn muốn hủy đơn ký gửi này không?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        cancelConsignment(id);
      },
    });
  };

  // Constants for status codes
  const STATUS = {
    PENDING_PAYMENT: 4,
    PENDING_APPROVAL: 1,
    APPROVED: 2,
    REJECTED: 3,
    EXPIRED: 0,
  };

  // Define table columns for Ant Design
  const columns = [
    {
      title: <span className='flex justify-center'>Mã đơn ký gửi</span>,
      dataIndex: 'consignmentID',
      key: 'consignmentID',
      align: 'center'
    },
    {
      title: <span className='flex justify-center'>Loại ký gửi</span>,
      dataIndex: 'consignmentType',
      key: 'consignmentType',
      render: (text) => (text ? 'Bán' : 'Chăm sóc'),
      align: 'center'
    },
    {
      title: <span className='flex justify-center'>Giá bán</span>,
      dataIndex: 'agreedPrice',
      key: 'agreedPrice',
      render: (price) => {
        const amount = Number(price);
        return !isNaN(amount)
          ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
          : 'N/A';
      },
      align: 'center'
    },
    {
      title: <span className='flex justify-center'>Ngày tạo đơn</span>,
      dataIndex: 'consignmentDate',
      key: 'consignmentDate',
      render: (date) => moment(date).format('DD-MM-YYYY'),
      align: 'center'
    },
    {
      title: <span className='flex justify-center'>Gói ký gửi</span>,
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => {
        let color = '';
        if (duration <= 3) {
          color = 'green';
        } else if (duration <= 6) {
          color = 'orange';
        } else {
          color = 'red';
        }

        return (
          <div className=' text-center p-2'>
            <Tag color={color}>{duration + ' tháng'}</Tag>
          </div>
        );
      },
      align: 'center'
    },

    {
      title: <span className='flex justify-center'>Phí dịch vụ</span>,
      dataIndex: 'serviceFee',
      key: 'serviceFee',
      render: (fee) => {
        const amount = Number(fee);
        return !isNaN(amount)
          ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
          : 'N/A';
      },
      align: 'center'
    },
    {
      title: <span className='flex justify-center'>Trạng thái</span>,
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        switch (status) {
          case STATUS.PENDING_PAYMENT:
            return <span className='text-[#FFA500] flex justify-center'>Chờ thanh toán</span>;
          case STATUS.PENDING_APPROVAL:
            return <span className='text-[#FFD700] flex justify-center'>Đang duyệt</span>;
          case STATUS.APPROVED:
            return <span className='text-[#28A745] flex justify-center'>Đã duyệt</span>;
          case STATUS.REJECTED:
            return <span className='text-[#DC3545] flex justify-center'>Đơn ký gửi bị từ chối</span>;
          default:
            return <span className='text-[#A9A9A9] flex justify-center'>Hết hạn</span>;
        }
      },
      align: 'center'
    },
    {
      title: '',
      dataIndex: 'status',
      key: 'action',
      render: (status, record) => {
        const renderCancelButton = (consignmentID) => (
          <button
            onClick={() => handleCancelClick(consignmentID)}
            disabled={isCancelConsignment}
            className={`px-6 py-3 ${isCancelConsignment ? 'bg-gray-400' : 'bg-[#FA4444]'
              } text-white rounded-md shadow hover:shadow-lg transition duration-200 hover:bg-red-600`}
            aria-label='Hủy ký gửi'
          >
            {isCancelConsignment ? 'Đang xử lý...' : 'Hủy ký gửi'}
          </button>
        );

        switch (status) {
          case STATUS.PENDING_PAYMENT:
            return (
              <>
                <button
                  onClick={() => {
                    dispatch(saveConsignmentDetailID(record.consignmentID));
                    localStorage.setItem('consignmentID', record.consignmentID);
                    handleOrder(record.serviceFee);
                  }}
                  disabled={isVnPayLoading}
                  className={`px-6 py-3 ${isVnPayLoading ? 'bg-gray-400' : 'bg-green-500'
                    } text-white rounded-md shadow hover:shadow-lg transition duration-200 hover:bg-green-600`}
                  aria-label='Thanh toán'
                >
                  {isVnPayLoading ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
                {renderCancelButton(record.consignmentID)}
              </>
            );
          case STATUS.PENDING_APPROVAL:
            return <>{renderCancelButton(record.consignmentID)}</>;
          case STATUS.APPROVED:
            return null;
          case STATUS.REJECTED:
          case STATUS.EXPIRED:
          default:
            return (
              <Button
                className='flex justify-center'
                onClick={() => navigate('/Form-consignment')}
                aria-label='Tạo mới'
              >
                Tạo mới
              </Button>
            );
        }
      },
      align: 'center'
    },
  ];

  return (
    <>
      <div>
        <div className='filter flex justify-center items-center mb-5'>
          <div
            style={{ backgroundColor: '#FFF8F8' }}
            className='w-[950px] h-[30px] flex items-center ps-3 '
          >
            <Breadcrumb
              separator='>'
              className='flex justify-center items-center font-bold text-lg m-3'
            >
              <Breadcrumb.Item>
                <Link to='/' style={{ color: '#EA4444' }}>
                  Trang chủ
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span style={{ color: '#EA4444' }}>Lịch sử ký gửi</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center my-10'>
        <h1 className='mb-10'>Danh sách đơn ký gửi</h1>
        {isLoading ? (
          <LoadingModal isLoading={isLoading} />
        ) : (
          <Table
            className='flex justify-center h-full'
            dataSource={data?.data?.content || []}
            columns={columns}
            locale={{ emptyText: isLoading ? '' : 'Không có dữ liệu ký gửi' }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: data?.data?.totalElements || 0,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 200],
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
             
            }}
            rowKey='consignmentID'
          />
        )}
      </div>
    </>
  );
};

export default ConsignmentHistoryDetail;
