// src/components/scheduling/PaymentStep.jsx

import React from 'react';
import { format } from 'date-fns';
import FormButton from '../common/Forms/FormButton';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

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
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Order Summary</h2>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                {/* Dynamically render summary based on service type */}
                {formData.serviceType === 'consultation' && (
                    <div>
                        <h3 className="text--lg font-semibold">Consultation</h3>
                        <p className="text-gray-600">Date: {format(formData.consultation.date, 'eeee, MMM d, yyyy')}</p>
                        <p className="text-gray-600">Time: {formData.consultation.time}</p>
                        <p className="text-gray-600">Duration: {formData.consultation.duration} minutes</p>
                    </div>
                )}

                {formData.serviceType === 'coaching' && (
                    <div>
                        <h3 className="text-lg font-semibold">Coaching Plan</h3>
                        <p className="text-gray-600 capitalize">Plan: {formData.coaching.plan}</p>
                    </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-8">Total</span>
                    <span className="text-xl font-bold text-indigo-600">{formatPrice(price)}</span>
                </div>
            </div>

            <div className="mt-8">
                <FormButton onClick={onInitiateCheckout} disabled={isProcessing} fullWidth>
                    {isProcessing ? 'Redirecting to payment...' : `Proceed to Pay ${formatPrice(price)}`}
                </FormButton>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">You will be redirected to Stripe to complete your payment.</p>
        </div>
    );
}