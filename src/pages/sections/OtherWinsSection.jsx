// src/pages/sections/OtherWinsSection.jsx

import React from 'react';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import ImageCarousel from '../../components/carousel/ImageCarousel';

export default function OtherWinsSection() {
    return (
        <section className="w-full mx-auto py-8 text-center">
            <SectionTextBlack title="Other Wins">
                I also have a successful track record on social media, especially on Twitter, where I've grown an audience of over 200,000 followers.
            </SectionTextBlack>

            {/* --- CHANGE: WRAP THE CAROUSEL IN THE .full-bleed DIV --- */}
            {/* The "Why": Just as we did with the testimonials, wrapping the ImageCarousel
                in this div applies the full-bleed CSS rule, allowing it to break out
                of the section's padding and span the full width of the viewport. */}
            <div className="full-bleed py-8">
                <ImageCarousel />
            </div>

        </section>
    );
}