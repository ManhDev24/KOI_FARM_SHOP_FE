import { Breadcrumb, ConfigProvider, Image, Table, Tabs, message, Spin, DatePicker, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import koi from '/img/tabicon.png';
import { ConsignmentApi } from '../../apis/Consignment.api';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import moment from 'moment';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

const Kois = () => {
    const [selectedFishCare, setFishCare] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedFishSize, setFishCares] = useState([]);
    const [currentPages, setCurrentPages] = useState(1);
    const [pageSizes, setPageSizes] = useState(10);
    const [fishDetails, setFishDetails] = useState({});
    const [selectedFishSell, setFishSell] = useState([]);
    // Koi Care
    const [fishCareList, setFishCareList] = useState([]);
    const [fishCareData, setFishCareData] = useState({});
    const [currentPageCare, setCurrentPageCare] = useState(1);
    const [pageSizeCare, setPageSizeCare] = useState(10);

    // Koi Sell
    const [fishSellList, setFishSellList] = useState([]);
    const [fishSellData, setFishSellData] = useState({});
    const [currentPageSell, setCurrentPageSell] = useState(1);
    const [pageSizeSell, setPageSizeSell] = useState(10);
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
          message.warning('Người dùng đang không đăng nhập. Vui lòng đăng nhập.');
          navigate('/'); // Redirect to home page
        } 
      }, [navigate]);
    const onChange = (key) => {
    };
    // Fetch Koi Care Data
    useEffect(() => {
        const fetchFishCareData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const id = user?.id;

            try {
                const response = await ConsignmentApi.getAllHealthCareConsignmentForCustomer(id, currentPageCare, pageSizeCare);
                setFishCareList(response.data.content || []);
                setFishCareData(response.data);
            } catch (error) {
                
            }
        };
        fetchFishCareData();
    }, [currentPageCare, pageSizeCare]);

    // Fetch Koi Sell Data
    useEffect(() => {
        const fetchFishSellData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const id = user?.id;
            try {

                const response = await ConsignmentApi.getAllSellConsignmentForCustomer(id, currentPageSell, pageSizeSell);
                console.log(response, 'rep')
                setFishSellList(response.data.content || []);
                setFishSellData(response.data);
            } catch (error) {
               
            }
        };
        fetchFishSellData();
    }, [currentPageSell, pageSizeSell]);

    const { mutate: handleFishDetail } = useMutation({
        mutationFn: (id) => ConsignmentApi.getAllHealthCareConsignmentForCustomerDetail(id),
        onSuccess: (data, variables) => {
            setFishDetails((prevDetails) => ({
                ...prevDetails,
                [variables]: data.data.healthcare || [],
            }));
        },
        onError: (error) => {
            message.error('Lỗi xảy ra khi lấy chi tiết chăm sóc cá');
        },
    });


    // console.log(selectedFishCare)
    const dataSource2 = selectedFishCare.map((item) => item.healthcare);

    // const mergedDataSource = dataSource1.map(item1 => {
    //     const matchingItem = dataSource2.find(item2 => item2.id === item1.id);
    //     return {
    //         ...item1,
    //         ...matchingItem
    //     };
    // });
    // console.log(mergedDataSource + ' merger datasource');

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
                    locale={{
                        triggerDesc: 'Sắp xếp giảm dần',
                        triggerAsc: 'Sắp xếp tăng dần',
                        cancelSort: 'Hủy sắp xếp'
                    }}
                    dataSource={fishSellList.map((fishSell) => ({
                        key: fishSell.consignmentID,
                        consignmentID: fishSell.consignmentID,
                        id: fishSell.koiFish.id,
                        category: fishSell.koiFish.category,
                        image: fishSell.koiFish.koiImage,
                        gender: fishSell.gender,
                        status: fishSell.koiFish.status,
                        price: fishSell.koiFish.price,
                        serviceFee: fishSell.serviceFee,
                        dayRemain: fishSell.remainingDays
                    }))}
                    columns={[
                        {
                            title: 'Mã ký gửi',
                            dataIndex: 'consignmentID',
                            key: 'id',
                            sorter: (a, b) => a.id - b.id,
                            width: '120px',
                            align: 'center'
                        },
                        {
                            title: 'Mã Koi',
                            dataIndex: 'id',
                            key: 'id',
                            sorter: (a, b) => a.id - b.id,
                            width: '120px',
                            align: 'center'
                        },
                        {
                            title: 'Danh mục',
                            dataIndex: 'category',
                            key: 'category',
                            align: 'center'
                        },
                        {
                            title: 'Ảnh',
                            dataIndex: 'category',
                            key: 'category',
                            render: (text, record) => (

                                <>

                                    <div className=''>
                                        <Image
                                            src={record.image}
                                            alt="Fish Image"
                                            width={50}
                                            height={80}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </>
                            ),
                            align: 'center'
                        },
                        {
                            title: 'Trạng thái',
                            key: 'status',
                            dataIndex: 'status',
                            render: (_, record) => (
                                <>

                                    {record.status === 3 ?
                                        < Tag color={'green'} key={record.status}>
                                            {'Đang bán'.toUpperCase()}
                                        </Tag> : < Tag color={'volcano'} key={record.status}>
                                            {'Đã bán'.toUpperCase()}
                                        </Tag>}
                                </>
                            ),
                            align: 'center',
                        },
                        {
                            title: 'Giá bán',
                            dataIndex: 'price',
                            key: 'price',
                            render: (price) => {
                                return price ? `${price.toLocaleString()} đ` : 'Đang cập nhật';
                            },
                            align: 'center',
                            sorter: (a, b) => a.id - b.id,


                        },
                        {
                            title: 'Giá dịch vụ',
                            dataIndex: 'serviceFee',
                            key: 'serviceFee',
                            render: (price) => {
                                return price ? `${price.toLocaleString()} đ` : 'Đang cập nhật';
                            },
                            align: 'center',
                            sorter: (a, b) => a.id - b.id,


                        },
                        {
                            title: 'Ngày ký gửi còn lại',
                            dataIndex: 'dayRemain',
                            key: 'dayRemain',
                            align: 'center',
                        },
                    ]}
                    pagination={{
                        current: currentPageSell,
                        pageSize: pageSizeSell,
                        total: fishSellData?.totalElements,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50, 200],
                        onChange: (page, size) => {
                            setCurrentPageSell(page);
                            setPageSizeSell(size);
                        },
                    }}
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
                    locale={{
                        triggerDesc: 'Sắp xếp giảm dần',
                        triggerAsc: 'Sắp xếp tăng dần',
                        cancelSort: 'Hủy sắp xếp'
                    }}
                    dataSource={fishCareList.map((fish) => ({
                        key: fish.id,
                        consignmentID: fish.consignmentID,
                        id: fish.koiFish.id,
                        image: fish.koiFish.koiImage || 'defaultImage.png',
                        name: fish.koiFish.category || 'Unknown',
                        careEnvironment: fish.koiFish.healthcare?.careEnvironment || 'Đang cập nhật',
                        healthStatus: fish.koiFish.healthcare?.healthStatus || 'Đang cập nhật',
                        growthStatus: fish.koiFish.healthcare?.growthStatus || 'Đang cập nhật',
                        dayRemain: fish.koiFish.healthcare?.dayRemain || 'Đang cập nhật',
                        grow: fish.koiFish.healthcare?.growthStatus - fish.koiFish.healthcare?.lastGrowth,

                    }))}
                    columns={[
                        {
                            title: 'Mã ký gửi',
                            dataIndex: 'consignmentID',
                            key: 'consignmentID',
                            sorter: (a, b) => a.id - b.id,
                            width: '120px',
                            align: 'center'
                        },
                        {
                            title: 'ID của cá',
                            dataIndex: 'id',
                            key: 'id',
                            sorter: (a, b) => a.id - b.id,
                            width: '120px',
                            align: 'center'
                        },
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
                            align: 'center',
                            width: '120px',
                        },
                        {
                            title: 'Danh mục',
                            dataIndex: 'name',
                            key: 'name',
                            width: '120px',
                            align: 'center',
                        },
                        {
                            title: 'Trạng thái môi trường chăm sóc mới nhất ',
                            dataIndex: 'careEnvironment',
                            key: 'careEnvironment',
                            align: 'center',
                            width: '120px',
                        },
                        {
                            title: 'Tình trạng sức khỏe mới nhất',
                            dataIndex: 'healthStatus',
                            key: 'healthStatus',
                            align: 'center',
                            width: '120px',
                        },
                        {
                            title: 'Trạng thái kích thước mới nhất',
                            dataIndex: 'growthStatus',
                            key: 'growthStatus',
                            align: 'center',
                            render: (text, record) => {
                                // Check if growthStatus is a valid number
                                const growthStatus = parseFloat(record.growthStatus);
                                return !isNaN(growthStatus)
                                    ? growthStatus.toFixed(2) + ' cm'
                                    : 'Đang cập nhật'; // Display 'Đang cập nhật' if growthStatus is not a valid number
                            },
                            width: '120px',
                        },


                        {
                            title: 'Kích thước tăng trưởng',
                            dataIndex: 'grow',
                            key: 'grow',
                            render: (_, record, index) => {



                                return (
                                    <>

                                        {record.grow > 0 ? (
                                            <> {record.grow}  <CaretUpOutlined style={{ fontSize: '16px', color: 'green' }} /></>

                                        ) : record.grow === 0 ? (
                                            <>Đang cập nhật</>
                                        ) : (
                                            <>{record.grow}  <CaretDownOutlined style={{ fontSize: '16px', color: 'red' }} /></>
                                        )}
                                    </>

                                );
                            },
                            align: 'center',
                            width: '120px',
                        },

                        {
                            title: 'Ngày ký gửi còn lại',
                            dataIndex: 'dayRemain',
                            key: 'dayRemain',
                            align: 'center',
                            width: '120px',
                        },

                    ]}
                    pagination={{
                        current: currentPageCare,
                        pageSize: pageSizeCare,
                        total: fishCareData?.totalElements,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50, 200],
                        onChange: (page, size) => {
                            setCurrentPageCare(page);
                            setPageSizeCare(size);
                        },
                    }}

                    expandable={{
                        expandIconColumnIndex: 10,
                        columnTitle: <span>Xem chi tiết lịch sử chăm sóc</span>,
                        columnWidth: 200,
                        expandedRowRender: (record) => {
                            const healthcareData = fishDetails[record.id];

                            if (!healthcareData) {
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
                                        locale={{
                                            triggerDesc: 'Sắp xếp giảm dần',
                                            triggerAsc: 'Sắp xếp tăng dần',
                                            cancelSort: 'Hủy sắp xếp'
                                        }}
                                        columns={[
                                            {
                                                title: 'Tình trạng sức khỏe',
                                                dataIndex: 'healthStatus',
                                                key: 'healthStatus',
                                                align: 'center'
                                            },
                                            {
                                                title: 'Kích thước phát triển',
                                                dataIndex: 'growthStatus',
                                                key: 'growthStatus',
                                                align: 'center',
                                                render: (_, record) => {
                                                    return record.growthStatus.toFixed(2) + ' cm';

                                                }
                                            },
                                            {
                                                title: 'Chênh lệch kích thước phát triển',
                                                dataIndex: 'growthStatusDifference',
                                                key: 'growthStatusDifference',
                                                render: (_, record, index) => {
                                                    if (index === healthcareData.length - 1) {
                                                        return 0; // Last record, no next record to compare with
                                                    }
                                                    const nextGrowthStatus = healthcareData[index + 1].growthStatus;
                                                    const currentGrowthStatus = record.growthStatus;
                                                    const differences = currentGrowthStatus - nextGrowthStatus;
                                                    const difference = parseFloat(differences.toFixed(2));
                                                    return (
                                                        <>
                                                            {difference}{" "}
                                                            {difference > 0 ? (
                                                                <CaretUpOutlined style={{ fontSize: '16px', color: 'green' }} />
                                                            ) : (
                                                                <CaretDownOutlined style={{ fontSize: '16px', color: 'red' }} />
                                                            )}
                                                        </>
                                                    );
                                                },

                                                align: 'center'
                                            }
                                            ,
                                            {
                                                title: 'Môi trường chăm sóc',
                                                dataIndex: 'careEnvironment',
                                                key: 'careEnvironment',
                                                align: 'center'

                                            },
                                            {
                                                title: 'Ghi chú',
                                                dataIndex: 'note',
                                                key: 'note',
                                                align: 'center'
                                            },
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
                                                    return date ? date.format('HH:mm DD-MM-YYYY') : 'Đang cập nhật';
                                                },
                                                align: 'center'

                                            },


                                            {
                                                title: 'Ngày ký gửi còn lại',
                                                dataIndex: 'dayRemain',
                                                key: 'dayRemain',
                                                align: 'center'
                                            },

                                        ]}
                                        dataSource={healthcareData.map((item, index) => {
                                            const dateObj = item.date ? moment(item.date, 'YYYY-MM-DD HH:mm:ss') : null;
                                            return {
                                                key: index,
                                                healthStatus: item.healthStatus || record.healthStatus,
                                                growthStatus: item.growthStatus || record.growthStatus,
                                                careEnvironment: item.careEnvironment || record.careEnvironment,
                                                note: item.note || 'Đang cập nhật',
                                                date: dateObj,
                                                dayRemain: item.dayRemain,

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
