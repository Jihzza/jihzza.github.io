// src/pages/HomePage.jsx

import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './sections/HeroSection';
import AboutMeSection from './sections/AboutMeSection';
import ConsultationsSection from './sections/Consultations';
import CoachingSection from './sections/Coaching';
import PitchDeckSection from './sections/PitchDeck';
import OtherWinsSection from './sections/OtherWinsSection';
import MediaAppearancesSection from './sections/MediaAppearancesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import SignupSection from './sections/SignupSection';
import ChatWithMeSection from './sections/ChatWithMeSection';
import InteractiveSections from './sections/InteractiveSections';
import ServiceSelectionStep from '../components/scheduling/ServiceSelectionStep';
import SectionTextBlack from '../components/common/SectionTextBlack';

import { useTranslation } from 'react-i18next';

export default function HomePage() {
    const navigate = useNavigate();
    const schedulingRef = useRef(null);
    const { t } = useTranslation();

    // All buttons on home page go directly to step 2 (specific service step)
    const handleScheduleService = (serviceId, details = null) => {
        // Build the URL with service parameter
        let url = `/schedule?service=${serviceId}`;
        
        // If Coaching, add plan parameter
        if (serviceId === 'coaching' && details) {
            // accept either { tier } payload or a direct id
            const planId = details?.tier?.id ?? details?.id ?? details ?? null;
            if (planId) {
                url += `&plan=${planId}`;
            }
        }

        // Navigate to the scheduling form page
        navigate(url);
    };

    useEffect(() => {
        const handlePageReady = () => {
            const savedStateJSON = sessionStorage.getItem('schedulingState');
            const legacyScrollTo = localStorage.getItem('scrollTo');

            if (savedStateJSON) {
                try {
                    const savedState = JSON.parse(savedStateJSON);

                    // Build URL with service and plan parameters
                    let url = `/schedule?service=${savedState.formData.serviceType}`;
                    if (savedState.formData.serviceType === 'coaching' && savedState.formData.coaching.plan) {
                        url += `&plan=${savedState.formData.coaching.plan}`;
                    }

                    // Navigate to the scheduling form page
                    navigate(url);

                } catch (error) {
                    console.error("Failed to restore state in HomePage:", error);
                } finally {
                    sessionStorage.removeItem('schedulingState');
                    if (legacyScrollTo) localStorage.removeItem('scrollTo');
                }
            } else if (legacyScrollTo) {
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
    }, [navigate]); // The dependency array ensures this runs only once.

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
                onScheduleCoaching={(tier) => handleScheduleService('coaching', tier)}
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
                <div className="h-auto flex flex-col items-center justify-center py-4">
                    <SectionTextBlack title={t('scheduling.serviceSelection.title')}>

                    </SectionTextBlack>
                    <div className="w-full max-w-2xl p-8 space-y-4 bg-[#002147] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                        <ServiceSelectionStep onSelectService={(serviceId) => handleScheduleService(serviceId)} />
                    </div>
                </div>
            </div>
            <div id="interactive-sections" className="w-full">
                <InteractiveSections />
            </div>
        </div>
    );
}