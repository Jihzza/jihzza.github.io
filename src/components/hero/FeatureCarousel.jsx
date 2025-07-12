// src/components/hero/FeatureCarousel.jsx

import React from 'react';
import BaseCarousel from '../carousel/BaseCarousel';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function FeatureCarousel() {
    const { t } = useTranslation(); // 2. Initialize hook

    // 3. Get the features array from the translation file
    const features = t('hero.featureCarousel', { returnObjects: true });

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

    const renderFeatureSlide = (feature, index) => (
        <div className="bg-[#333333] px-4 py-2 space-y-2 justify-center items-center flex flex-col rounded-lg text-center h-full">
            <h3 className="font-bold text-white text-lg">{feature.title}</h3>
            <p className="text-white">{feature.subtitle}</p>
        </div>
    );

    return (
        <div className="full-bleed py-8">
            <BaseCarousel
                items={features}
                renderItem={renderFeatureSlide}
                swiperConfig={swiperConfig}
                containerClassName="feature-swiper"
                slideClassName="swiper-slide-custom"
            />
        </div>
    );
}