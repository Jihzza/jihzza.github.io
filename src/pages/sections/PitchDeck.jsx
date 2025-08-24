// Coaching.jsx
import { useRef } from "react";
import SectionCta from "../../components/ui/SectionCta";
import SectionText from "../../components/ui/SectionText";
import PitchDeckCard from '../../components/pitchdeck/PitchDeckCard';

import Button from "../../components/ui/Button";
import { useTranslation } from 'react-i18next';
import Perspetiv from '../../assets/images/Perspectiv Banner.svg';
import GalowClub from '../../assets/images/Galow Banner.svg';

export default function Consultations({onBookPitchDeck }) {
    const sectionRef = useRef(null);
    const { t } = useTranslation();

    const pitchDecks = t('pitchDeck.decks', { returnObjects: true }).map((deck, index) => ({
        ...deck,
        id: ['perspetiv', 'galowclub'][index],
        icon: [Perspetiv, GalowClub][index]
    }));
    return (
        <section ref={sectionRef} className="w-full max-w-5xl flex flex-col justify-center items-center mx-auto py-4 space-y-4">
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

            <SectionText title={t('pitchDeck.investTitle')}>
                {t('pitchDeck.investSubtitle')}
            </SectionText>

            <SectionCta sectionRef={sectionRef}>
            <Button onClick={onBookPitchDeck}>{t('pitchDeck.buttonText')}</Button>
            </SectionCta>
        </section>
    );
}