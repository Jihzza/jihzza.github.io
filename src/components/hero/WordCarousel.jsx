// src/components/hero/WordCarousel.jsx

import React, { useRef,useState, useEffect } from 'react';

// COMPONENT DATA
// A list of words to be displayed in the carousel.
// By defining it outside, we prevent it from being recreated on every render.
const words = [
    'Money',
    'Health',
    'Relationships',
    'Mindset',
    'Social Media',
    'Business',
];

// To create a seamless loop, we duplicate the words. The animation will reset
// once the first set of words has passed, giving the illusion of an infinite scroll.
const duplicatedWords = [...words, ...words];

/**
 * An infinite, draggable word carousel.
 * Uses a CSS animatino for smooth, continuous scrolling and JS for drag functionality.
 * This component is self-contained and manages its own state and logic
 */
export default function WordCarousel() {
    // STATE & REFS
    const carouselRef = useRef(null); // A ref to access the DOM elemtn of the carousel for direct manipulation
    const [isDragging, setIsDragging] = useState(false); // Tracks if the user is currently dragging.
    const [startX, setStartX] = useState(0); // The initial horizontal position when draggin starts
    const [scrollLeft, setScrollLeft] = useState(0); // The horizontal scroll position of the carousel

    // EVENT HANDLERS FOR DRAGGING
    // When the user first clicks or touches the carousel
    const handleMouseDown = (e) => {
        setIsDragging(true);
        // For touch events, we use `e.touches[0].pageX`. For mouse, `e.pageX`
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        setStartX(pageX - carouselRef.current.scrollLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
        // We add a class to temporarily stop the CSS animation during the drag.
        carouselRef.current.calssList.add('is-dragging');
    };

    // When the user moves their mouse or finger holding down
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        const x = pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2; // The "* 2" multiplier makes the drag feel more responsive.
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    // When the user releases the mouse button or lifts their finger
    const handleMouseUp = () => {
        setIsDragging(false);
        // The animation is resumed by removing the class
        carouselRef.current.classList.remove('is-dragging');
    };

    // RENDER LOGIC
    return (
        <div className="w-full flex justify-center py-6">
            {/* This is the main container for the carousel
             - `w-[70%]`: Sets the width to 70% of the parent
             - `overflow-hidden`: Hides the parts of the list that are outside this container
             - `cursor-grab`: Changes the mouse cursor to indicate it's draggable
            */}
            <div
                className="w-[70%] overflow-hidden cursor-grab
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                "
            >
                {/* We add a custom CSS class `word-carousel-trackk` to apply the animation */}
                <div className="word-carousel-track flex">
                    {duplicatedWords.map((word, index) => (
                        // each word is a flex item. 'flex-shrink-0' preventss them from shrinking.
                        <div key={index} className="flex-shrink-0 mx-2 text-base text-white">
                            {word}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}