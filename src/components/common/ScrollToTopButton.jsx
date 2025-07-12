// src/components/common/ScrollToTopButton.jsx

import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

/**
 * A button that appears when the user scrolls down and smoothly scrolls back to the top.
 * It now accepts a ref to the specific scrollable container element.
 */
export default function ScrollToTopButton({ scrollContainerRef }) { // 1. Accept the ref as a prop
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const container = scrollContainerRef?.current;

        if (!container) return; // Exit if the ref is not attached yet

        const toggleVisibility = () => {
            // 2. Check the container's scroll position, not the window's
            if (container.scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // 3. Attach the event listener to the container
        container.addEventListener('scroll', toggleVisibility);

        // 4. Cleanup function to remove the listener from the container
        return () => container.removeEventListener('scroll', toggleVisibility);

    }, [scrollContainerRef]); // Rerun the effect if the ref changes

    const scrollToTop = () => {
        // The scrollIntoView on 'page-top' will still work globally,
        // but it's more robust to scroll the container itself.
        scrollContainerRef?.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`
                fixed bottom-17 right-2 z-10
                w-10 h-10 rounded-full bg-black
                flex items-center justify-center
                shadow-lg transition-all duration-300
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}
            `}
            aria-label="Go to top"
        >
            <FaArrowUp className="w-5 h-5" style={{ color: '#BFA200' }} />
        </button>
    );
}