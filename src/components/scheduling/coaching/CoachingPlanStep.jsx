// src/components/scheduling/coaching/CoachingPlanStep.jsx

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import hooks

// 2. Remove the hardcoded 'coachingPlans' and 'formatPrice' constants.

/**
 * A dumb component for selecting a coaching plan.
 * @param {string} selectedPlan - The ID of the currently selected plan ('basic', 'standard', or 'premium')
 * @param {function} onSelectPlan - A callback function that fires when a plan is selected
 */
export default function CoachingPlanStep({ selectedPlan, onSelectPlan }) {
    const { t } = useTranslation(); // 3. Initialize translation hook

    // 4. Dynamically create the coachingPlans array from the translation file.
    //    We use useMemo to prevent this array from being recalculated on every render.
    const coachingPlans = useMemo(() => 
        t('scheduling.coachingPlan.plans', { returnObjects: true }), 
        [t]
    );

    return (
        <div className="w-full">
            {/* 5. Use the translated title */}
            <h2 className="text-xl font-bold text-center text-white mb-4">
                {t('scheduling.coachingPlan.title')}
            </h2>

            <div className="space-y-4 flex flex-col items-center">
                {/* 6. The mapping logic remains the same, but it now uses the dynamic `coachingPlans` array */}
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
                        <h3 className="text-lg text-center text-white">{plan.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}