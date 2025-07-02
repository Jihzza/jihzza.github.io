// src/pages/sections/HeroSection.jsx

import React from 'react';
import Daniel from '../../assets/images/Daniel.jpg';

// IMPORT COMPONENTS
import LearnFromHeader from '../../components/hero/LearnFromHeader';
import WordCarousel from '../../components/hero/WordCarousel';
import CtaSection from '../../components/hero/CtaSection';
import FeatureCarousel from '../../components/hero/FeatureCarousel';
import ServicesPreview from '../../components/hero/ServicesPreview';

export default function HeroSection() {
    return (
        // The overflow-hidden here can now be safely removed.
        <section className="max-w-full mx-auto py-2">
            <LearnFromHeader />

            {/* Client Image - SOLUTION APPLIED HERE */}
            <div className="flex w-full justify-center px-4">
                {/* 1. We constrain the container. `max-w-xs` is a good mobile-first choice. */}
                <div className="w-full py-2 max-w-xs"> 
                    <img 
                        src={Daniel} 
                        alt="Daniel" 
                        // 2. The image now fills its constrained container.
                        className="rounded-xl w-full object-cover" 
                    />
                </div>
            </div>

            <WordCarousel />
            <CtaSection />
            <FeatureCarousel />
            <ServicesPreview />
        </section>
    );
}