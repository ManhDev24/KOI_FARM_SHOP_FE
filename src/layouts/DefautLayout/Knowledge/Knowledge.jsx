import { Button, Col, Flex, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import './introduction.css';
import { Link } from 'react-router-dom';
import FishApi from '../../../apis/Fish.api';

const Knowledge = () => {
    const [categoryResponses, setCategoryResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function để xử lý đường dẫn hình ảnh
    const getImageUrl = (imgPath) => {
        if (!imgPath) return "/img/default-banner.jpg"; // Ảnh mặc định nếu không có cateImg
        return imgPath.startsWith('http') ? imgPath : imgPath.replace('./', '/');
    };

    useEffect(() => {
        const fetchKoiFishData = async () => {
            try {
                const data = await FishApi.getKnowledgeFishList();
                console.log('Dữ liệu nhận được từ API:', data);

                // Sửa lỗi chính tả ở đây
                const categoryResponses = data.categoryReponses;
                console.log('categoryResponses:', categoryResponses);

                if (!Array.isArray(categoryResponses)) {
                    throw new Error('categoryReponses không phải là mảng');
                }

                setCategoryResponses(categoryResponses);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
                setError(error.message || "Đã xảy ra lỗi khi lấy danh mục.");
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
        return <div>Có lỗi xảy ra: {error}</div>;
    }

    return (
        <>
            {/* Tiêu đề */}
            <Row justify='center'>
                <div className='w-[950px] h-[50px] bg-white text-[36px] text-[#FA4444] text-center border border-3 border-[#FA4444] my-[80px]'>
                    <span className='h-[38px]' style={{ fontFamily: 'Merriweather, serif' }}>KIẾN THỨC CÁ KOI</span>
                </div>
            </Row>

            {/* Hiển thị từng danh mục với banner và danh sách cá Koi */}
            {categoryResponses.map((category, index) => (
                <div key={index}>
                    {/* Hình ảnh banner cho từng danh mục */}
                    <Row justify="center" style={{ marginBottom: '80px' }}>
                        <Col>
                            <img
                                src={getImageUrl(category.cateImg)}
                                alt={`Banner ${index}`}
                                className='w-[2000px] h-[525px]'
                            />
                        </Col>
                    </Row>

                    {/* Danh sách cá Koi trong danh mục */}
                    <Flex horizontal className='justify-center '>
                        <Row
                            gutter={[16, 16]}
                            justify="center"
                            className="w-[950px] grid grid-cols-3"
                        >
                            {category.koiFishList && category.koiFishList.length > 0 ? (
                                category.koiFishList.map((card) => (
                                    <Col
                                        key={card.id} // Sử dụng `id` làm key

                                        className="w-[250px] h-[645px] mx-10 mb-10"
                                    >
                                        {/* Nội dung của card */}
                                        <div className="relative w-[250px]">
                                            {/* Tag */}
                                            <div
                                                className="absolute w-[86px] 
                                                bg-[#FFFFFF] rounded-ee-[10px] 
                                                rounded-tl-[5px] text-center 
                                                text-[#FA4444]"
                                            >
                                                {card.status ? "Đang bán" : "Đã bán"}
                                            </div>
                                            {/* Hình ảnh cá Koi */}
                                            <div className="rounded-[10px]">
                                                <img
                                                    src={getImageUrl(card.koiImage)}
                                                    className='w-[250px] h-[354px] rounded-t-[8px] box-border'
                                                    alt={category.categoryName}
                                                    style={{ width: '250px' }}
                                                />
                                            </div>
                                        </div>
                                        {/* Thông tin cá Koi */}
                                        <div className="flex flex-col w-[250px] h-[290px] bg-[#FFFFFF] border border-t-0 border-x-2 border-b-2 border-[#FA4444] rounded-b-[10px]">
                                            <h1 className="my-0 mx-auto text-[#FA4444] font-bold text-[20px]">
                                                {category.categoryName}
                                            </h1>
                                            <div className="my-[10px] mx-[10px]">
                                                <div className="flex flex-col">
                                                    <div className="h-7">Người bán: {card.origin}</div>
                                                    <div className="h-6">Giới tính: {card.gender}</div>
                                                    <div className="h-6">Tuổi: {card.age}</div>
                                                    <div className="h-6">Kích thước: {card.size}cm</div>
                                                    <div className="h-6">Nguồn gốc: {card.origin}</div>
                                                    <div className="h-6">Giống: {card.type}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="my-[10px] text-[20px] font-bold">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(card.price)}
                                                    </div>

                                                    <Link to={`/product/${card.id}`}>
                                                        <Button className='w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]'>
                                                            Đặt Mua
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <p>Không có dữ liệu cá Koi trong danh mục này.</p>
                            )}
                        </Row>
                    </Flex>
                </div>
            ))}
        </>
    );
}

export default Knowledge;
