import { useMutation, useQuery } from '@tanstack/react-query';
import { Breadcrumb, Button, message, Table } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConsignmentApi } from '../../apis/Consignment.api';
import moment from 'moment';
import LoadingModal from '../Modal/LoadingModal';
import CheckoutApi from '../../apis/Checkout.api';
import { useDispatch } from 'react-redux';
import { saveConsignmentDetailID } from '../../Redux/Slices/consignmentDetail_Slice';

const ConsignmentHistoryDetail = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(200); // Default page size
    const user = localStorage.getItem('user');

    // Parse the user object from localStorage
    const acc = JSON.parse(user);
    const accountId = acc?.id;

    // Use `useQuery` to fetch the consignments
    const { data, isLoading, error } = useQuery({
        queryKey: ['consignments', currentPage, pageSize, accountId],
        queryFn: () => ConsignmentApi.getAllConsignment(currentPage, pageSize, accountId),
        keepPreviousData: true,
    });

    // Handle error case
    if (error) {
        message.error(error.message || 'An error occurred while fetching consignments');
    }
    const handleOrder = (amount) => {
        handlePayOrderByVnPay(amount);
    };

    const { mutate: handlePayOrderByVnPay, isPending: isVnPayLoading } = useMutation({
        mutationFn: (amount) => CheckoutApi.payByVnPay(amount, 'NCB', false),
        onSuccess: (data) => {
            window.location.assign(data.data.paymentUrl);
        },
        onError: (error) => {
            message.error('Lỗi xảy ra khi thanh toán');
        },
    });
    const dispatch = useDispatch();
    // Define table columns for Ant Design
    const columns = [
        {
            title: <span className='flex justify-center'>Mã đơn ký gửi</span>,
            dataIndex: 'consignmentID',
            key: 'consignmentID',
        },
        {
            title: <span className='flex justify-center'>Loại ký gửi</span>,
            dataIndex: 'consignmentType',
            key: 'consignmentType',
            render: (text) => (text ? 'Bán' : 'Chăm sóc'),
        },
        {
            title: <span className='flex justify-center'>Giá bán</span>,
            dataIndex: 'agreedPrice',
            key: 'agreedPrice',
            render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: <span className='flex justify-center'>Ngày tạo đơn</span>,
            dataIndex: 'consignmentDate',
            key: 'consignmentDate',
            render: (date) => moment(date).format('DD-MM-YYYY'),
        },
        {
            title: <span className='flex justify-center'>Gói ký gửi</span>,
            dataIndex: 'duration',
            key: 'duration',
            render: (duration) => (<><div className='border-2 border-[#FA4444] text-center p-2'>{duration + ' tháng'}</div></>),
        },
        {
            title: <span className='flex justify-center'>Phí dịch vụ</span>,
            dataIndex: 'serviceFee',
            key: 'serviceFee',
            render: (fee) => fee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: <span className='flex justify-center'>Trạng thái</span>,
            dataIndex: 'status',
            key: 'status',
            render: (status) => (status === 4 ? <span className='text-[#FFA500] flex justify-center'>Chờ thanh toán</span> : status === 1 ? <span className='text-[#FFD700] flex justify-center'>Đang duyệt</span> : status === 2 ? <span className='text-[#28A745] flex justify-center'>Đã duyệt</span> : status === 3 ? <span className='text-[#DC3545] flex justify-center'>Đơn ký gửi bị từ chối</span> : <span className='text-[#A9A9A9] flex justify-center'>Hết hạn</span>),
        },
        {
            title: '',
            dataIndex: 'status',
            key: 'action',
            render: (status, record) => (status === 4 ? <button onClick={() => {
                dispatch(saveConsignmentDetailID(record.consignmentID));
                localStorage.setItem('consignmentID',record.consignmentID)
                handleOrder(record.serviceFee);
               
            }
            }
                className="px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 hover:shadow-lg transition duration-200"
            >Thanh toán</button> : status === 1 ? '' : status === 2 ? '' : status === 3 ? <Button >Tạo mới</Button> : <Button className='flex justify-center'>Tạo mới</Button>),
        },
    ];

    return (
        <>
            <div>
                <div className="filter flex justify-center items-center mb-5">
                    <div style={{ backgroundColor: '#FFF8F8' }} className="w-[950px] h-[30px] flex items-center ps-3 ">
                        <Breadcrumb separator=">" className="flex justify-center items-center font-bold text-lg m-3">
                            <Breadcrumb.Item>
                                <Link to="/" style={{ color: '#EA4444' }}>Trang chủ</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link style={{ color: '#EA4444' }}>Lịch sử ký gửi</Link>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center my-10'>
                <h1 className=' mb-10'>Danh sách đơn ký gửi</h1>
                {isLoading ? (
                    <LoadingModal isLoading={isLoading} />
                ) : (
                    <Table className='flex justify-center'
                        dataSource={data?.data?.content || []}
                        columns={columns}
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
                            showTotal: (total, range) => `Đang có ${range[0]}-${range[1]} / ${total} `,  // Show total records
                        }}
                        rowKey="consignmentID"
                    />
                )}
            </div>
        </>
    );
};

export default ConsignmentHistoryDetail;
