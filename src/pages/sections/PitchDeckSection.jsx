// src/pages/sections/PitchDeckSection.jsx
import React, { useRef } from 'react';
import SectionText from '../../components/common/SectionTextWhite';
import PitchDeckCard from '../../components/pitchdeck/PitchDeckCard';
import StickyButton from '../../components/common/StickyButton';
import { useTranslation } from 'react-i18next'; // 1. Import hook

// Keep icon imports, as they are not translatable
import Perspetiv from '../../assets/images/Perspectiv Banner.svg';
import GalowClub from '../../assets/images/Galow Banner.svg';

export default function PitchDeckSection({ onBookPitchDeck }) {
    const { t } = useTranslation(); // 2. Initialize hook
    const sectionRef = useRef(null);

    // 3. Load translated deck data and map the static icons
    const pitchDecks = t('pitchDeck.decks', { returnObjects: true }).map((deck, index) => ({
        ...deck,
        id: ['perspetiv', 'galowclub'][index], // Keep original IDs
        icon: [Perspetiv, GalowClub][index]   // Map icons by order
    }));

    return (
        // The id="invest-section" is important for anchor links
        <section ref={sectionRef} id="invest-section" className="max-w-4xl mx-auto py-4">
            {/* 4. Use translated title */}
            <SectionText title={t('pitchDeck.title')} />

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
                {/* 5. Use translated subtitle and body */}
                <SectionText title={t('pitchDeck.investTitle')}>
                    {t('pitchDeck.investSubtitle')}
                </SectionText>
            </div>

            {/* 6. Use translated button text */}
            <StickyButton containerRef={sectionRef} onClick={onBookPitchDeck}>
                {t('pitchDeck.buttonText')}
            </StickyButton>
        </section>
    );
}