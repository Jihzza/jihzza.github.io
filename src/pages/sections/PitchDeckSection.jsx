// src/pages/sections/PitchDeckSection.jsx
import React from 'react';

import SectionText from '../../components/common/SectionTextWhite';
import PitchDeckCard from '../../components/pitchdeck/PitchDeckCard';
import Button from '../../components/common/Button';

import Perspetiv from '../../assets/images/Perspectiv Banner.svg';
import GalowClub from '../../assets/images/Galow Banner.svg';

const pitchDecks = [
    { id: 'perspetiv', icon: Perspetiv, title: 'Perspectiv - AI Company', description: 'A tech startup helping businesses entering the automation age, with custom software solutions.' },
    { id: 'galowclub', icon: GalowClub, title: 'Galow - Success Club', description: 'A social club with real world activities and digital software to help successful people connect and achieve their dreams.' },
]

export default function PitchDeckSection() {
    return (
        <section className="max-w-4xl mx-auto py-8">
            <SectionText title="My Ventures" />

            <div className="grid grid-cols-1 gap-6">
                {pitchDecks.map((deck) => (
                    <PitchDeckCard
                        key={deck.id}
                        icon={deck.icon}
                        title={deck.title}
                        description={deck.description}
                    />
                ))}
            </div>
            <div className="mt-6">


            <SectionText title="Invest With Me">
                I'm constantly developing new projects and ventures. If you're interested in learning more about current and upcoming opportunities, request a pitch deck below.
            </SectionText>

            <div className="w-full mt-auto pt-10 flex flex-col items-center justify-center">
                <Button>Request Pitch Deck</Button>
            </div>
            </div>
        </section>
    )
}