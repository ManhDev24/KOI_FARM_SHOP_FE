import { Button, Col, Flex, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import './introduction.css';
import { Link } from 'react-router-dom';
import FishApi from '../../../apis/Fish.api';
import ComparisonModal from '../../../modules/Modal/ComparisonModal';
const Knowledge = () => {
    const [categoryResponses, setCategoryResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [selectedItems, setSelectedItems] = useState([]); // State to store the selected items for comparison

    // Lấy dữ liệu cá từ API
    useEffect(() => {
        const fetchKoiFishData = async () => {
            try {
                const data = await FishApi.getKnowledgeFishList();
                const categoryResponses = data.categoryReponses;
                if (!Array.isArray(categoryResponses)) {
                    throw new Error('categoryReponses không phải là mảng');
                }
                setCategoryResponses(categoryResponses);
            } catch (error) {
                setError(error.message || "Đã xảy ra lỗi khi lấy danh mục.");
            } finally {
                setLoading(false);
            }
        };

        fetchKoiFishData();
    }, []);

    // Thêm cá Koi vào danh sách so sánh
    const handleAddToCompare = (item) => {
        if (selectedItems.length < 2 && !selectedItems.some((i) => i.id === item.id)) {
            setSelectedItems([...selectedItems, item]); // Thêm item vào danh sách
        } else if (selectedItems.some((i) => i.id === item.id)) {
            alert("Item này đã được thêm vào so sánh.");
        } else {
            alert("Bạn chỉ có thể so sánh tối đa 2 items.");
        }
    };

    // Xóa cá khỏi danh sách so sánh
    const removeItemFromCompare = (itemToRemove) => {
        const updatedItems = selectedItems.filter((item) => item.id !== itemToRemove.id);
        setSelectedItems(updatedItems);
    };

    // Mở modal so sánh
    const handleCompare = () => {
        if (selectedItems.length > 0) {
            setIsModalOpen(true);
        } else {
            alert("Vui lòng chọn ít nhất 1 cá để so sánh.");
        }
    };

    // Đóng modal
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Xử lý đường dẫn hình ảnh
    const getImageUrl = (imgPath) => {
        if (!imgPath) return "/img/default-banner.jpg"; // Ảnh mặc định nếu không có cateImg
        return imgPath.startsWith('http') ? imgPath : imgPath.replace('./', '/');
    };

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Có lỗi xảy ra: {error}</div>;
    }

    return (
        <>

            <Row justify='center'>
                <div className='w-[950px] h-[50px] bg-white text-[36px] text-[#FA4444] text-center border border-3 border-[#FA4444] my-[80px]'>
                    <span className='h-[38px]' style={{ fontFamily: 'Merriweather, serif' }}>KIẾN THỨC CÁ KOI</span>
                </div>
            </Row>



            {/* Comparison Modal */}
            < ComparisonModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                selectedItems={selectedItems}
                removeItem={removeItemFromCompare}
            />
            <div className='group relative' >
                <Button
                    onClick={handleCompare}
                    className="bg-[#FA4444] text-white fixed z-50 overflow-hidden left-[200px] top-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    Xem So Sánh ({selectedItems.length}) Cá Koi
                </Button>
                {/* Hiển thị từng danh mục với banner và danh sách cá Koi */}
                {categoryResponses.map((category, index) => (
                    <div key={index}>
                        <Row justify="center" style={{ marginBottom: '80px' }}>
                            <Col>
                                <img
                                    src={getImageUrl(category.cateImg)}
                                    alt={`Banner ${index}`}
                                    className='w-[2000px] h-[525px]'
                                />
                            </Col>
                        </Row>
                       
                        <Flex horizontal className='justify-center '>
                            <Row
                                gutter={[16, 16]}
                                justify="center"
                                className="w-[950px] grid grid-cols-3"
                            >
                                {category.koiFishList && category.koiFishList.length > 0 ? (
                                    category.koiFishList.map((card) => (
                                        <Col
                                            key={card.id}
                                            className="w-[250px] h-[645px] mx-10 mb-10"
                                        >
                                            <div className="relative w-[250px]">
                                                <div
                                                    className="absolute w-[86px] 
                                                bg-[#FFFFFF] rounded-ee-[10px] 
                                                rounded-tl-[5px] text-center 
                                                text-[#FA4444]"
                                                >
                                                    {card.status ? "Đang bán" : "Đã bán"}
                                                </div>
                                                <div className="rounded-[10px]">
                                                    <img
                                                        src={getImageUrl(card.koiImage)}
                                                        className='w-[250px] h-[354px] rounded-t-[8px] box-border'
                                                        alt={category.categoryName}
                                                    />
                                                </div>
                                            </div>
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
                                                        <div className="h-6">Giống: {card.category}</div>
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
                                                        <div className=' relative top-[-629px] left-[130px]' onClick={() => handleAddToCompare(card)}>
                                                            <Button className=' !p-0 !py-1 w-[100px] !border-0 h-fit hover:!border-[#FA4444] border-[#null]    hover:!text-[#FA4444] flex justify-around'>

                                                                <div className='flex justify-center items-center     ' >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className='flex' viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4z" /></g></svg>   <h5 className='mx-1 my-0 !text-center'>
                                                                        So sánh
                                                                    </h5>
                                                                </div>
                                                            </Button>

                                                        </div>
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

                {/* Trigger compare modal */}
            </div>
        </>
    );
}

export default Knowledge;
