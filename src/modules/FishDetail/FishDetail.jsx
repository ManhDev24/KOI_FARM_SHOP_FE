import React, { useState, useEffect } from 'react';

// Fake data for demonstration purposes
const fakeFishData = [
  { id: 1, imageUrl: "./img/showa2.jpg", name: "Fish 1", gender: "Male", age: 2, size: "Medium", origin: "Japan" },
  { id: 2, imageUrl: "./img/showa2.jpg", name: "Fish 2", gender: "Female", age: 1, size: "Small", origin: "USA" },{ id: 2, imageUrl: "./img/showa2.jpg", name: "Fish 2", gender: "Female", age: 1, size: "Small", origin: "USA" },
  { id: 2, imageUrl: "./img/showa2.jpg", name: "Fish 2", gender: "Female", age: 1, size: "Small", origin: "USA" },{ id: 2, imageUrl: "./img/showa2.jpg", name: "Fish 2", gender: "Female", age: 1, size: "Small", origin: "USA" },
  // ... add more fish with relevant details
];

const FishDetail = () => {
  const [fishData, setFishData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current first image index
  const [selectedFish, setSelectedFish] = useState(null); // Track the selected fish
  const itemsVisible = 6; // Number of images visible at once

  useEffect(() => {
    // Simulate API call to fetch data
    setFishData(fakeFishData);
    setSelectedFish(fakeFishData[0]); // Set the first fish as default
  }, []);

  // Handle moving to the next image
  const handleNextImage = () => {
    if (currentIndex < fishData.length - itemsVisible) {
      setCurrentIndex(currentIndex + 1); // Shift forward by one image
    }
  };

  // Handle moving to the previous image
  const handlePreviousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Shift backward by one image
    }
  };

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
            <div className="overflow-hidden w-[650px] my-4">
              <div
                className="flex flex-row transition-transform duration-300"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsVisible)}%)`,
                }}
              >
                {/* Render the images */}
                {fishData.map((fish, index) => (
                  <div key={fish.id} className="ms-4 last:mx-4">
                    <img
                      src={fish.imageUrl}
                      className={`h-[120px] w-[90px] transition-transform duration-300 cursor-pointer ${
                        fish.id === selectedFish?.id ? 'scale-125' : ''
                      }`}
                      alt={fish.name}
                      onClick={() => setSelectedFish(fish)}
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
                  currentIndex >= fishData.length - itemsVisible ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleNextImage}
                disabled={currentIndex >= fishData.length - itemsVisible}
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
