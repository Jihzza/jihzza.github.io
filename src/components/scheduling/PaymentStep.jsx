// src/components/scheduling/PaymentStep.jsx

import React from 'react';
import { format } from 'date-fns';
import FormButton from '../common/Forms/FormButton';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

import StripeLogo from '../../assets/images/stripe.svg';
import SSLLogo from '../../assets/images/ssl.svg';

// A helper to format currency
const formatPrice = (amount) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

/**
 * Renders the payment summary and initiates checkout or shows a success message
 * @param {string} paymentStatus - 'awaiting', 'success', or 'cancelled'.
 * @param {object} formData - The complete form data to derive summary details
 * @param {number} price - The calculated price for the service
 * @param {function} onInitiateCheckout - Callback to start the Stripe checkout process
 * @param {boolean} isProcessing - Flag to disable the button while communicating with the server
 */
export default function PaymentStep({ paymentStatus, formData, price, onInitiateCheckout, isProcessing }) {
    // RENDER LOGIC: Cancelled View
    if (paymentStatus === 'cancelled') {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Cancelled</h2>
                <p className="text-gray-600 mt-2">Your payment was cancelled. You can try again.</p>
                {/* Th esame button allows the user to retry the checkout process */}
                <div className="mt-6">
                <FormButton onClick={onInitiateCheckout} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Pay ${formatPrice(price)}`}
                </FormButton>
                </div>
            </div>
            
        )
    }

    // RENDER LOGIC: Default / Awaiting Payment View
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-center text- mb-4">Order Summary</h2>

            <div className="border-2 border-[#BFA200] p-6 rounded-lg space-y-4">
                {/* Dynamically render summary based on service type */}
                {formData.serviceType === 'consultation' && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Consultation</h3>
                        <p className="text-white">Date: {format(formData.consultation.date, 'eeee, MMM d, yyyy')}</p>
                        <p className="text-white">Time: {formData.consultation.time}</p>
                        <p className="text-white">Duration: {formData.consultation.duration} minutes</p>
                    </div>
                )}

                {formData.serviceType === 'coaching' && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Coaching Plan</h3>
                        <p className="text-white capitalize">Plan: {formData.coaching.plan}</p>
                    </div>
                )}

                <div className="border-t border-[#333333] pt-4 flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-[#BFA200]">{formatPrice(price)}</span>
                </div>
            </div>

            <div className="p-6 rounded-lg flex space-x-4 items-center justify-center">
                <img src={StripeLogo} alt="Stripe Logo" className="w-15 justify-center" />
                <img src={SSLLogo} alt="SSL Logo" className="w-10 justify-center " />

            </div>

            <div>
                <FormButton onClick={onInitiateCheckout} disabled={isProcessing} fullWidth>
                    {isProcessing ? 'Redirectingt...' : `Proceed to Checkout`}
                </FormButton>
            </div>
            <p className="text-center text-xs text-white mt-4">You will be redirected to Stripe to complete your payment.</p>
        </div>
    );
}