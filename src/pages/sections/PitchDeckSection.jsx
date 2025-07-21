// src/pages/sections/PitchDeckSection.jsx
import React, { useRef } from 'react';
import SectionText from '../../components/common/SectionTextWhite';
import PitchDeckCard from '../../components/pitchdeck/PitchDeckCard';
import StickyButton from '../../components/common/StickyButton';
import { useTranslation } from 'react-i18next';

import Perspetiv from '../../assets/images/Perspectiv Banner.svg';
import GalowClub from '../../assets/images/Galow Banner.svg';

export default function PitchDeckSection({ onBookPitchDeck }) {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    const pitchDecks = t('pitchDeck.decks', { returnObjects: true }).map((deck, index) => ({
        ...deck,
        id: ['perspetiv', 'galowclub'][index],
        icon: [Perspetiv, GalowClub][index]
    }));

    return (
        <section ref={sectionRef} id="invest-section" className="max-w-4xl mx-auto py-4">
            <SectionText title={t('pitchDeck.title')} />

            <div className="flex flex-col md:flex-row gap-6 md:px-6">
                {pitchDecks.map((deck) => (
                    // --- MODIFICATION START ---
                    // By adding `flex` here, this div becomes a flex container.
                    // Its direct child (the card) will now stretch to fill this
                    // container's height by default. `flex-1` handles the equal width.
                    <div key={deck.id} className="flex flex-1">
                        <PitchDeckCard
                            icon={deck.icon}
                            title={deck.title}
                            description={deck.description}
                        />
                    </div>
                    // --- MODIFICATION END ---
                ))}
            </div>

            <div className="mt-6 md:px-6">
                <SectionText title={t('pitchDeck.investTitle')}>
                    {t('pitchDeck.investSubtitle')}
                </SectionText>
            </div>

            <StickyButton containerRef={sectionRef} onClick={onBookPitchDeck}>
                {t('pitchDeck.buttonText')}
            </StickyButton>
        </section>
    );
}