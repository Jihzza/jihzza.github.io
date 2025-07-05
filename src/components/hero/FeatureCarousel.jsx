// src/components/hero/FeatureCarousel.jsx

import React from 'react';
import BaseCarousel from '../carousel/BaseCarousel';

// COMPONENT DATA
// An array of objects, each representing a slide in the carousel
const features = [
    { title: '$140K+ / year', subtitle: 'revenue for my company' },
    { title: 'Top 1% Earner', subtitle: 'on OnlyFans Worldwide'},
    { title: '200K+', subtitle: 'followers on Onlyfans'},
    { title: '69 days', subtitle: 'complete body transformation'},
    { title: '4 Countries', subtitle: 'lived in multiple nations'},
    { title: 'Addiction', subtitle: 'beat it on my own'},
    { title: 'Depression', subtitle: 'overcame by myself without medicine'},
    { title: '6+ Languages', subtitle: 'fluent in multiple languages'},
    { title: '100K+', subtitle: 'content reaching 100\'s of thousands'},
    { title: 'Miss Portugal', subtitle: 'managed the 2019/2020 champion'},
    { title: '$10+ Monthly', subtitle: 'helped clients achieve financial freedom'},
    { title: '+10 years', subtitle: 'of stock market experience'},
    { title: 'Thousands of stocks', subtitle: 'researched through fundamental analysis'},
    { title: '8 years', subtitle: 'in a stable long-term relationship'},
    { title: '0 to 60k+', subtitle: 'grew clients on multiple platforms'},
    { title: '10\'s of thousands', subtitle: 'of hours researching fundamental topics'},
    { title: 'Age 13', subtitle: 'website reached 60K+ users'},
];

/**
 * A carousel component using Swiper.js to showcase features
 * COnfigured to show one main slide in the center and partial slides on the sides
 */

export default function FeatureCarousel() {
    // --- 1. DEFINE CAROUSEL-SPECIFIC CONFIGURATION ---
    const swiperConfig = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 50,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            modifier: 2.5,
            slideShadows: false,
        },
    };

    // --- 2. DEFINE THE RENDER FUNCTION ---
    // The "Why": Here we define the unique JSX for a feature slide (the colored box).
    const renderFeatureSlide = (feature, index) => (
        <div className="bg-[#333333] px-4 py-2 space-y-2 justify-center items-center flex flex-col rounded-lg text-center h-full">
            <h3 className="font-bold text-white text-lg">{feature.title}</h3>
            <p className="text-white">{feature.subtitle}</p>
        </div>
    );

    // --- 3. RENDER THE BASE CAROUSEL ---
    return (
        <div className="full-bleed py-8">
            <BaseCarousel
                items={features}
                renderItem={renderFeatureSlide}
                swiperConfig={swiperConfig}
                containerClassName="feature-swiper"
                // The `swiper-slide-custom` class is defined in index.css to handle the slide width
                slideClassName="swiper-slide-custom"
            />
        </div>
    );
}