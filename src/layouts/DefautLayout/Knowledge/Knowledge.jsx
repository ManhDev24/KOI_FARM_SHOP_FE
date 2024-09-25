import { Button, Col, Flex, Row } from 'antd';
import React from 'react';
import './introduction.css';
import { Link } from 'react-router-dom';

const cardData = [
    {
        tag: 'Đang bán',
        imgSrc: 'img/SOWA.webp',
        title: 'SHOWA KOI',
        seller: 'Hoàng Tiến Đạt',
        gender: 'Koi cái',
        age: '2',
        size: '80cm',
        origin: 'Nhật Bổn',
        type: 'Cá Koi Showa',
        price: '300.000 đ'
    },
    {
        tag: 'Đang bán',
        imgSrc: 'img/SOWA.webp',
        title: 'SHOWA KOI',
        seller: 'Hoàng Tiến Đạt',
        gender: 'Koi cái',
        age: '2',
        size: '80cm',
        origin: 'Nhật Bổn',
        type: 'Cá Koi Showa',
        price: '300.000 đ'
    },
    {
        tag: 'Đang bán',
        imgSrc: 'img/SOWA.webp',
        title: 'SHOWA KOI',
        seller: 'Hoàng Tiến Đạt',
        gender: 'Koi cái',
        age: '2',
        size: '80cm',
        origin: 'Nhật Bổn',
        type: 'Cá Koi Showa',
        price: '300.000 đ'
    },
    {
        tag: 'Đang bán',
        imgSrc: 'img/SOWA.webp',
        title: 'SHOWA KOI',
        seller: 'Hoàng Tiến Đạt',
        gender: 'Koi cái',
        age: '2',
        size: '80cm',
        origin: 'Nhật Bổn',
        type: 'Cá Koi Showa',
        price: '300.000 đ'
    },
    {
        tag: 'Đang bán',
        imgSrc: 'img/SOWA.webp',
        title: 'SHOWA KOI',
        seller: 'Hoàng Tiến Đạt',
        gender: 'Koi cái',
        age: '2',
        size: '80cm',
        origin: 'Nhật Bổn',
        type: 'Cá Koi Showa',
        price: '300.000 đ'
    },
    {
        tag: 'Đang bán',
        imgSrc: 'img/SOWA.webp',
        title: 'SHOWA KOI',
        seller: 'Hoàng Tiến Đạt',
        gender: 'Koi cái',
        age: '2',
        size: '80cm',
        origin: 'Nhật Bổn',
        type: 'Cá Koi Showa',
        price: '300.000 đ'
    },

];

const Knowledge = () => {
    return (
        <>
            <Flex justify='center'>
                <div className='w-[950px] h-[50px] bg-white text-[36px] text-[#FA4444] text-center border border-3 border-[#FA4444] my-[80px]'>
                    <span className='h-[38px]' style={{ fontFamily: 'Merriweather, serif' }}>KIẾN THỨC CÁ KOI</span>
                </div>
            </Flex>

            {/* Image */}
            <Flex justify='center'>
                <img src="./img/asagiBanner.jpg" alt="" className='w-[2000px] h-[525px]' />
            </Flex>

            <div className='my-[80px] flex justify-center'>
                <Flex justify='center' horizontal className='grid w-[950px]' style={{ gridTemplateColumns: "repeat(3, minmax(auto, 1fr))" }}
                >
                    {cardData.map((card, index) => (
                        <Flex key={index} justify='center' vertical className='w-[250px] h-[645px] mx-10 mb-10 '>
                            {/* Tag */}
                            <Row>
                                <div className='absolute w-[86px] bg-[#FFFFFF] rounded-ee-[10px] 
                                rounded-tl-[5px] text-center text-[#FA4444]'>
                                    {card.tag}
                                </div>
                                <div className='rounded-[10px]'>
                                    <img src={card.imgSrc} className='w-[250px] h-[354px] rounded-t-[8px] box-border' alt="" />
                                </div>
                            </Row>
                            <Flex horizontal>
                                <Flex className='grid col-span-3'>
                                    <Row className='flex flex-col w-[250px] h-[290px] bg-[#FFFFFF] border border-t-0 border-x-2 border-b-2
                                     border-[#FA4444] rounded-b-[10px]'>
                                        <h1 className='my-0 mx-auto text-[#FA4444] font-bold text-[20px]'>
                                            {card.title}
                                        </h1>
                                        <div className='my-[10px] mx-[10px]'>
                                            <Flex align='flex-start' justify='space-around' vertical>
                                                <div className='h-7'>Người bán: {card.seller}</div>
                                                <div className='h-6'>Giới tính: {card.gender}</div>
                                                <div className='h-6'>Tuổi: {card.age}</div>
                                                <div className='h-6'>Kích thước: {card.size}</div>
                                                <div className='h-6'>Nguồn gốc: {card.origin}</div>
                                                <div className='h-6'>Giống: {card.type}</div>
                                            </Flex>
                                            <div align='center'>
                                                <div className='my-[10px] text-[20px] font-bold'>
                                                    {card.price}
                                                </div>

                                                <Link to="/product">
                                                    <Button className='w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]'>
                                                        Đặt Mua
                                                    </Button>
                                                </Link>

                                            </div>
                                        </div>
                                    </Row>
                                </Flex>
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            </div>
        </>
    );
}

export default Knowledge;
