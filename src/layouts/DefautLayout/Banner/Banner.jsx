import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const banners = [
    "./img/5.png",
    "./img/6.webp",
];

const Banner = () => {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    const changeBanner = (index) => {
        setCurrentBannerIndex(index);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 3000);
        return () => clearInterval(intervalId);
    }, []);

    const scrollToSection = () => {
        document.getElementById('introduction').scrollIntoView({ behavior: 'smooth' });
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div
            style={{
                backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/koi-shop-3290e.appspot.com/o/Banner%2Fbeyond%20the%20other%20side.gif?alt=media&token=5b0cafea-8ca4-4fb3-be4c-b9db03fc7415')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(0.8)',
            }}
            className="relative flex items-center justify-center h-[90vh] text-white"
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <motion.div
                className="relative z-10 text-center max-w-lg flex flex-col items-center justify-center"
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.3 }}
            >
                <motion.h1
                    className="text-4xl md:text-5xl font-bold mb-4 whitespace-nowrap"
                    variants={textVariants}
                >
                    Koi Farm Shop – Hơn cả sự hài lòng
                </motion.h1>
                <motion.p
                    className="mb-6 text-left"
                    variants={textVariants}
                >
                    Koi Farm Shop là điểm đến của những người yêu cá Koi, nơi chúng tôi mang đến những chú Koi chất lượng nhất
                    với sự uy tín và tâm huyết. Chúng tôi cam kết mang lại sự hài lòng cao nhất cho khách hàng.
                </motion.p>
                <motion.button
                    onClick={scrollToSection}
                    className="bg-transparent border border-white px-6 py-2 rounded-full text-white hover:bg-white hover:text-black transition duration-300"
                    variants={textVariants}
                >
                    Tìm hiểu thêm về Koi Farm Shop
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Banner;
