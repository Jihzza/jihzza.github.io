// src/pages/sections/OtherWinsSection.jsx

import React from 'react';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import ImageCarousel from '../../components/carousel/ImageCarousel';
import FullScreenVideo from '../../components/video/FullScreenVideo';
import { useTranslation } from 'react-i18next';
import TransformationVideo from '../../assets/video/BodyTransformation.mp4';

export default function OtherWinsSection() {
    const { t } = useTranslation();

    return (
        <section className="w-full mx-auto py-4 md:py-4 text-center flex flex-col md:px-6">
            {/* Title and subtitle section */}
            <SectionTextBlack title={t('otherWins.title')}>
                {t('otherWins.bodyTransformation')}
            </SectionTextBlack>

            {/* Video section */}
            <div className="w-full mx-auto">
                <div className="w-full max-w-md mx-auto justify-center items-center flex">
                    <FullScreenVideo
                        src={TransformationVideo}
                        className="w-45 self-center rounded-xl mt-6 md:w-55 lg:w-45"
                    />
                </div>
            </div>

            {/* Social media description section */}
            <div className="w-full mx-auto">
                <div className="max-w-4xl mx-auto">
                    <SectionTextBlack>
                        {t('otherWins.socialMedia')}
                    </SectionTextBlack>
                </div>
            </div>

            {/* Carousel section */}
            <div className="full-bleed py-8">
                <div className="w-full mx-auto lg:max-w-6xl desktop-fade-container lg:w-[70%]">
                    <ImageCarousel />
                </div>
            </div>
        </section>
    );
}