import React, { useRef, useState } from 'react';
import SectionText from '../../components/common/SectionTextWhite';
import ServicesDetailBlock from '../../components/ServiceSections/ServicesDetailBlock';
import TierCards from '../../components/coaching/TierCards';
import ExpandableGrid from '../../components/common/ExpandableGrid';
import StickyButton from '../../components/common/StickyButton';
import { useTranslation } from 'react-i18next'; // 1. Import hook

// ICON IMPORTS (These remain unchanged)
import SocialMediaIcon from '../../assets/icons/Phone Branco.svg';
import BusinessIcon from '../../assets/icons/Business Branco.svg';
import OnlyFansIcon from '../../assets/icons/OnlyFans Branco.svg';
import DatingIcon from '../../assets/icons/Dating Branco.svg';
import HabitsIcon from '../../assets/icons/Habits Branco.svg';
import StocksIcon from '../../assets/icons/Stocks Branco.svg';
import PersonalTrainerIcon from '../../assets/icons/PersonalTrainer Branco.svg';
import StockResearcherIcon from '../../assets/icons/MoneyBag Branco.svg';
import AnytimeCommsIcon from '../../assets/icons/AnytimeComms Preto.svg';
import ResponseIcon from '../../assets/icons/Response Preto.svg';
import ClassesIcon from '../../assets/icons/Classes Preto.svg';

export default function CoachingSection({ onBookCoaching }) {
    const { t } = useTranslation(); // 2. Initialize hook
    const sectionRef = useRef(null);

    // State management remains the same
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [selectedCoachingType, setSelectedCoachingType] = useState(null);

    // --- DATA FETCHING FROM TRANSLATIONS ---

    // 3. Define local icon arrays to map to translated data
    const coachingTypeIcons = [StocksIcon, PersonalTrainerIcon, DatingIcon, OnlyFansIcon, BusinessIcon, HabitsIcon, SocialMediaIcon, StockResearcherIcon];
    const coachingDetailIcons = [AnytimeCommsIcon, ResponseIcon, ClassesIcon];

    // 4. Load data from i18n and map icons
    const coachingTypes = t('coaching.types', { returnObjects: true }).map((type, index) => ({
        ...type,
        id: index + 1,
        icon: coachingTypeIcons[index]
    }));

    const coachingDetails = t('coaching.details', { returnObjects: true }).map((detail, index) => ({
        ...detail,
        icon: coachingDetailIcons[index]
    }));

    // Tiers data now includes the translated plan descriptions
    const tiers = t('coaching.tiers', { returnObjects: true }).map((tier, index) => ({
        ...tier,
        id: ['basic', 'standard', 'premium'][index],
        price: [40, 90, 230][index],
        billingCycle: 'm',
    }));

    // Dynamically create the button map from translations
    const buttonKeys = ["invest", "trainer", "dating", "onlyfans", "advisor", "habits", "manager", "researcher"];
    const buttonTextMap = buttonKeys.reduce((acc, key, index) => {
        acc[index + 1] = t(`coaching.buttons.${key}`);
        return acc;
    }, {});


    // --- DERIVED STATE & HANDLERS (Logic remains the same, but uses translated data) ---
    const selectedTier = tiers.find(tier => tier.id === selectedPlanId);
    
    let buttonText = t('coaching.buttons.default');
    if (selectedCoachingType) {
        buttonText = buttonTextMap[selectedCoachingType.id];
        if (selectedTier) {
            buttonText += ` - ${selectedTier.price}€/${selectedTier.billingCycle}`;
        }
    }

    const handleBookClick = () => {
        if (selectedCoachingType && selectedTier) {
            onBookCoaching({
                coachingType: selectedCoachingType,
                tier: selectedTier
            });
        }
    }

    return (
        <section id="coaching-section" ref={sectionRef} className="max-w-4xl mx-auto py-4">
            <SectionText title={t('coaching.title')}>
                {t('coaching.subtitle')}
            </SectionText>

            <ExpandableGrid items={coachingTypes} onItemSelected={setSelectedCoachingType} />

            <div className="mt-10 space-y-8">
                {coachingDetails.map((detail) => (
                    <ServicesDetailBlock
                        key={detail.title}
                        icon={detail.icon}
                        title={detail.title}
                        description={detail.description}
                    />
                ))}
            </div>

            <TierCards
                tiers={tiers}
                selectedPlanId={selectedPlanId}
                onTierSelect={setSelectedPlanId}
            />

            <StickyButton containerRef={sectionRef} onClick={handleBookClick} disabled={!(selectedCoachingType && selectedTier)}>
                {buttonText}
            </StickyButton>
        </section>
    );
}