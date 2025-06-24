// src/components/scheduling/coaching/CoachingPlanStep.jsx

import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

// COMPONENT DATA
// We define the plan details outside the component for performance and clarity
// This array is our single source of truth for what plans are available
const coachingPlans = [
    {
        id: 'basic',
        title: 'Basic Plan',
        price: 40,
    },
    {
        id: 'standard',
        title: 'Standard',
        price: 90,
    },
    {
        id: 'premium',
        title: 'Premium',
        price: 240,
    },
];

// A helper to format currency
const formatPrice = (amount) => Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

// COMPOENNT DEFINITION
/**
 * A dumb component for selecting a coaching plan.
 * @param {string} selectedPlan - The ID of the currently selected plan ('basic', standard or premium)
 * @param {function} onSelectPlan - A callback function that fires when a plan is selected
 */
export default function CoachingPlanStep({ selectedPlan, onSelectedPlan }) {

    // RENDER LOGIC
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Choose Your Coaching Plan</h2>
            <p className="text-center text-gray-500 mb-8">Select a plan that best fits  your needs and goals.</p>
            
            {/* We use a responsive grid to display the plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* We map over our `coachingPlans` array to render a card for each plan */}
                {coachingPlans.map((plan) => (
                    <div 
                        key={plan.id}
                        onClick={() => onSelectPlan(plan.id)}
                        // The dynamic className is the key to the interactive feel
                        // It changes the border color and adds a shadow to the selected plan
                        className={`
                            p-6 border rounded-lg cursor-pointer transition-all duration-200 flex flex-col
                            ${selectedPlan === plan.id
                                ? 'border-indigo-600 shadow-xl scale-105' // Active state
                                : 'border-gray-300 bg-white hover:border-indigo-400' // Inactive State
                            }
                            `}
                            >
                                {/* Plan Title */}
                                <h3 className="text-xl font-semibold text-center text-gray-900">{plan.title}</h3>

                                {/* Price Display */}
                                <div className="text-center my-4">
                                    <span className="text-4xl font-bold text-gray-800">{formatPrice(plan.price)}</span>
                                    <span className="text-md text-gray-500">/month</span>
                                </div>
                            </div>
                ))}
            </div>
        </div>
    );
}
