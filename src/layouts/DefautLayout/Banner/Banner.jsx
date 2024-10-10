import React, { useState, useEffect } from 'react';


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

    return (
        <div className='relative flex justify-center'>
        
            <img
                src={banners[currentBannerIndex]}
                alt={`Banner ${currentBannerIndex + 1}`}
                className=" w-[2000px] h-[75vh] object-cover"
            />
            
        
            <nav aria-label="Paging" className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => changeBanner(index)}
                        className={`px-4 py-[2px]  ${currentBannerIndex === index ? 'bg-red-600 text-white' : 'bg-[#FFFFFF] text-white'}`}
                    >
                       
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Banner;
