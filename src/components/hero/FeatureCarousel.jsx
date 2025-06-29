// src/components/hero/FeatureCarousel.jsx

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';

// SWIPER STYLES
// It's crucial to import the base styles for Swiper to function correctly
import 'swiper/css';
import 'swiper/css/effect-coverflow';

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
    return (
        <div className="py-8">
            <Swiper 
                // SWIPER CONFIG
                modules={[Autoplay, EffectCoverflow]} // Register the modules we'll use
                effect={'coverflow'} // Use the Coverflow effect for a 3d-like aooearance
                grabCursor={true} // Visual effect to shows the grab cursor
                centeredSlides={true} // Ensures the active slide is alwaus in the cetner
                loop={true} // Enables infinite looping
                slidesPerView={'auto'} // Crucial for showing partial slides. Swiper calculates the number based on slide width
                // Configuration for the Coverflow effect
                spaceBetween={50}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    modifier: 2.5,
                    slideShadows: false,
                }}
                // Configuration for autoplay
                autoplay={{
                    deplay: 2500, // Time between slides change
                    disableOnInteraction: false, // Keep autoplay running even when user interacts
                }}
                className="feature-swiper"
            >
                {/* We map over our deatures array to create a SwiperSlide for each item */}
                {features.map((features, index) => (
                    // ´swiper-slide-custom' is a custom class for styling
                    <SwiperSlide key={index} className="swiper-slide-custom">
                        <div className="bg-gray-800 p-6 rounded-lg text-center h-full">
                            <h3 className="font-bold text-white text-lg">{features.title}</h3>
                            <p className="text-gray-400 mt-2">{features.subtitle}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}