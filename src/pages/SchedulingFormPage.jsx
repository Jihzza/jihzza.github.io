// src/pages/SchedulingFormPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getProfile, signInWithGoogle } from '../services/authService';
import { createPitchRequest } from '../services/pitchDeckServices';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// COMPONENTS
import ServiceSelectionStep from '../components/scheduling/ServiceSelectionStep';
import ConsultationScheduleStep from '../components/scheduling/consultations/ConsultationScheduleStep';
import SectionTextWhite from '../components/common/SectionTextWhite';
import CoachingPlanStep from '../components/scheduling/coaching/CoachingPlanStep';
import PitchDeckStep from '../components/scheduling/pitchdeck/PitchDeckStep';
import ContactInfoStep from '../components/scheduling/ContactInfoStep';
import PaymentStep from '../components/scheduling/PaymentStep';
import ChatbotStep from '../components/scheduling/ChatbotStep';
import ConfirmationStep from '../components/scheduling/ConfirmationStep';

export default function SchedulingFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  // Auth
  const { user } = useAuth();

  // URL params
  const serviceFromUrl = searchParams.get('service');        // consultation | coaching | pitchdeck
  const coachingPlanFromUrl = searchParams.get('plan');      // basic | standard | premium

  // Global form state
  const [formData, setFormData] = useState({
    serviceType: serviceFromUrl || null,
    consultation: { date: null, duration: null, time: null },
    coaching: { plan: coachingPlanFromUrl || null },
    pitchdeck: { type: null },
    contactInfo: { name: '', email: '', phone: '' },
  });

  // Flow state
  const [currentStep, setCurrentStep] = useState(2);
  const [paymentStatus, setPaymentStatus] = useState('awaiting'); // 'awaiting' | 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [profile, setProfile] = useState(null);

  // Steps per flow
  const flowConfig = {
    consultation: { totalSteps: 5 },
    coaching: { totalSteps: 5 },
    pitchdeck: { totalSteps: 4 },
  };
  const totalSteps = formData.serviceType ? flowConfig[formData.serviceType].totalSteps : 0;

  // Derived price (EUR)
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

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await getProfile(user.id);
        setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  // Sync service from URL
  useEffect(() => {
    if (serviceFromUrl && serviceFromUrl !== formData.serviceType) {
      setFormData(prev => ({
        ...prev,
        serviceType: serviceFromUrl,
        coaching: { ...prev.coaching, plan: coachingPlanFromUrl || prev.coaching.plan },
      }));
      setCurrentStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceFromUrl, coachingPlanFromUrl]);

  // Read payment status from URL
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment_status') === 'success') setPaymentStatus('success');
  }, []);

  // Restore after Google sign-in
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('schedulingState');
      if (cached) {
        const { formData: savedFormData, currentStep: savedStep, scrollPosition } = JSON.parse(cached);
        if (savedFormData) setFormData(savedFormData);
        if (savedStep) setCurrentStep(savedStep);
        if (typeof scrollPosition === 'number') setTimeout(() => window.scrollTo(0, scrollPosition), 0);
        sessionStorage.removeItem('schedulingState');
      }
    } catch {}
  }, []);

  // Handlers
  const handleUpdateField = (section, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [fieldName]: value },
    }));
  };

  const handleCoachingPlanSelect = (planId) => {
    setFormData(prev => ({ ...prev, serviceType: 'coaching', coaching: { ...prev.coaching, plan: planId } }));
    navigate(`/schedule?service=coaching&plan=${planId}`, { replace: true });
    setCurrentStep(2);
  };

  const handlePitchDeckSelect = (deckId) => {
    setFormData(prev => ({ ...prev, serviceType: 'pitchdeck', pitchdeck: { ...prev.pitchdeck, type: deckId } }));
    navigate(`/schedule?service=pitchdeck`, { replace: true });
    setCurrentStep(2);
  };

  const handleSelectService = (serviceId) => {
    setFormData(prev => ({ ...prev, serviceType: serviceId }));
    navigate(`/schedule?service=${serviceId}`, { replace: true });
    setCurrentStep(2);
  };

  const handleNext = async () => {
    const { serviceType } = formData;

    // For Pitch Deck, submit when leaving Contact Info (step 3)
    if (serviceType === 'pitchdeck' && currentStep === 3) {
      try {
        setIsProcessing(true);
        await createPitchRequest({
          project: formData.pitchdeck.type,
          name: formData.contactInfo.name,
          email: formData.contactInfo.email,
          phone: formData.contactInfo.phone,
          user_id: user?.id || null,
        });
      } catch (e) {
        console.error('Pitch request insert failed:', e);
        alert('Sorry, we could not submit your request. Please try again.');
        setIsProcessing(false);
        return;
      }
      setIsProcessing(false);
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      navigate('/');
      return;
    }
    setCurrentStep(prev => prev - 1);
  };

  const handleInitiateCheckout = async () => {
    setIsProcessing(true);
    try {
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error('User is not authenticated.');

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ formData, userId: user.id, userEmail: user.email }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Failed to create checkout session.');
      }

      const { url: checkoutUrl } = await response.json();
      if (checkoutUrl) window.location.href = checkoutUrl;
      else throw new Error('Did not receive a checkout URL.');
    } catch (error) {
      console.error('Checkout initiation failed:', error);
      setIsProcessing(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      sessionStorage.setItem('schedulingState', JSON.stringify({
        formData,
        currentStep,
        scrollPosition: window.scrollY,
      }));
    } catch {}
    await signInWithGoogle();
  };

  // If no service chosen yet
  if (!formData.serviceType) {
    return (
      <div className="w-full">
        <div className="w-full max-w-2xl mx-auto p-8 space-y-4 rounded-xl shadow-xl hover:shadow-xl transition-shadow duration-200">
          <ServiceSelectionStep selectedService={null} onSelectService={handleSelectService} />
        </div>
      </div>
    );
  }

  // === MAIN PAGE AREA ===
  // NOTE: parent <main> (in Layout) must be the scroll container: flex-grow min-h-0 overflow-y-auto
  return (
    <div className="w-full h-full">
      {/* Fill the page area by default (min-h-full) and expand if needed (h-auto) */}
      <div className="w-full max-w-2xl mx-auto px-4 flex flex-col min-h-full h-auto">
        {/* Content: add bottom padding so nothing hides behind bars */}
        <div
          className="flex-1 space-y-4"
          style={{
            paddingBottom:
              'calc(var(--bottom-nav-h, 64px) + 64px /* step bar */ + env(safe-area-inset-bottom, 0px))',
          }}
        >
          {paymentStatus === 'success' ? (
            <ConfirmationStep />
          ) : (
            <>
              {/* Step 2 */}
              {currentStep === 2 && formData.serviceType === 'consultation' && (
                <ConsultationScheduleStep
                  consultationData={formData.consultation}
                  onUpdateField={(field, value) => handleUpdateField('consultation', field, value)}
                />
              )}
              {currentStep === 2 && formData.serviceType === 'coaching' && (
                <CoachingPlanStep
                  selectedPlan={formData.coaching.plan}
                  onSelectPlan={handleCoachingPlanSelect}
                />
              )}
              {currentStep === 2 && formData.serviceType === 'pitchdeck' && (
                <PitchDeckStep
                  selectedDeck={formData.pitchdeck.type}
                  onSelectDeck={handlePitchDeckSelect}
                />
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <ContactInfoStep
                  isLoggedIn={!!user}
                  contactInfoData={formData.contactInfo}
                  onUpdateField={(e) => handleUpdateField('contactInfo', e.target.name, e.target.value)}
                  onGoogleSignIn={handleGoogleSignIn}
                />
              )}

              {/* Step 4 - payment for consultation/coaching */}
              {currentStep === 4 && (formData.serviceType === 'consultation' || formData.serviceType === 'coaching') && (
                <PaymentStep
                  paymentStatus={paymentStatus}
                  formData={formData}
                  price={price}
                  onInitiateCheckout={handleInitiateCheckout}
                  isProcessing={isProcessing}
                />
              )}

              {/* Chatbot: step 4 for pitchdeck, step 5 for others */}
              {formData.serviceType === 'pitchdeck' && currentStep === 4 && <ChatbotStep />}
              {formData.serviceType !== 'pitchdeck' && currentStep === 5 && <ChatbotStep />}
            </>
          )}
        </div>

        {/* === STICKY STEP NAV (pins above global bottom nav) === */}
        {paymentStatus !== 'success' && formData.serviceType && currentStep >= 2 && (
          <div
            className="sticky mt-auto z-10"
            // Pin ABOVE the bottom nav; uses CSS var set from NavigationBar.jsx
            style={{ bottom: 'calc(var(--bottom-nav-h, 64px) + env(safe-area-inset-bottom, 0px))' }}
          >
            <div className="mx-auto w-full max-w-2xl px-4 flex items-center justify-between">
              {/* Back */}
              <motion.button
                onClick={handleBack}
                className="px-6 py-2 text-sm md:text-base font-semibold text-white bg-black rounded-md shadow-xl cursor-pointer"
                whileHover={{ scale: 1.06, transition: { duration: 0.08 } }}
                whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
                type="button"
              >
                {t('scheduling.backButton')}
              </motion.button>

              {/* Next */}
              {currentStep < totalSteps && (
                <motion.button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 2 && formData.serviceType === 'consultation' &&
                      (!formData.consultation.date || !formData.consultation.duration || !formData.consultation.time)) ||
                    (currentStep === 2 && formData.serviceType === 'coaching' && !formData.coaching.plan) ||
                    (currentStep === 2 && formData.serviceType === 'pitchdeck' && !formData.pitchdeck.type) ||
                    (currentStep === 3 && (!formData.contactInfo.name || !formData.contactInfo.email)) ||
                    (currentStep === 4 && (formData.serviceType === 'consultation' || formData.serviceType === 'coaching') && paymentStatus !== 'success') ||
                    isProcessing
                  }
                  className="px-6 py-2 text-sm md:text-base font-semibold text-black bg-[#BFA200] rounded-md shadow-xl cursor-pointer disabled:bg-opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.06, transition: { duration: 0.08 } }}
                  whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
                  type="button"
                >
                  {t('scheduling.nextButton')}
                </motion.button>
              )}

              {/* Finish (only on last step) */}
              {currentStep === totalSteps && (
                <motion.button
                  onClick={() => alert(t('scheduling.flowFinished'))}
                  className="px-6 py-2 text-sm md:text-base font-semibold text-black bg-[#BFA200] rounded-md shadow-xl cursor-pointer"
                  whileHover={{ scale: 1.06, transition: { duration: 0.08 } }}
                  whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
                  type="button"
                >
                  {t('scheduling.finishButton')}
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
