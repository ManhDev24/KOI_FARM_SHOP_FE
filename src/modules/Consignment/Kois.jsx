import { Breadcrumb, ConfigProvider, Image, Table, Tabs, message, Spin, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import koi from '/img/tabicon.png';
import { ConsignmentApi } from '../../apis/Consignment.api';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import moment from 'moment';

const Kois = () => {
    const [selectedFishCare, setFishCare] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [fishDetails, setFishDetails] = useState({});

    const onChange = (key) => {
        console.log(key);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const id = user?.id;
        const allFishCare = async () => {
            try {
                const response = await ConsignmentApi.getAllHealthCareConsignmentForCustomer(id);
                console.log('Fetched fish care data:', response.data.koiFishReponseList);
                setFishCare(response.data.koiFishReponseList || []);
            } catch (error) {
                toast.error('Có lỗi xảy ra khi gọi API chăm sóc cá');
            }
        };

        allFishCare();
    }, []);

    const { mutate: handleFishDetail } = useMutation({
        mutationFn: (id) => ConsignmentApi.getAllHealthCareConsignmentForCustomerDetail(id),
        onSuccess: (data, variables) => {
            console.log('Fetched fish detail:', data.data);
            setFishDetails((prevDetails) => ({
                ...prevDetails,
                [variables]: data.data.healthcare || [],
            }));
        },
        onError: (error) => {
            message.error('Lỗi xảy ra khi lấy chi tiết chăm sóc cá');
        },
    });

    const items = [
        {
            key: '1',
            label: (
                <div className='flex justify-center items-center'>
                    <img src={koi} height={60} width={40} alt="" />
                    <span className='h-full flex'>Koi mua bán</span>
                </div>
            ),
            children: (
                <Table
                    dataSource={[
                        { key: '1', name: 'John', age: 30 },
                        { key: '2', name: 'Jane', age: 28 },
                    ]}
                    columns={[
                        { title: 'Name', dataIndex: 'name', key: 'name' },
                        { title: 'Age', dataIndex: 'age', key: 'age' },
                    ]}
                />
            ),
        },
        {
            key: '2',
            label: (
                <div className='flex justify-center items-center'>
                    <img src={koi} height={60} width={40} alt="" />
                    <span className='h-full flex'>Koi Chăm sóc</span>
                </div>
            ),
            children: (
                <Table
                    dataSource={selectedFishCare.map((fish) => ({
                        key: fish.id,
                        id: fish.id,
                        image: fish.koiImage || 'defaultImage.png',
                        name: fish.category || 'Unknown',
                        careEnvironment: fish.healthcare?.careEnvironment || 'N/A',
                        healthStatus: fish.healthcare?.healthStatus || 'N/A',
                        growthStatus: fish.healthcare?.growthStatus || 'N/A',
                        lastChecked: fish.healthcare?.date || 'N/A',
                    }))}
                    columns={[
                        { title: 'ID của cá', dataIndex: 'id', key: 'id' },
                        {
                            title: 'Hình ảnh',
                            dataIndex: 'image',
                            key: 'image',
                            render: (text, record) => (
                                <div className='flex flex-col'>
                                    <Image
                                        src={record.image}
                                        alt="Fish Image"
                                        width={50}
                                        height={80}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            ),
                        },
                        { title: 'Category', dataIndex: 'name', key: 'name' },
                        { title: 'Môi trường chăm sóc', dataIndex: 'careEnvironment', key: 'careEnvironment' },
                        { title: 'Tình trạng sức khỏe', dataIndex: 'healthStatus', key: 'healthStatus' },
                        { title: 'Trạng thái phát triển', dataIndex: 'growthStatus', key: 'growthStatus' },
                        { title: 'Lần kiểm tra cuối', dataIndex: 'lastChecked', key: 'lastChecked' },
                    ]}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: selectedFishCare.length,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50, 200],
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                    expandable={{
                        columnTitle: <span>Xem chi tiết lịch sử chăm sóc</span>,
                        columnWidth: 200,
                        expandedRowRender: (record) => {
                            const healthcareData = fishDetails[record.id];

                            if (!healthcareData) {
                                console.log(healthcareData)
                                return (
                                    <div className="flex justify-center items-center">
                                        <Spin tip="Loading..." />
                                    </div>
                                );
                            }

                            return (
                                <div>
                                    <h3 className='text-center font-bold'>Chi tiết Lịch sử chăm sóc cho cá {record.name} ID: {record.id} </h3>
                                    <Table
                                        columns={[
                                            { title: 'Tình trạng sức khỏe', dataIndex: 'healthStatus', key: 'healthStatus' },
                                            { title: 'Trạng thái phát triển', dataIndex: 'growthStatus', key: 'growthStatus' },
                                            { title: 'Môi trường chăm sóc', dataIndex: 'careEnvironment', key: 'careEnvironment' },
                                            { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
                                            {
                                                title: 'Ngày',
                                                dataIndex: 'date',
                                                key: 'date',
                                                sorter: (a, b) => {
                                                    if (a.date && b.date) {
                                                        return a.date.valueOf() - b.date.valueOf();
                                                    } else if (a.date) {
                                                        return -1;
                                                    } else if (b.date) {
                                                        return 1;
                                                    } else {
                                                        return 0;
                                                    }
                                                },
                                                render: (date) => {
                                                    return date ? date.format('HH:mm DD-MM-YYYY') : 'N/A';
                                                },
                                            },
                                            {
                                                title: 'Kiểm tra',
                                                dataIndex: 'checked',
                                                key: 'checked',
                                                render: (checked) => (checked ? 'Đã kiểm tra' : 'chưa kiểm tra'),
                                            },
                                        ]}
                                        dataSource={healthcareData.map((item, index) => {
                                            const dateObj = item.date ? moment(item.date, 'YYYY-MM-DD HH:mm:ss') : null;
                                            return {
                                                key: index,
                                                healthStatus: item.healthStatus || 'N/A',
                                                growthStatus: item.growthStatus || 'N/A',
                                                careEnvironment: item.careEnvironment || 'N/A',
                                                note: item.note || 'N/A',
                                                date: dateObj,
                                                checked: item.checked || false,
                                            };
                                        })}
                                        pagination={false}
                                        rowKey={(record) => record.key}
                                    />
                                </div>
                            );
                        },
                        onExpand: (expanded, record) => {
                            if (expanded && !fishDetails[record.id]) {
                                handleFishDetail(record.id);
                            }
                        },
                    }}
                />
            ),
        },
    ];

    return (
        <>
            <div className='flex flex-col items-center'>
                <Breadcrumb
                    separator=">"
                    className="flex justify-start font-bold text-lg m-3 w-[950px]"
                >
                    <Breadcrumb.Item>
                        <Link to="/" style={{ color: '#EA4444' }}>
                            Trang chủ
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link style={{ color: '#EA4444' }}>Koi ký gửi của tôi</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <ConfigProvider
                    theme={{
                        token: {},
                        components: {
                            Tabs: {
                                colorBgContainer: '#FA4444',
                                itemSelectedColor: '#FFFFFF',
                                itemColor: '#FA4444',
                                titleFontSize: 16,
                            },
                        },
                    }}
                >
                    <Tabs
                        className='w-[80vw] mb-[80px] mt-[20px] h-full'
                        defaultActiveKey="1"
                        items={items}
                        onChange={onChange}
                        type="card"
                    />
                </ConfigProvider>
            </div>
        </>
    );
};

export default Kois;
