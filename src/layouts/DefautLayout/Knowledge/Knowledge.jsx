import { Button, Col, Flex, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import './introduction.css';
import { Link } from 'react-router-dom';
import FishApi from '../../../apis/Fish.api';


const Knowledge = () => {
    const [koiFishList, setKoiFishList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bannerImageUrl, setBannerImageUrl] = useState('./img/asagiBanner.jpg');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKoiFishData = async () => {
            try {
                const data = await FishApi.getKnowledgeFishList();
                // Dữ liệu từ API đã được trả về trong `data`

                const categoryResponses = data.categoryReponses;

                let allKoiFish = [];
                categoryResponses.forEach(category => {
                    if (category.koiFishList && category.koiFishList.length > 0) {
                        // Thêm thông tin danh mục vào mỗi cá koi
                        const koiFishWithCategory = category.koiFishList.map(fish => ({
                            ...fish,
                            categoryName: category.categoryName,
                            categoryDescription: category.description,
                            categoryImage: category.cateImg
                        }));
                        allKoiFish = allKoiFish.concat(koiFishWithCategory);
                    }
                });
                setKoiFishList(allKoiFish);
                if (categoryResponses.length > 0 && categoryResponses[0].cateImg) {
                    // Nếu 'cateImg' là đường dẫn tương đối, thêm URL cơ sở
                    const baseUrl = 'http://localhost:8080/images/'; // Thay thế bằng URL cơ sở của bạn
                    const fullBannerImageUrl = `${baseUrl}${categoryResponses[0].cateImg}`;
                    setBannerImageUrl(fullBannerImageUrl);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchKoiFishData();
    }, []);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Có lỗi xảy ra: {error.message}</div>;
    }

    return (
        <>
            <Flex justify='center'>
                <div className='w-[950px] h-[50px] bg-white text-[36px] text-[#FA4444] text-center border border-3 border-[#FA4444] my-[80px]'>
                    <span className='h-[38px]' style={{ fontFamily: 'Merriweather, serif' }}>KIẾN THỨC CÁ KOI</span>
                </div>
            </Flex>

            {/* Hình ảnh banner */}
            <Flex justify='center'>
                <img src={bannerImageUrl} alt="Banner" className='w-[2000px] h-[525px]' />
            </Flex>

            <div className='my-[80px] flex justify-center'>
                <Flex justify='center' horizontal className='grid w-[950px]' style={{ gridTemplateColumns: "repeat(3, minmax(auto, 1fr))" }}>
                    {koiFishList.map((fish, index) => (
                        <Flex key={index} justify='center' vertical className='w-[250px] h-[645px] mx-10 mb-10 '>
                            {/* Thẻ trạng thái */}
                            <Row>
                                <div className='absolute w-[86px] bg-[#FFFFFF] rounded-ee-[10px] rounded-tl-[5px] text-center text-[#FA4444]'>
                                    {fish.status === 1 ? 'Đang bán' : 'Hết hàng'}
                                </div>
                                <div className='rounded-[10px]'>
                                    <img src={fish.koiImage || '.img/SOWA.webp'} className='w-[250px] h-[354px] rounded-t-[8px] box-border' alt="" />
                                </div>
                            </Row>
                            <Flex horizontal>
                                <Flex className='grid col-span-3'>
                                    <Row className='flex flex-col w-[250px] h-[290px] bg-[#FFFFFF] border border-t-0 border-x-2 border-b-2 border-[#FA4444] rounded-b-[10px]'>
                                        <h1 className='my-0 mx-auto text-[#FA4444] font-bold text-[20px]'>
                                            {fish.categoryName}
                                        </h1>
                                        <div className='my-[10px] mx-[10px]'>
                                            <Flex align='flex-start' justify='space-around' vertical>
                                                <div className='h-7'>Nguồn gốc: {fish.origin}</div>
                                                <div className='h-6'>Giới tính: {fish.gender}</div>
                                                <div className='h-6'>Tuổi: {fish.age}</div>
                                                <div className='h-6'>Kích thước: {fish.size} cm</div>
                                                <div className='h-6'>Tính cách: {fish.personality}</div>
                                                <div className='h-6'>Giống: {fish.categoryName}</div>
                                            </Flex>
                                            <div align='center'>
                                                <div className='my-[10px] text-[20px] font-bold'>
                                                    {fish.price.toLocaleString()} đ
                                                </div>

                                                <Link to={`/product/${fish.id}`}>
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
