// src/pages/SchedulingPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../contexts/AuthContext';
// COMPONENT IMPORTS
// We import the first "step" component we created.
import ServiceSelectionStep from '../components/scheduling/ServiceSelectionStep';
import ConsultationScheduleStep from '../components/scheduling/consultations/ConsultationScheduleStep';
import CoachingPlanStep from '../components/scheduling/coaching/CoachingPlanStep';
import PitchDeckStep from '../components/scheduling/pitchdeck/PitchDeckStep';
import ContactInfoStep from '../components/scheduling/ContactInfoStep';
import PaymentStep from '../components/scheduling/PaymentStep';
import ChatbotStep from '../components/scheduling/ChatbotStep';

// We will add imports for our other steps here as we build them.

// COMPONENT DEFINITION
// This is our "smart" component or "wizard". It will manage the state and logic for the entire scheduling flow
export default function SchedulingPage() {
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
    const handleServiceSelect = (serviceId) => {
        // We update the 'formData' object with the selected service type
        // We use the functional form of setState '(prevData => ...)' to ensure we are always working with the most up-to-date state.
        setFormData(prevData => ({
            ...prevData,
            serviceType: serviceId,
        }));
    };

    const handleUpdateField = (formSection, fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [formSection]: {
                ...prevData[formSection],
                [fieldName]:value
            }
        }));
    };

    /**
     * Moves the user to the next step in the form
     * (Validation logic will be added here later)
     */
    const handleNext = () => {
        // For now, it just increments the step number.
        setCurrentStep(prevStep => prevStep + 1);
    };

    /**
     * Moves the user to the previous step in the form
     */
    const handleBack = () => {
        const { serviceType } = formData;
        // Special logic for the pitchdeck flow
        // If we are on the step 3 (contact info) of the pitch deck flow, the next step is 5 (Chatbot), skipping 4 (Payment)
        if (serviceType === 'pitchdeck' && currentStep === 3) {
            setCurrentStep(5); // Jumps directly to the chatbot step
            return;
        }
        // For all other cases, just go to the next sequential step.
        setCurrentStep(prev => prev - 1);
    };

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
        // This is a conceptual mapping. You'd need to create these Price Ids in Stripe
        const priceIdMapping = {
            consultation_45: 'price_1RdJ7nFjE6pGfxcx2jVLoc qp', // 45 min consultation price ID
            consultation_60: 'price_1RdJAYFjE6pGfxcx378rhD1A', // 60 min consultation price ID,
            consultation_75: 'price_1RdJBqFjE6pGfxcxN2YuBUrX', // 75 min consultation price ID
            consultation_90: 'price_1RdJCXFjE6pGfxcxes4spH3A', // 90 min consultation price ID,
            consultation_105: 'price_1RdJHHFjE6pGfxcxE9m11zKI', // 105 min consultation price ID,
            consultation_120: 'price_1RdJIiFjE6pGfxcxuPgav5dM', // 120 min consultation price ID,
            coaching_basic: 'price_1RdJa8FjE6pGfxcxdjHtNjnu', // Basic coaching price ID,
            coaching_standard: 'price_1RdJbFFjE6pGfxcx01eLhzOk', // Standard coaching price ID,
            coaching_premium: 'price_1RdJcJFjE6pGfxcx5UDIvoug', // Premium coaching price ID,
        };

        // Determine the correct Price ID
        let priceId = '';
        if (formData.serviceType === 'consultation') {
            priceId = priceIdMapping[`consultation_${formData.consultation.duration}`];
        } else if (formData.serviceType === 'coaching') {
            priceId = priceIdMapping[`coaching_${formData.coaching.plan}`];
        }

        // Construct the success and cancel URLs
        const baseUrl = window.location.origin + window.location.pathname;
        const successUrl = `${baseUrl}?payment_status=success`;
        const cancelUrl = `${baseUrl}?payment_status=cancelled`;

        try {
            // Call your backend API endpoint
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, quantity: 1, successUrl, cancelUrl }),
            });

            const session = await response.json();

            // Redirect to Stripe Checkout
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

            if (error) {
                console.error("Stripe redirect error:", error);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Error creating checkout session:", error);
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

    // This effects runs when the user object or current step changes.
    // It's responsible for pre-filling the form for logged-in users
    useEffect(() => {
        // We only want to pre-fill if the user is logged in AND is ont he contact step.
        if (user && currentStep === 3) {
            // We also check if the form data is still empty to avoid overwriting user edits.
            if (!formData.contactInfo.name && !formData.contactInfo.email) {
                setFormData(prevData => ({
                    ...prevData,
                    contactInfo: {
                        ...prevData.contactInfo,
                        name: user.user_metadata?.full_name || '',
                        emai: user.email || '',
                        phone: user.user_metadata?.phone || ''
                    }
                }));
            }
        }
    }, [user, currentStep]); // Dependency array

    // STRIPE SETUP
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    {/* Get the total steps for the currently selected flow */}
    const totalSteps = formData.serviceType ? flowConfig[formData.serviceType].totalSteps : 1;

    // RENDER LOGIC
    return (
        // We use a container to center the form on the page and provide padding
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
            <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-xl shadow-md">

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
                        onSelectPlan={(planId) => handleUpdate('coaching', 'plan', planId)}
                    />
                )}

                {/* Add the new PitchDeckStep rendering condition for step 2 */}
                {currentStep === 2 && formData.serviceType === 'pitchdeck' && (
                    <PitchDeckStep 
                        selectedDeck={formData.pitchdeck.type}
                        onSelectDeck={(deckId) => handleUpdate('pitchdeck', 'type', deckId)}
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

                

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                    {/* Back Button: Show if we are after step 1 and before the final step */}
                    {currentStep > 1 && currentStep < (totalSteps + 1) && (
                        <button onClick={handleBack} className="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">Back</button>
                    )}
                    {currentStep === 1 && <div />} {/* Space */}

                    {/* Action Button: Show "Next" if not the last step, otherwise show "Finish" */}
                    {currentStep < totalSteps ? (
                        <button 
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !formData.serviceType) ||
                                (currentStep === 2 && formData.serviceType === 'consultation' && (!formData.consultation.date || !formData.consultation.duration || !formData.consultation.time)) ||
                                (currentStep === 2 && formData.serviceType === 'coaching' && !formData.coaching.plan) ||
                                (currentStep === 2 && formData.serviceType === 'pitchdeck' && !formData.pitchdeck.type) ||
                                (currentStep === 3 && (!formData.contactInfo.name || !formData.contactInfo.email)) ||
                                (currentStep === 4 && (formData.serviceType === 'consultation' || !formData.serviceType === 'coaching') && paymentStatus !== 'success')
                            }
                            className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700"
                        >Next</button>
                    ) : (
                        <button onClick={() => alert("Flow Finished!")} className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700">
                            Finish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}