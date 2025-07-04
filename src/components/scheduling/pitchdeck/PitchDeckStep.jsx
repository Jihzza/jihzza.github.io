// src/pages/pitchdeck/PitchDeckStep.jsx

import React from 'react';
// Importing some icons to make the UI more descriptive
import { PresentationChartBarIcon, UserGroupIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

// COMPONENT DATA
// Define the types of pitch decks available for selection
const pitchDecks = [
    {
        id: 'Perspectiv',
        title: 'Perspectiv',
    },
    {
        id: 'GalowClub',
        title: 'Galow Club',
    },
];

// COMPOENNT DEFINITION

/**
 * A "dumb" component for selecting a type of pitch deck
 * @param {string} selectedDeck - The ID of the currently selected deck
 * @param {function} onSelectDeck - Callback function to fire when a deck is selected
 */
export default function PitchDeckStep({ selectedDeck, onSelectDeck }) {
    // RENDER LOGIC
    return (
        <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-center text- mb-4">Request Pitch Deck</h2>

            <div className="space-y-4">
                {pitchDecks.map((deck) => (
                    <div
                        key={deck.id}
                        onClick={() => onSelectDeck(deck.id)}
                        className={`
                            p-3 border rounded-lg cursor-pointer transition-all duration-200
                            ${selectedDeck === deck.id
                                ? 'border-2 border-[#BFA200] shadow-lg' // Active state
                                : 'border-2 border-[#BFA200] hover:border-[#BFA200] hover:bg-gray-50'
                            }
                            `}
                            >
                                {deck.icon}
                                <h3 className="text-lg text-center text-white">{deck.title}</h3>
                            </div>
                ))}
            </div>
        </div>
    );
}