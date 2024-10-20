import { useQuery } from '@tanstack/react-query';
import { Breadcrumb, message, Spin, Table } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConsignmentApi } from '../../apis/Consignment.api';
import moment from 'moment';

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

    const totalPages = Math.ceil(data?.data?.totalElements / pageSize) || 0;
    // Handle error case
    if (error) {
        message.error(error.message || 'An error occurred while fetching consignments');
    }

    // Define table columns for Ant Design
    const columns = [
        {
            title: 'Consignment ID',
            dataIndex: 'consignmentID',
            key: 'consignmentID',
        },
        {
            title: 'Consignment Type',
            dataIndex: 'consignmentType',
            key: 'consignmentType',
            render: (text) => (text ? 'Bán' : 'Chăm sóc'),
        },
        {
            title: 'Agreed Price',
            dataIndex: 'agreedPrice',
            key: 'agreedPrice',
            render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Consignment Date',
            dataIndex: 'consignmentDate',
            key: 'consignmentDate',
            render: (date) => moment(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Service Fee',
            dataIndex: 'serviceFee',
            key: 'serviceFee',
            render: (fee) => fee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (status === 4 ? 'Đã duyệt' : 'Đang duyệt'),
        },
    ];

    return (
        <>
            <div>
                <div className="filter flex justify-center items-center  mb-5">
                    <div
                        style={{ backgroundColor: '#FFF8F8' }}
                        className="w-[950px] h-[30px] flex items-center ps-3 "
                    >
                        <Breadcrumb
                            separator=">"
                            className="flex justify-center items-center font-bold text-lg m-3"
                        >
                            <Breadcrumb.Item>
                                <Link to="/" style={{ color: '#EA4444' }} className="">
                                    Trang chủ
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link style={{ color: '#EA4444' }} className="">
                                    Lịch sử ký gửi
                                </Link>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
            <div style={{ padding: '20px' }}>
                <h1>Consignment List</h1>
                {isLoading ? (
                    <Spin />
                ) : (
                    <>
                        <Table
                            dataSource={data?.data?.content || []}  // Ensure this contains the records for the current page
                            columns={columns}
                            pagination={{
                                current: currentPage,  // Current page number
                                pageSize: pageSize,  // Number of items per page
                                total: data?.data?.totalElements || 0,  // Total number of records from the API
                                showSizeChanger: true,  // Allow changing the page size
                                pageSizeOptions: [5, 10, 20, 50],  // Available page size options
                                showQuickJumper: true,  // Allow jumping to a specific page
                                onChange: (page, size) => {
                                    setCurrentPage(page);  // Update the current page number when the user navigates
                                    setPageSize(size);  // Update the page size if the user changes it
                                },
                                showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,  // Show total records
                            }}
                            rowKey="consignmentID"
                        />

                    </>
                )}
            </div>
        </>
    );
};

export default ConsignmentHistoryDetail;
