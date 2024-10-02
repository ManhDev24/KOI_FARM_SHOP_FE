import React, { useState, useEffect } from 'react';

// Corrected fakeFishData with unique IDs
const fakeFishData = [
  { id: 1, imageUrl: "./img/showa2.jpg", name: "Fish 1", gender: "Male", age: 2, size: "Medium", origin: "Japan" },
  { id: 2, imageUrl: "./img/showa2.jpg", name: "Fish 2", gender: "Female", age: 1, size: "Small", origin: "USA" },
  { id: 3, imageUrl: "./img/showa2.jpg", name: "Fish 3", gender: "Male", age: 3, size: "Large", origin: "China" },
  { id: 4, imageUrl: "./img/showa2.jpg", name: "Fish 4", gender: "Female", age: 2, size: "Medium", origin: "Germany" },
  { id: 5, imageUrl: "./img/showa2.jpg", name: "Fish 5", gender: "Male", age: 4, size: "Large", origin: "Brazil" },
  { id: 6, imageUrl: "./img/showa2.jpg", name: "Fish 6", gender: "Female", age: 2, size: "Medium", origin: "Australia" },
  { id: 7, imageUrl: "./img/showa2.jpg", name: "Fish 7", gender: "Male", age: 1, size: "Small", origin: "Canada" },
  { id: 8, imageUrl: "./img/showa2.jpg", name: "Fish 8", gender: "Female", age: 3, size: "Large", origin: "UK" },
  // ... add more fish with unique IDs and relevant details
];

const FishDetail = () => {
  const [fishData, setFishData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Active image index
  const itemsVisible = 6; // Number of images visible at once

  useEffect(() => {
    // Simulate API call to fetch data
    setFishData(fakeFishData);
  }, []);

  // Handle moving to the next image
  const handleNextImage = () => {
    if (currentIndex < fishData.length - 1) {
      setCurrentIndex(currentIndex + 1); // Move to the next image
    }
  };

  // Handle moving to the previous image
  const handlePreviousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Move to the previous image
    }
  };

  // Calculate the total width to translate
  const getTranslateX = () => {
    const itemWidth = 90; // Width of each thumbnail image
    const itemMargin = 16; // Margin between images (adjust if necessary)
    const totalItemWidth = itemWidth + itemMargin;
    // Adjust translation to keep the active image at the start
    return -(currentIndex * totalItemWidth);
  };

  const selectedFish = fishData[currentIndex]; // The active fish is the one at currentIndex

  return (
    <div className="flex justify-center">
      <div className="flex w-[950px] flex-col">
        {/* Detail section of the selected fish */}
        {selectedFish && (
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <div className="flex justify-center">
                <img
                  src={selectedFish.imageUrl}
                  className="w-[200px] h-[300px]"
                  alt={selectedFish.name}
                />
              </div>
            </div>
            <div className="col-span-2">
              <div>{selectedFish.name}</div>
              <div>Giới tính: {selectedFish.gender}</div>
              <div>Tuổi: {selectedFish.age}</div>
              <div>Kích thước: {selectedFish.size}</div>
              <div>Nguồn gốc: {selectedFish.origin}</div>
            </div>
          </div>
        )}

        {/* Thumbnail Carousel */}
        <div className="flex justify-start mt-5 ms-14">
          <div className="border-2 border-[#FA4444]">
            <div className="overflow-hidden w-[850px] my-4">
              <div
                className="flex transition-transform duration-300"
                style={{
                  transform: `translateX(${getTranslateX()}px)`,
                }}
              >
                {/* Render the images */}
                {fishData.map((fish, index) => (
                  <div key={fish.id} className="mr-4 last:mr-0">
                    <img
                      src={fish.imageUrl}
                      className={`h-[120px] w-[90px] transition-transform duration-300 ${
                        index === currentIndex ? 'scale-125' : ''
                      }`}
                      alt={fish.name}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <button
                className={`px-4 py-2 bg-blue-500 text-white rounded ${
                  currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handlePreviousImage}
                disabled={currentIndex === 0}
              >
                Previous
              </button>
              <button
                className={`px-4 py-2 bg-blue-500 text-white rounded ${
                  currentIndex >= fishData.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleNextImage}
                disabled={currentIndex >= fishData.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FishDetail;
