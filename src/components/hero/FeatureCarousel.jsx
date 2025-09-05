// src/components/hero/FeatureCarousel.jsx - RECOMMENDED CHANGES

import React from 'react';
import BaseCarousel from '../carousel/BaseCarousel';
import { useTranslation } from 'react-i18next';
import BoxLaurelLeft from '../../assets/Box Laurel Wreath Left.svg'
import BoxLaurelRight from '../../assets/Box Laurel Wreath Right.svg'

export default function FeatureCarousel() {
    const { t } = useTranslation();
    const features = t('hero.featureCarousel', { returnObjects: true });

    const swiperConfig = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 120,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            modifier: 2.5,
            slideShadows: false,
        },
    };

    const renderFeatureSlide = (feature, index) => (
        <div className="space-y-2 space-x-2 justify-center items-center flex rounded-lg text-center h-full w-[290px] md:w-[340px] lg:w-[450px]">
            <img src={BoxLaurelLeft} alt="BoxLaurelLeft" className='h-15 w-15 md:h-22 md:w-22 lg:h-25 md:w-25' />
            <div className='justify-center items-center flex flex-col'>
                <h3 className="font-bold text-white text-base md:text-2xl">{feature.title}</h3>
                <p className="text-sm text-white md:text-lg">{feature.subtitle}</p>
            </div>
            <img src={BoxLaurelRight} alt="BoxLaurelRight" className='h-15 w-15 md:h-22 md:w-22 lg:h-25 md:w-25' />
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