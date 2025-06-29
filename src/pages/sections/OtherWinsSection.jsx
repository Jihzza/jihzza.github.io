// src/pages/sections/OtherWinsSection.jsx

import React from 'react';

// --- COMPONENT IMPORTS ---
// We import our reusable components to keep this file clean and focused on layout.
import SectionTextBlack from '../../components/common/SectionTextBlack';
import ImageCarousel from '../../components/carousel/ImageCarousel';
import BodyTransformation from '../../assets/vids/BodyTransformation.mp4';

/**
 * A dedicated section to showcase "Other Wins".
 * This component structures the content, including a title, a video, a description,
 * and a final image carousel.
 */
export default function OtherWinsSection() {
    return (
        // The <section> tag is semantically correct for a new content block on the page.
        // `max-w-4xl` constrains the width for readability on large screens, and `mx-auto` centers it.
        <section className="max-w-4xl mx-auto py-8 text-black">

            {/* 1. SECTION TITLE & DESCRIPTION */}
            {/* We reuse the `SectionText` component for a consistent look and feel. */}
            <SectionTextBlack title="My Other Wins">
                69 days body transformation
            </SectionTextBlack>

            {/* 2. VIDEO PLAYER */}
            {/* This container centers the video and gives it a max-width to prevent it from becoming too large. */}
            <div className="flex justify-center items-center my-8">
                <div className="w-full flex justify-center items-center max-w-lg ">
                    <video
                        // The `key` helps React uniquely identify this element.
                        // I'm using a placeholder video; you should replace `src` with the path to your video file.
                        key="other-wins-video"
                        src={BodyTransformation}
                        // `autoPlay`, `loop`, and `muted` are best practices for background/autoplay videos.
                        autoPlay
                        loop
                        muted
                        // `playsInline` is crucial for autoplay on iOS devices.
                        playsInline
                        className="w-40 object-cover rounded-lg"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            {/* 3. SECONDARY DESCRIPTION */}
            {/* For the description-only part, we use a simple <p> tag styled to match the site's aesthetic.
                This is a clean approach that avoids modifying the existing `SectionText` component. */}
            <div className="w-full text-center py-4">
                <p className="text-black text-base max-w-2xl mx-auto">
                    High reach content
                </p>
            </div>

            {/* 4. IMAGE CAROUSEL */}
            {/* Here, we simply render the `ImageCarousel` component we created in the first step.
                Its self-contained logic handles all the complex carousel functionality. */}
            <ImageCarousel />

        </section>
    );
}