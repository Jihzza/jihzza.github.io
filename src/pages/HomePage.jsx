// src/pages/HomePage.jsx

import React, { useState, useRef } from 'react';
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

        // This allows us to directly call browser functions on it, like `scrollIntoView`.
    const schedulingRef = useRef(null);

        // It starts as `null`, meaning the user hasn't chosen a service from the hero section yet.
    const [initialService, setInitialService] = useState(null);

    const handleScheduleService = (serviceId) => {
        // 3. Set State: We update the `initialService` state with the ID from the clicked button.
        // This state will be passed as a prop to the SchedulingPage.
        setInitialService(serviceId);

        // 4. Scroll to the Form: We use the ref to smoothly scroll the scheduling form into the user's view.
        // The timeout ensures the state update is processed before we scroll, creating a smoother transition.
        setTimeout(() => {
            schedulingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleFlowStart = () => {
        setInitialService(null);
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#002147] to-[#ECEBE5] text-white px-4"
        >
            <HeroSection
               onScheduleConsultation={() => handleScheduleService('consultation')}
               onScheduleCoaching={() => handleScheduleService('coaching')}
               onScheduleInvestment={() => handleScheduleService('pitchdeck')}
            />
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
            <div id="scheduling-section" ref={schedulingRef} className="w-full">
                <SchedulingPage
                    initialService={initialService}
                    onFlowStart={handleFlowStart}
                />
            </div>
            <div id="interactive-sections" className="w-full">
                <InteractiveSections />
            </div>
        </div>
    );
}