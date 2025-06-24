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
        description: 'A pitch deck for a startup that is focused on AI solutions and automation tools',
    },
    {
        id: 'GalowClub',
        title: 'Galow Club',
        description: 'A pitch deck for a startup that is focused on a social club that organizing events for people to meet and connect',
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
        <div className="w-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Request Pitch Deck</h2>
            <p className="text-center text-gray-500 mb-8">Choose the type of presentation you need</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pitchDecks.map((deck) => (
                    <div
                        key={deck.id}
                        onClick={() => onSelectDeck(deck.id)}
                        className={`
                            p-6 border rounded-lg cursor-pointer text-center transition-all duration-200
                            ${selectedDeck === deck.id
                                ? 'border-indigo-600 bg-indigo-50 shadow-xl' // Active state
                                : 'border-gray-300 bg-white hover:border-indigo-400' // Ina
                            }
                            `}
                            >
                                {deck.icon}
                                <h3 className="text-lg font-semibold text-gray-800">{deck.title}</h3>
                                <p className="text-sm text-gray-600 mt-2">{deck.description}</p>
                            </div>
                ))}
            </div>
        </div>
    );
}