import React, { useEffect, useState } from 'react';
import { ChevronUpIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';

const MessengerAndTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility of the Move to Top button based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (



        <>
            {/* Messenger Chat Button */}
            <div className="fixed z-50 bottom-20 right-4 flex items-center bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors px-4 py-2 group">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                <a
                    href="https://m.me/474541192407946"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white ml-2 hidden group-hover:inline"
                >
                    Trò chuyện với chúng tôi trên Messenger
                </a>
            </div>

            {/* Move to Top Button */}
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed z-50 bottom-4 right-4 flex items-center bg-gray-600 text-white font-medium rounded-2xl     hover:bg-gray-700 transition-colors px-4 py-2 group"
                >
                    <ChevronUpIcon className="w-5 h-5" />
                    <span className="ml-2 hidden group-hover:inline">Quay lại đầu trang</span>
                </button>
            )}
        </>



    );
};

export default MessengerAndTopButton;
