// src/pages/SchedulingPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

import { getProfile } from '../services/authService';

// COMPONENT IMPORTS
// We import the first "step" component we created.
import ServiceSelectionStep from '../components/scheduling/ServiceSelectionStep';
import ConsultationScheduleStep from '../components/scheduling/consultations/ConsultationScheduleStep';
import SectionTextBlack from '../components/common/SectionTextBlack';
import CoachingPlanStep from '../components/scheduling/coaching/CoachingPlanStep';
import PitchDeckStep from '../components/scheduling/pitchdeck/PitchDeckStep';
import ContactInfoStep from '../components/scheduling/ContactInfoStep';
import PaymentStep from '../components/scheduling/PaymentStep';
import ChatbotStep from '../components/scheduling/ChatbotStep';

// We will add imports for our other steps here as we build them.

// COMPONENT DEFINITION
// This is our "smart" component or "wizard". It will manage the state and logic for the entire scheduling flow
export default function SchedulingPage({ initialService, onFlowStart }) {
    // STATE MANAGEMENT

    // Get user and sign-in method from context
    const { user, googleSignIn } = useAuth();
    /// 'formData' will be our single source of truth. It's an object that will accumulate all the data from the user across all steps of the form.
    // We initialize it with default values.
    const [formData, setFormData] = useState({
        serviceType: null, // consultation, coaching, pitchdeck
        consultation: {
            date: null,
            duration: null, // in minutes
            time: null,
        },
        coaching: {
            plan: null, // basic, standard, premium
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

    // ´currentStep´ will track which step of the process the user is on.
    // We'll start at step 1: the service selection.
    const [profile, setProfile] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentStatus, setPaymentStatus] = useState('awaiting');
    const [isProcessing, setIsProcessing] = useState(false);

    // HANDLER FUNCTIONS
    // These functions are the bridge between our parent state and our child components

    /**
     * Handles the selection of a service from the ServiceSelectionStep components
     *@param {string} serviceId - The ID of the selected service.
     *@param {string} formSection - The top-level key in formData (e.g. 'consultation')
     *@param {string} fieldName - The specific field within the formSection that is being updated (e.g. 'date')
     *@param {*} value - The new value for the field
     */

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const { data } = await getProfile(user.id);
                setProfile(data);
            }
        };
        fetchProfile();
    }, [user]);

    const handleServiceSelect = (serviceId) => {
        // We update the 'formData' object with the selected service type
        // We use the functional form of setState '(prevData => ...)' to ensure we are always working with the most up-to-date state.
        setFormData(prevData => ({
            ...prevData,
            serviceType: serviceId,
        }));
        setCurrentStep(2);
    };

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
    const handleNext = () => {
        const { serviceType } = formData;
        if (serviceType === 'pitchdeck' && currentStep === 3) {
            setCurrentStep(5);
            return;
        }
        setCurrentStep(prevStep => prevStep + 1);
    };

    /**
     * Moves the user to the previous step in the form
     */
    const handleBack = () => {
        // If the user goes back to step 1, we should reset the serviceType
        // so they can make a different choice.
        if (currentStep === 2) {
            setFormData(prev => ({ ...prev, serviceType: null }));
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

        // --- NEW ARCHITECTURE: Map services to their Payment Link URLs ---
        // Replace these placeholder URLs with the real ones you created in your Stripe Dashboard.
        const paymentLinkMapping = {
            consultation_45: 'https://buy.stripe.com/test_28E8wPgq10NEeub2Lb1oI01',
            consultation_60: 'https://buy.stripe.com/test_aFadR9a1D9kacm3clL1oI00',
            consultation_75: 'https://buy.stripe.com/test_9B65kD8Xzcwm1HpetT1oI03',
            consultation_90: 'https://buy.stripe.com/test_7sY7sLb5Haoe71J85v1oI04',
            consultation_105: 'https://buy.stripe.com/test_9B600jb5HgMCcm3etT1oI05',
            consultation_120: 'https://buy.stripe.com/test_14A28r2zb9kacm3bhH1oI06',
            coaching_basic: 'https://buy.stripe.com/test_14A28r2zb9kacm3bhH1oI06',
            coaching_standard: 'https://buy.stripe.com/test_9B6dR95Ln1RIcm35Xn1oI08',
            coaching_premium: 'https://buy.stripe.com/test_6oU6oHflXfIycm385v1oI09',
        };

        // CAPTURE THE STATE TO PRESERVE
        const stateToPreserve = {
            formData: formData,
            currentStep: currentStep,
            scrollPosition: window.scrollY
        };

        // --- 2. SAVE STATE TO SESSION STORAGE ---
        // We convert the object to a JSON string because storage can only hold strings.
        sessionStorage.setItem('schedulingState', JSON.stringify(stateToPreserve));

        // Determine the correct Payment Link URL
        let paymentLinkUrl = '';
        if (formData.serviceType === 'consultation') {
            paymentLinkUrl = paymentLinkMapping[`consultation_${formData.consultation.duration}`];
        } else if (formData.serviceType === 'coaching') {
            paymentLinkUrl = paymentLinkMapping[`coaching_${formData.coaching.plan}`];
        }

        if (paymentLinkUrl) {
            window.location.href = paymentLinkUrl;
        } else {
            console.error("No payment link found for the selected service.");
            sessionStorage.removeItem('schedulingState'); // Clean up if there's an error
            setIsProcessing(false);
        }
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
            // You mmight also want to trigger saving the final order to your databse here.
        }

        if (query.get('payment_status') === 'cancelled') {
            setPaymentStatus('cancelled');
        }
    }, []);

    useEffect(() => {
        // If an initial service is provided (i.e., the user clicked a "Book" button)...
        if (initialService) {
            // ...update the form's state with the selected service type.
            setFormData(prevData => ({
                ...prevData,
                serviceType: initialService,
            }));
            // ...and advance the user directly to the second step of the wizard.
            setCurrentStep(2);

            // Call the callback to reset the state in the parent, preventing this
            // effect from running again on re-renders.
            if (onFlowStart) {
                onFlowStart();
            }
        }
    }, [initialService, onFlowStart]); // Dependency array ensures this runs only when these props change.


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

    // --- ADD THIS NEW USEEFFECT HOOK FOR STATE RESTORATION ---
    useEffect(() => {
        // 1. Check if saved state exists in sessionStorage
        const savedStateJSON = sessionStorage.getItem('schedulingState');

        if (savedStateJSON) {
            try {
                // 2. Parse the JSON string back into an object
                const savedState = JSON.parse(savedStateJSON);

                // 3. Restore the component's state from the saved data
                setFormData(savedState.formData);
                setCurrentStep(savedState.currentStep);

                // 4. Restore the scroll position. We use a small timeout
                // to ensure the page has re-rendered before scrolling.
                setTimeout(() => {
                    window.scrollTo(0, savedState.scrollPosition);
                }, 100); // 100ms delay is usually sufficient

                // 5. IMPORTANT: Clean up the stored state so it's not reused
                sessionStorage.removeItem('schedulingState');

            } catch (error) {
                console.error("Failed to parse or restore scheduling state:", error);
                // Clean up in case of a parsing error
                sessionStorage.removeItem('schedulingState');
            }
        }
    }, []); // The empty dependency array [] ensures this runs only once on mount


    {/* Get the total steps for the currently selected flow */ }
    const totalSteps = formData.serviceType ? flowConfig[formData.serviceType].totalSteps : 0;

    // RENDER LOGIC
    return (
        // We use a container to center the form on the page and provide padding
        <div className="h-auto flex flex-col items-center justify-center py- px-4">
            <SectionTextBlack title="Schedule Your Consultation" />
            <div className="w-full max-w-2xl p-8 space-y-4 bg-[#002147] rounded-xl shadow-md">

                {/* Conditional Rendering: Display the correct component for the current step */}
                {currentStep === 1 && (
                    <ServiceSelectionStep
                        // We pass the currently selected service from our state down as prop.
                        selectedService={formData.serviceType}
                        // We pass the handler function down so the child can notify the parent of a change
                        onSelectService={handleServiceSelect}
                    />
                )}

                {/* We will add more conditional blocks here for other steps */}
                {/* {currentStep === 2 && formData.serviceType === 'consultation' && <ConsultationScheduleStep} */}
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
                        onUpdateField={(e) => handleUpdateField('contactInfo', e.target.name, e.target.value)} onGoogleSignIn={googleSignIn}
                    />
                )}

                {currentStep === 4 && (formData.serviceType === 'consultation' || formData.serviceType === 'coaching') && (
                    <PaymentStep
                        paymentStatus={paymentStatus}
                        formData={formData}
                        price={price}
                        onInitiateCheckout={handleInitiateCheckout}
                        isProcessing={isProcessing}
                    />
                )}

                {currentStep === 5 && (
                    <ChatbotStep />
                )}



                {currentStep > 1 && (
                    <div className="flex justify-between pt-4">
                        {/* Back Button: Always shown after step 1 */}
                        <button onClick={handleBack} className="px-6 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-300 transition-colors">Back</button>

                        {/* Next Button: Shown on intermediate steps */}
                        {currentStep < totalSteps && (
                            <button
                                onClick={handleNext}
                                disabled={
                                    (currentStep === 2 && formData.serviceType === 'consultation' && (!formData.consultation.date || !formData.consultation.duration || !formData.consultation.time)) ||
                                    (currentStep === 2 && formData.serviceType === 'coaching' && !formData.coaching.plan) ||
                                    (currentStep === 2 && formData.serviceType === 'pitchdeck' && !formData.pitchdeck.type) ||
                                    (currentStep === 3 && (!formData.contactInfo.name || !formData.contactInfo.email)) ||
                                    (currentStep === 4 && (formData.serviceType === 'consultation' || formData.serviceType === 'coaching') && paymentStatus !== 'success')
                                }
                                className="px-6 py-2 text-sm font-semibold text-white bg-[#BFA200] rounded-md transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed hover:bg-yellow-500"
                            >Next</button>
                        )}

                        {/* Finish Button: Shown only on the last step */}
                        {currentStep === totalSteps && (
                            <button onClick={() => alert("Flow Finished!")} className="px-6 py-2 text-sm font-semibold text-white bg-[#BFA200] rounded-md transition-colors hover:bg-yellow-500">
                                Finish
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}