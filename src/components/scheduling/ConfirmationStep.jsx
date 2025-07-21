// src/components/scheduling/ConfirmationStep.jsx

import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

export default function ConfirmationStep() {
    return (
        <div className="text-center text-white p-8 animate-fade-in">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-300 mb-6">Your appointment has been confirmed. You will receive an email confirmation shortly.</p>
            <Link 
                to="/profile/appointments" 
                className="px-6 py-3 bg-[#BFA200] text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
            >
                View My Appointments
            </Link>
        </div>
    );
}