// src/pages/HomePage.jsx

import React, { useState, useRef, useEffect } from 'react';
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
    const schedulingRef = useRef(null);
    const [initialService, setInitialService] = useState(null);
    const [initialCoachingPlan, setInitialCoachingPlan] = useState(null);
    const [initialStep, setInitialStep] = useState(null);

    const handleScheduleService = (serviceId, details = null) => {
        setInitialService(serviceId);
        if (serviceId === 'coaching' && details) {
            setInitialCoachingPlan(details);
        } else {
            setInitialCoachingPlan(null);
        }
        setTimeout(() => {
            schedulingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleFlowStart = () => {
        setInitialService(null);
        setInitialCoachingPlan(null);
        setInitialStep(null); // Also reset the initial step
    };

    useEffect(() => {
        const handlePageReady = () => {
            const savedStateJSON = sessionStorage.getItem('schedulingState');
            const legacyScrollTo = localStorage.getItem('scrollTo');

            if (savedStateJSON) {
                console.log("Page is fully loaded. Restoring scheduling state and scrolling...");
                try {
                    const savedState = JSON.parse(savedStateJSON);
                    
                    // Set all the state that SchedulingPage needs
                    setInitialService(savedState.formData.serviceType);
                    setInitialStep(savedState.currentStep); // Set the step to resume on
                    if (savedState.formData.serviceType === 'coaching' && savedState.formData.coaching.plan) {
                        setInitialCoachingPlan(savedState.formData.coaching.plan);
                    }

                    schedulingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

                } catch (error) {
                    console.error("Failed to restore state in HomePage:", error);
                } finally {
                    sessionStorage.removeItem('schedulingState');
                    if (legacyScrollTo) localStorage.removeItem('scrollTo');
                }
            } else if (legacyScrollTo) {
                console.log(`Page is fully loaded. Performing legacy scroll to: #${legacyScrollTo}`);
                const targetElement = document.getElementById(legacyScrollTo);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                localStorage.removeItem('scrollTo');
            }
        };

        if (document.readyState === 'complete') {
            handlePageReady();
        } else {
            window.addEventListener('load', handlePageReady, { once: true });
        }

        return () => {
            window.removeEventListener('load', handlePageReady);
        };
    }, []); // The dependency array ensures this runs only once.

    // =================================================================
    // THE ERROR WAS HERE: The useEffect hook was not closed.
    // The `return` statement must be OUTSIDE the `useEffect` block.
    // =================================================================

    return (
        <div
            id="page-top"
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#002147] to-[#ECEBE5] text-white px-4"
        >
            <HeroSection
                onScheduleConsultation={() => handleScheduleService('consultation')}
                onScheduleCoaching={() => handleScheduleService('coaching')}
                onScheduleInvestment={() => handleScheduleService('pitchdeck')}
            />
            <AboutMeSection />
            <div id="consultations-section" className="w-full">
                <ConsultationsSection onBookConsultation={() => handleScheduleService('consultation')} />
            </div>
            <div id="coaching-section" className="w-full">
                <CoachingSection onBookCoaching={(tier) => handleScheduleService('coaching', tier)} />
            </div>
            <div id="invest-section" className="w-full">
                <PitchDeckSection onBookPitchDeck={() => handleScheduleService('pitchdeck')} />
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
                    initialCoachingPlan={initialCoachingPlan}
                    initialStep={initialStep}
                    onFlowStart={handleFlowStart}
                />
            </div>
            <div id="interactive-sections" className="w-full">
                <InteractiveSections />
            </div>
        </div>
    );
}