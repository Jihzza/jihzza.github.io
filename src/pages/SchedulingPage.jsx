// src/pages/SchedulingPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getProfile } from '../services/authService';
import { signInWithGoogle } from '../services/authService';

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
import ConfirmationStep from '../components/scheduling/ConfirmationStep';
// We will add imports for our other steps here as we build them.

// COMPONENT DEFINITION
// This is our "smart" component or "wizard". It will manage the state and logic for the entire scheduling flow
export default function SchedulingPage({ initialService, initialCoachingPlan, onFlowStart, initialStep }) {
    // STATE MANAGEMENT

    // Get user and sign-in method from context
    const { user } = useAuth();
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
    const [currentStep, setCurrentStep] = useState(initialStep || 1);
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
        console.log("SchedulingPage mounted. Checking URL.");
        const query = new URLSearchParams(window.location.search);
        
        if (query.get('payment_status') === 'success') {
            console.log("SUCCESS detected in URL. Setting paymentStatus to 'success'.");
            setPaymentStatus('success');
            // Clean the URL to prevent re-triggering on refresh
            window.history.replaceState(null, '', '');
        } else if (query.get('payment_status') === 'cancelled') {
            console.log("CANCEL detected in URL. Setting paymentStatus to 'cancelled'.");
            setPaymentStatus('cancelled');
            window.history.replaceState(null, '', '');
        }
    }, []);

    if (paymentStatus === 'success') {
        console.log("Rendering ConfirmationStep because paymentStatus is 'success'.");
        return (
            <div className="h-auto flex flex-col items-center justify-center py-12 px-4">
                <div className="w-full max-w-2xl p-8 space-y-4 bg-[#002147] rounded-xl shadow-md">
                    <ConfirmationStep />
                </div>
            </div>
        );
    }

    useEffect(() => {
        // This effect runs whenever the initial state props from HomePage are provided.
        if (initialService) {
            // 1. Update the form data based on the restored service and plan.
            setFormData(prev => ({
                ...prev,
                serviceType: initialService,
                coaching: {
                    ...prev.coaching,
                    // Use the full plan object if available, otherwise keep it as is.
                    plan: initialCoachingPlan || prev.coaching.plan
                }
            }));

            // 2. Set the current step. Trust the initialStep prop from the parent if it exists.
            //    This is the key to resuming on Step 3.
            //    If no specific step is provided, default to step 2.
            setCurrentStep(initialStep || 2);

            // 3. CRITICAL: Notify the parent component that we have consumed the initial props
            //    so it can reset its own state and prevent this logic from running again.
            if (onFlowStart) {
                onFlowStart();
            }
        }
    }, [initialService, initialCoachingPlan, initialStep, onFlowStart]);


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

    {/* Get the total steps for the currently selected flow */ }
    const totalSteps = formData.serviceType ? flowConfig[formData.serviceType].totalSteps : 0;

    // RENDER LOGIC
    return (
        // We use a container to center the form on the page and provide padding
        <div className="h-auto flex flex-col items-center justify-center py-4">
            <SectionTextBlack title="Schedule Your Consultation" />
            <div className="w-full max-w-2xl p-8 space-y-4 bg-[#002147] rounded-xl shadow-md">

                {/* --- START OF THE MODIFIED LOGIC --- */}
                {paymentStatus === 'success' ? (
                    // If payment is successful, show only the confirmation
                    <ConfirmationStep />
                ) : (
                    // Otherwise, show the normal multi-step form
                    <>
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
                                    <button onClick={() => alert("Flow Finished!")} className="...">
                                        Finish
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}