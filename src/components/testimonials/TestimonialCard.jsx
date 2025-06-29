// src/components/testimonials/TestimonialCard.jsx

// This is a presentational component for displaying a single testimonial, styled to match the provided design.
// It receives all the data it needs via props.

import React from 'react';

/**
 * @param {object} testimonial - The testimonial object containing name, content, and imageUrl.
 */
export default function TestimonialCard({ testimonial }) {
    const { name, content, image_url } = testimonial;

    return (
        // The main card container with a white background, rounded corners, padding, and a flex column layout.
        // `h-full` ensures that all cards in the carousel have the same height.
        <div className="bg-white text-black rounded-lg p-6 flex flex-col items-center text-center h-full shadow-lg">

            {/* Author's Image Container */}
            {/* The image is placed at the top, centered, and styled as a circle. */}
            <div className="w-24 h-24 mb-4">
                {image_url && (
                    <img
                        src={image_url}
                        alt={name}
                        // The image is circular, covers its container, and has a border.
                        className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                    />
                )}
            </div>

            {/* Testimonial Content */}
            {/* The `flex-grow` class allows this section to expand and fill available space,
                pushing the author's name to the bottom. */}
            <p className="text-gray-700 italic text-lg flex-grow mb-4">"{content}"</p>

            {/* Author's Name */}
            {/* The author's name is bolded and positioned at the bottom of the card. */}
            <p className="font-bold text-gray-900 self-end mt-auto">- {name}</p>
        </div>
    );
}