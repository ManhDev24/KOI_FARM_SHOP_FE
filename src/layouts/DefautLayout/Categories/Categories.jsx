import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import required modules
import { Pagination } from 'swiper/modules';

const Categories = () => {
    return (
        <div>
            <div className="text-center my-[20px]">
                <h1 className="w-[950px] h-[50px] bg-white text-[36px] text-[#FA4444] border border-3 border-[#FA4444] inline-block text-center mt-0" style={{ fontFamily: 'Merriweather, serif' }}>
                    DANH MỤC CÁ KOI
                </h1>
            </div>
            <div className="my-[80px] w-[950px] mx-auto">
                <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="mySwiper"
                    loop={true}
                >
                    <SwiperSlide>
                        <img src="/img/bengoi.png" alt="Bengoi" className="w-[240px] h-[580px] mx-auto" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/SHUSUI.png" alt="Shusui" className="w-[240px] h-[580px] mx-auto" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/asagi.jpg" alt="Asagi" className="w-[240px] h-[580px] mx-auto" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/karashi.jpg" alt="Karashi" className="w-[240px] h-[580px] mx-auto" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/bengoi.png" alt="Bengoi" className="w-[240px] h-[580px] mx-auto" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/SHUSUI.png" alt="Shusui" className="w-[240px] h-[580px] mx-auto" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/asagi.jpg" alt="Asagi" className="w-[240px] h-[580px] mx-auto" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/karashi.jpg" alt="Karashi" className="w-[240px] h-[580px] mx-auto" />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    );
};

export default Categories;
