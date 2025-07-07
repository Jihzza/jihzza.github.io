// src/components/hero/WordCarousel.jsx

import React, { useRef, useState } from 'react';

const words =[
    'Money', 'Health', 'Relationships', 'Mindset', 'Social Media', 'Business',
];
const duplicateWords = [...words, ...words, ...words, ...words, ...words, ...words, ...words, ...words, ...words, ...words,];

/**
 * An infinite, draggable word carousel.
 * Uses a CSS animation for smooth, continuous scrolling and JS for drag functionality
 */
export default function WordCarousel() {
    // STATE & REFS
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // EVENTS HANDLERS FOR DRAGGING
    
    // Why: This function fires when the user first presses the mouse button or touches the screen
    // It records the initial state of the drag and pauses the CSS animation
    const handleDragStart = (e) => {
        if (!carouselRef.current) return;
        setIsDragging(true);
        // Determine start position for mouse or touch events
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        // Calculate the starting X-coordinate  relatice to the scrollable element
        setStartX(pageX - carouselRef.current.offsetLeft);
        // Store the initial scroll position
        setScrollLeft(carouselRef.current.scrollLeft);
        // Add a class to the element to pause the CSS animation via our stylesheet
        carouselRef.current.classList.add('is-dragging');
    };

    // Why: This function fires when the usr releases the mouse or lifts the finger
    // It signals the end of the drag and resumes the CSS animation
    const handleDragEnd = () => {
        if (!carouselRef.current) return;
        setIsDragging(false);
        // The animation is resumed by removing the class
        carouselRef.current.classList.remove('is-dragging');
    };

    // Why: This function calculates the carousel's new scroll position as the user drags
    const handleDragMove = (e) => {
        if (!isDragging || !carouselRef.current) return;
        e.preventDefault(); // Prevents unwanted default behaviors like text selection
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        // The current position of the cursor/finger
        const x = pageX - carouselRef.current.offsetLeft;
        // Calculate the distance moved from the start. The multiplies makes the drag feel more responsive
        const walk = (x - startX) * 2;
        // Update the scroll position of the carousel element
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    // RENDER LOGIC
    return (
        <div className="w-full flex justify-center py-6">
            <div
                className="w-[60%] overflow-x-auto cursor-grab active:cursor-grabbing word-carousel-container"
                ref={carouselRef}
                // Mouse Events
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                // Touch Events
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
            >
                <div className="word-carousel-track flex">
                    {duplicateWords.map((word, index) => (
                        <div key={index} className="flex-shrink-0 mx-8 text-lg text-white whitespace-nowrap">
                            {word}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}