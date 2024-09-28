import React from 'react'

const HoverTOCompare = () => {
    
    return (
        <div>
            <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded m-4"
                onClick={() => setIsModalOpen(true)}
            >
                Compare Items
            </button>

            {/* Comparison Modal */}
            <ComparisonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item1={item1}
                item2={item2}
            />
        </div>
    )
}

export default HoverTOCompare
