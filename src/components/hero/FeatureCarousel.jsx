// src/components/hero/FeatureCarousel.jsx - RECOMMENDED CHANGES

import React from 'react';
import BaseCarousel from '../carousel/BaseCarousel';
import { useTranslation } from 'react-i18next';

export default function FeatureCarousel() {
    const { t } = useTranslation();
    const features = t('hero.featureCarousel', { returnObjects: true });

    const swiperConfig = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 70,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            modifier: 2.5,
            slideShadows: false,
        },
    };

    const renderFeatureSlide = (feature, index) => (
        <div className="bg-[#333333] px-4 py-2 md:px-6 md:py-4 space-y-2 justify-center items-center flex flex-col rounded-lg text-center h-full shadow-lg lg:px-4 lg:py-2">
            <h3 className="font-bold text-white text-lg md:text-2xl">{feature.title}</h3>
            <p className="text-white md:text-lg">{feature.subtitle}</p>
        </div>
    );

    return (
        // --- OUTER WRAPPER ---
        // Its only job is to be full-bleed on mobile/tablet.
        <div className="full-bleed py-8">
            <div className="w-full lg:max-w-6xl mx-auto desktop-fade-container">
                <BaseCarousel
                    items={features}
                    renderItem={renderFeatureSlide}
                    swiperConfig={swiperConfig}
                    containerClassName="feature-swiper"
                    slideClassName="swiper-slide-custom"
                />
            </div>
        </div>
    );
}