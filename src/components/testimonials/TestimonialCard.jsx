// src/components/testimonials/TestimonialCard.jsx
import React from 'react';
import OctagonAvatar from '../common/OctagonAvatar'; // ← NEW

export default function TestimonialCard({ testimonial }) {
  const { name, content, image_url } = testimonial;
  const MAX_CHARACTERS = 110;

  const truncatedContent = content.length > MAX_CHARACTERS
    ? `${content.substring(0, MAX_CHARACTERS)}...`
    : content;

  return (
    <div className="bg-white text-black rounded-lg p-6 flex flex-col items-center justify-center text-center h-full md:h-85 lg:h-75 shadow-lg">
      <div className="w-24 h-24 mb-4 flex items-center justify-center lg:w-20 lg:h-20">
        {image_url && (
          <OctagonAvatar
            src={image_url}
            alt={name}
            size={96}          // ~ w-24 / h-24
            ringWidth={4}
            gap={4}
            ringColor="#BFA200" // gray-200, matches old border
          />
        )}
      </div>

      {/* use the truncated text to keep cards even */}
      <p className="text-gray-700 italic text-lg flex-grow md:text-xl lg:text-lg">"{truncatedContent}"</p>

      <p className="font-bold text-gray-900 self-end mt-auto md:text-lg">- {name}</p>
    </div>
  );
}
