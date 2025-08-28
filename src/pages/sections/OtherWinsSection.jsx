// src/pages/sections/OtherWinsSection.jsx

import React from 'react';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import ImageCarousel from '../../components/carousel/ImageCarousel';
import InteractiveVideo from '../../components/video/InteractiveVideo';
import TransformationVideo from '../../assets/vids/BodyTransformation.mp4';
import { useTranslation } from 'react-i18next'; // 1. Import the hook

export default function OtherWinsSection() {
    const { t } = useTranslation(); // 2. Initialize the hook

    return (
        <section className="w-full mx-auto py-4 md:py-4 text-center flex flex-col md:px-6">
            {/* 3. Use translated text for the title and subtitle */}
            <SectionTextBlack title={t('otherWins.title')}>
                {t('otherWins.bodyTransformation')}
            </SectionTextBlack>

            <InteractiveVideo
                videoSrc={TransformationVideo}
                className="w-45 self-center rounded-xl mt-6 md:w-55 lg:w-45"
            />

            <div className="max-w-5xl self-center">
                <SectionTextBlack>
                    {t('otherWins.socialMedia')}
                </SectionTextBlack>
            </div>
            <div className="full-bleed py-8">
                <div className="w-full mx-auto lg:max-w-6xl desktop-fade-container lg:w-[70%]">
                    <ImageCarousel />
                </div>
            </div>

        </section>
    );
}