import { Breadcrumb, Tabs } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';

const Kois = () => {
    const onChange = (key) => {
        console.log(key);
    };
    const items = [
        {
            key: '1',
            label: 'Koi mua bán',
            children:
                <>
                    <div className='h-[50vh]'>

                    </div>
                </>,
        },
        {
            key: '2',
            label: 'Koi Chăm sóc',
            children:
                <>
                    <div className='h-[50vh]'>
                        <div className=''>
                            Thông báo
                        </div>

                        <div>
                            Koi của bạn
                        </div>
                    </div>


                </>,
        },

    ];
    return (
        <>
            <div className='flex items-center  flex-col w-[950px'>
                <Breadcrumb
                    separator=">"
                    className="flex justify-start font-bold text-lg m-3 w-[950px]"
                >
                    <Breadcrumb.Item>
                        <Link to="/" style={{ color: "#EA4444" }} className="">
                            Trang chủ
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link style={{ color: "#EA4444" }} className="">
                            Koi ký gửi của tôi
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Tabs className='w-[950px] mb-[80px]' defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
        </>
    )
}

export default Kois
