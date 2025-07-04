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
    },
    {
        id: 'standard',
        title: 'Standard',
    },
    {
        id: 'premium',
        title: 'Premium',
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
export default function CoachingPlanStep({ selectedPlan, onSelectPlan }) {

    // RENDER LOGIC
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-center text- mb-4">Coaching Plan</h2>

            {/* We use a responsive grid to display the plan cards */}
            <div className="space-y-4 flex flex-col items-center">
                {/* We map over our `coachingPlans` array to render a card for each plan */}
                {coachingPlans.map((plan) => (
                    <div
                    key={plan.id}
                    onClick={() => onSelectPlan(plan.id)}
                    className={`
                        w-full max-w-sm p-3 border rounded-lg cursor-pointer transition-all duration-200
                        ${selectedPlan === plan.id
                            ? 'border-2 border-[#BFA200] shadow-lg'
                            : 'border-2 border-[#BFA200] hover:border-[#BFA200] hover:bg-gray-50'
                        }
                    `}
                >
                        {/* Plan Title */}
                        <h3 className="text-lg text-center text-white">{plan.title}</h3>


                    </div>
                ))}
            </div>
        </div>
    );
}
