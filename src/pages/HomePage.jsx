// src/pages/HomePage.jsx

import React from 'react';
import SchedulingPage from './SchedulingPage';
import HeroSection from './sections/HeroSection';
import AboutMeSection from './sections/AboutMeSection';
import ConsultationsSection from './sections/ConsultationsSection';
import CoachingSection from './sections/CoachingSection';
import PitchDeckSection from './sections/PitchDeckSection';
import OtherWinsSection from './sections/OtherWinsSection';
import MediaAppearancesSection from './sections/MediaAppearancesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import SignupSection from './sections/SignupSection';

export default function HomePage() { 
    
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#002147] to-[#ECEBE5] text-white px-4"
            >
                <HeroSection />
                <AboutMeSection />
                <ConsultationsSection />
                <CoachingSection />
                <PitchDeckSection />
                <TestimonialsSection />
                <OtherWinsSection />
                <MediaAppearancesSection />
                <SignupSection />
                <SchedulingPage />
        </div>
    );
}