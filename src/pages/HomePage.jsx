// src/pages/HomePage.jsx

import React from 'react';
import HeroSection from './sections/HeroSection';
import AboutMeSection from './sections/AboutMeSection';
import ConsultationsSection from './sections/ConsultationsSection';
import CoachingSection from './sections/CoachingSection';
import PitchDeckSection from './sections/PitchDeckSection';
import OtherWinsSection from './sections/OtherWinsSection';
import MediaAppearancesSection from './sections/MediaAppearancesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import SignupSection from './sections/SignupSection';
import ChatWithMeSection from './sections/ChatWithMeSection';
import InteractiveSections from './sections/InteractiveSections';
import SchedulingPage from './SchedulingPage';

export default function HomePage() { 

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#002147] to-[#ECEBE5] text-white px-4"
        >
                <HeroSection />
                <AboutMeSection />
                
                {/* --- CHANGES START HERE --- */}
                {/* We add IDs to these divs to make them linkable from the sidebar */}
                <div id="consultations-section" className="w-full">
                    <ConsultationsSection />
                </div>
                <div id="coaching-section" className="w-full">
                    <CoachingSection />
                </div>
                <div id="invest-section" className="w-full">
                    <PitchDeckSection />
                </div>
                <div id="testimonials-section" className="w-full">
                    <TestimonialsSection />
                </div>
                <div id="other-wins-section" className="w-full">
                    <OtherWinsSection />
                </div>
                <div id="media-appearances-section" className="w-full">
                    <MediaAppearancesSection />
                </div>
                <div id="signup-section" className="w-full">
                    <SignupSection />
                </div>
                <div id="chat-section" className="w-full">
                    <ChatWithMeSection />
                </div>
                <div id="scheduling-section" className="w-full">
                    <SchedulingPage />
                </div>
                <div id="interactive-sections" className="w-full">
                    <InteractiveSections />
                </div>
                {/* --- CHANGES END HERE --- */}
        </div>
    );
}