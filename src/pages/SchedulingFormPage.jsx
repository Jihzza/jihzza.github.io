// src/pages/SchedulingFormPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getProfile } from '../services/authService';
import { signInWithGoogle } from '../services/authService';
import { createPitchRequest } from '../services/pitchDeckServices';
import { useSearchParams, useNavigate } from 'react-router-dom';

// COMPONENT IMPORTS
import ServiceSelectionStep from '../components/scheduling/ServiceSelectionStep';
import ConsultationScheduleStep from '../components/scheduling/consultations/ConsultationScheduleStep';
import SectionTextWhite from '../components/common/SectionTextWhite';
import CoachingPlanStep from '../components/scheduling/coaching/CoachingPlanStep';
import PitchDeckStep from '../components/scheduling/pitchdeck/PitchDeckStep';
import ContactInfoStep from '../components/scheduling/ContactInfoStep';
import PaymentStep from '../components/scheduling/PaymentStep';
import ChatbotStep from '../components/scheduling/ChatbotStep';
import ConfirmationStep from '../components/scheduling/ConfirmationStep';
import { useTranslation } from 'react-i18next';

import { motion } from 'framer-motion';

// COMPONENT DEFINITION
// This is our dedicated scheduling form page that manages the entire scheduling flow
export default function SchedulingFormPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    // Get user and sign-in method from context
    const { user } = useAuth();

    // Get initial service from URL parameters
    const serviceFromUrl = searchParams.get('service');
    const coachingPlanFromUrl = searchParams.get('plan');

    // 'formData' will be our single source of truth. It's an object that will accumulate all the data from the user across all steps of the form.
    // We initialize it with default values.
    const [formData, setFormData] = useState({
        serviceType: serviceFromUrl || null, // consultation, coaching, pitchdeck
        consultation: {
            date: null,
            duration: null, // in minutes
            time: null,
        },
        coaching: {
            plan: coachingPlanFromUrl || null, // basic, standard, premium
        },
        pitchdeck: {
            type: null,
        },
        contactInfo: {
            name: '',
            email: '',
            phone: '',
        }
    });

    // 'currentStep' will track which step of the process the user is on.
    // We'll start at step 2 since service selection is now on the home page
    const [profile, setProfile] = useState(null);
    const [currentStep, setCurrentStep] = useState(2);
    const [paymentStatus, setPaymentStatus] = useState('awaiting');
    const [isProcessing, setIsProcessing] = useState(false);

    // HANDLER FUNCTIONS
    // These functions are the bridge between our parent state and our child components

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const { data } = await getProfile(user.id);
                setProfile(data);
            }
        };
        fetchProfile();
    }, [user]);

    const handleUpdateField = (formSection, fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [formSection]: {
                ...prevData[formSection],
                [fieldName]: value
            }
        }));
    };

    /**
     * Moves the user to the next step in the form
     * (Validation logic will be added here later)
     */
    const handleNext = async () => {
        const { serviceType } = formData;
        // Pitch Deck: confirm on Contact Info (step 3)
        if (serviceType === 'pitchdeck' && currentStep === 3) {
            try {
                setIsProcessing(true);
                const { data, error } = await createPitchRequest({
                    project: formData.pitchdeck.type,
                    name: formData.contactInfo.name,
                    email: formData.contactInfo.email,
                    phone: formData.contactInfo.phone,
                    user_id: user?.id || null,
                });
                if (error) throw error;
            } catch (e) {
                console.error('Pitch request insert failed:', e);
                alert('Sorry, we could not submit your request. Please try again.');
                setIsProcessing(false);
                return; // stay on step 3 if it fails
            }
            setIsProcessing(false);
        }
        setCurrentStep(prev => prev + 1); // 3 -> 4 (Chatbot) for pitchdeck; normal for others
    };

    /**
     * Moves the user to the previous step in the form
     */
    const handleBack = () => {
        // If the user goes back to step 2, redirect to home page
        if (currentStep === 2) {
            navigate('/');
            return;
        }
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleCoachingPlanSelect = (planId) => {
        handleUpdateField('coaching', 'plan', planId);
        handleNext();
    }

    const handlePitchDeckSelect = (deckId) => {
        handleUpdateField('pitchdeck', 'type', deckId);
        handleNext();
    }

    const price = useMemo(() => {
        const { serviceType, consultation, coaching } = formData;
        if (serviceType === 'consultation' && consultation.duration) {
            const pricePerHour = 90;
            return (consultation.duration / 60) * pricePerHour;
        }
        if (serviceType === 'coaching' && coaching.plan) {
            const prices = { basic: 40, standard: 90, premium: 230 };
            return prices[coaching.plan];
        }
        return 0;
    }, [formData]);

    const handleInitiateCheckout = async () => {
        setIsProcessing(true);

        try {
            const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;

            // --- THIS IS THE FIX ---
            // "Why": Replaced supabase.auth.session() with the new async method 
            // supabase.auth.getSession() which is correct for Supabase v2.
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;

            if (!accessToken) {
                throw new Error("User is not authenticated.");
            }
            // --- END OF FIX ---

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Now this will work
                },
                body: JSON.stringify({
                    formData: formData,
                    userId: user.id,
                    userEmail: user.email,
                }),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.error || 'Failed to create checkout session.');
            }

            const { url: checkoutUrl } = await response.json();

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                throw new Error("Did not receive a checkout URL.");
            }

        } catch (error) {
            console.error("Checkout initiation failed:", error);
            setIsProcessing(false);
        }
    };

    const handleGoogleSignIn = async () => {
        // 1. Capture the current state into a single object.
        const stateToPreserve = {
            formData: formData,
            currentStep: currentStep,
            scrollPosition: window.scrollY // Capture the exact vertical scroll position.
        };

        // 2. Save the state to sessionStorage.
        // We use JSON.stringify because storage can only hold strings.
        try {
            sessionStorage.setItem('schedulingState', JSON.stringify(stateToPreserve));
        } catch (error) {
            console.error("Could not save scheduling state to sessionStorage:", error);
        }

        // 3. Initiate the Google sign-in flow.
        await signInWithGoogle();
    };

    const flowConfig = {
        consultation: { totalSteps: 5 },
        coaching: { totalSteps: 5 },
        pitchdeck: { totalSteps: 4 },
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);

        if (query.get('payment_status') === 'success') {
            setPaymentStatus('success');
            // Clean the URL to prevent re-triggering on refresh
            window.history.replaceState(null, '', '');
        } else if (query.get('payment_status') === 'cancelled') {
            setPaymentStatus('cancelled');
            window.history.replaceState(null, '', '');
        }
    }, []);

    // This effects runs when the user object or current step changes.
    // It's responsible for pre-filling the form for logged-in users
    useEffect(() => {
        if (user && profile && currentStep === 3) {
            if (!formData.contactInfo.name && !formData.contactInfo.email) {
                setFormData(prevData => ({
                    ...prevData,
                    contactInfo: {
                        ...prevData.contactInfo,
                        name: profile.full_name || '',
                        email: user.email || '', // Corrected the typo 'emai' to 'email'
                        phone: profile.phone || ''
                    }
                }));
            }
        }
    }, [user, profile, currentStep]); // Dependency array

    // Get the total steps for the currently selected flow
    const totalSteps = formData.serviceType ? flowConfig[formData.serviceType].totalSteps : 0;

    // Handle initial service from URL parameters
    useEffect(() => {
        if (serviceFromUrl && serviceFromUrl !== formData.serviceType) {
            setFormData(prev => ({
                ...prev,
                serviceType: serviceFromUrl,
                coaching: {
                    ...prev.coaching,
                    plan: coachingPlanFromUrl || prev.coaching.plan
                }
            }));
        }
    }, [serviceFromUrl, coachingPlanFromUrl]);

    // If no service is selected, show service selection step
    if (!formData.serviceType) {
        return (
            <div className="h-auto flex flex-col items-center justify-center py-4">
                <div className="w-full max-w-2xl p-8 space-y-4 rounded-xl shadow-xl hover:shadow-xl transition-shadow duration-200">
                    <ServiceSelectionStep />
                </div>
            </div>
        );
    }

    // RENDER LOGIC
    return (
        // We use a container to center the form on the page and provide padding
        <div className="h-auto flex flex-col items-center justify-start p-4">
            <SectionTextWhite title={t('scheduling.title')} />
            <div className="w-full max-w-2xl p-4 space-y-4">

                {/* --- START OF THE MODIFIED LOGIC --- */}
                {paymentStatus === 'success' ? (
                    // If payment is successful, show only the confirmation
                    <ConfirmationStep />
                ) : (
                    // Otherwise, show the normal multi-step form
                    <>
                        {/* We start at step 2 since service selection is now on the home page */}
                        {currentStep === 2 && formData.serviceType === 'consultation' && (
                            <ConsultationScheduleStep
                                // Pass down only the revelant part of the formData
                                consultationData={formData.consultation}
                                // Pass a simplified update function
                                onUpdateField={(fieldName, value) => handleUpdateField('consultation', fieldName, value)}
                            />
                        )}

                        {/* This block handles the new coaching flow at step 2 */}
                        {currentStep === 2 && formData.serviceType === 'coaching' && (
                            <CoachingPlanStep
                                selectedPlan={formData.coaching.plan}
                                onSelectPlan={handleCoachingPlanSelect}
                            />
                        )}

                        {/* Add the new PitchDeckStep rendering condition for step 2 */}
                        {currentStep === 2 && formData.serviceType === 'pitchdeck' && (
                            <PitchDeckStep
                                selectedDeck={formData.pitchdeck.type}
                                onSelectDeck={handlePitchDeckSelect}
                            />
                        )}

                        {currentStep === 3 && (
                            <ContactInfoStep
                                isLoggedIn={!!user} // Pass true/false if user object exists
                                contactInfoData={formData.contactInfo}
                                // The event object from onChange is passed directly to our handler
                                onUpdateField={(e) => handleUpdateField('contactInfo', e.target.name, e.target.value)}
                                onGoogleSignIn={handleGoogleSignIn}
                            />
                        )}

                        {currentStep === 4 && (formData.serviceType === 'consultation' || formData.serviceType === 'coaching') && (
                            <PaymentStep
                                formData={formData}
                                price={price} // Assuming price calculation is still valid
                                onInitiateCheckout={handleInitiateCheckout}
                                isProcessing={isProcessing}
                            />
                        )}

                        {(formData.serviceType === 'pitchdeck' && currentStep === 4) && <ChatbotStep />}
                        {(formData.serviceType !== 'pitchdeck' && currentStep === 5) && <ChatbotStep />}

                        {currentStep >= 2 && (
                            <div className="flex justify-between pt-4">
                                {/* Back Button: Always shown from step 2 onwards */}
                                <motion.button
                                    onClick={handleBack}
                                    className="px-6 py-2 text-sm font-semibold text-white bg-black rounded-md shadow-xl transition-colors md:text-base cursor-pointer"
                                    whileHover={{ scale: 1.06, transition: { duration: 0.08 } }}
                                    whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
                                    type="button"   >
                                    {t('scheduling.backButton')}
                                </motion.button>

                                {/* Next Button: Shown on intermediate steps */}
                                {currentStep < totalSteps && (
                                    <motion.button

                                        onClick={handleNext}
                                        disabled={
                                            (currentStep === 2 && formData.serviceType === 'consultation' && (!formData.consultation.date || !formData.consultation.duration || !formData.consultation.time)) ||
                                            (currentStep === 2 && formData.serviceType === 'coaching' && !formData.coaching.plan) ||
                                            (currentStep === 2 && formData.serviceType === 'pitchdeck' && !formData.pitchdeck.type) ||
                                            (currentStep === 3 && (!formData.contactInfo.name || !formData.contactInfo.email)) ||
                                            (currentStep === 4 && (formData.serviceType === 'consultation' || formData.serviceType === 'coaching') && paymentStatus !== 'success') ||
                                            isProcessing
                                        }
                                        className="px-6 py-2 text-sm font-semibold text-black bg-[#BFA200] rounded-md transition-colors hover:bg-yellow-500 md:text-base
                cursor-pointer disabled:bg-opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-xl transition-shadow duration-200"
                                        whileHover={{ scale: 1.06, transition: { duration: 0.08 } }}
                                        whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
                                        type="button"
                                    >
                                        {t('scheduling.nextButton')}
                                    </motion.button>
                                )}

                                {/* Finish Button: Shown only on the last step */}
                                {currentStep === totalSteps && (
                                    <motion.button
                                        onClick={() => alert(t('scheduling.flowFinished'))}
                                        className="cursor-pointer ..."
                                        whileHover={{ scale: 1.06, transition: { duration: 0.08 } }}
                                        whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
                                        type="button"
                                    >
                                        {t('scheduling.finishButton')}

                                    </motion.button>
                                )}
                            </div>
                        )}
                    </>
                )
                }

            </div >
        </div >
    );
}
