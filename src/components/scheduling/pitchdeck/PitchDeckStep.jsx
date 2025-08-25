// src/components/scheduling/pitchdeck/PitchDeckStep.jsx

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import hooks

// 2. Remove the hardcoded 'pitchDecks' constant and unused icon imports.

/**
 * A "dumb" component for selecting a type of pitch deck.
 * @param {string} selectedDeck - The ID of the currently selected deck.
 * @param {function} onSelectDeck - Callback function to fire when a deck is selected.
 */
export default function PitchDeckStep({ selectedDeck, onSelectDeck }) {
    const { t } = useTranslation(); // 3. Initialize translation hook.

    // 4. Dynamically generate the pitchDecks array from the translation file.
    const pitchDecks = useMemo(() => 
        t('scheduling.pitchDeck.decks', { returnObjects: true }), 
        [t]
    );

    // RENDER LOGIC
    return (
        <div className="w-full">
            {/* 5. Use the translated title. */}
            <h2 className="text-xl font-bold text-center text-white mb-4 md:text-2xl md:mb-6">
                {t('scheduling.pitchDeck.title')}
            </h2>

            <div className="space-y-4">
                {/* 6. The map now iterates over the dynamically loaded pitchDecks. */}
                {pitchDecks.map((deck) => (
                    <div
                        key={deck.id}
                        onClick={() => onSelectDeck(deck.id)}
                        className={`
                            p-3 border rounded-lg cursor-pointer transition-all duration-200 md:p-4
                            ${selectedDeck === deck.id
                                ? 'border-2 border-[#BFA200] shadow-lg' // Active state
                                : 'border-2 border-[#BFA200] hover:border-[#BFA200] hover:bg-gray-50'
                            }
                        `}
                    >
                        {/* The icon has been removed as it wasn't being used in the original code */}
                        <h3 className="text-lg text-center text-white md:text-xl">{deck.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}