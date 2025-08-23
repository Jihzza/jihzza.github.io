import React, { useRef, useState } from 'react';
import SectionText from '../../components/common/SectionTextWhite';
import ServicesDetailBlock from '../../components/ServiceSections/ServicesDetailBlock';
import TierCards from '../../components/coaching/TierCards';
import ExpandableGrid from '../../components/common/ExpandableGrid';
import StickyButton from '../../components/common/StickyButton';
import { useTranslation } from 'react-i18next';

// ICON IMPORTS
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
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  // Local state
  const [selectedPlanId, setSelectedPlanId] = useState(null); // 'basic' | 'standard' | 'premium'
  const [selectedCoachingType, setSelectedCoachingType] = useState(null); // object from types

  // --- Data from i18n --------------------------------------------------------
  const coachingTypeIcons = [
    StocksIcon,            // invest
    PersonalTrainerIcon,   // trainer
    DatingIcon,            // dating
    OnlyFansIcon,          // onlyfans
    BusinessIcon,          // advisor
    HabitsIcon,            // habits
    SocialMediaIcon,       // manager
    StockResearcherIcon    // researcher
  ];

  const coachingDetailIcons = [AnytimeCommsIcon, ResponseIcon, ClassesIcon];

  // Types
  const coachingTypes = (t('coaching.types', { returnObjects: true }) || []).map((type, index) => ({
    ...type,
    id: index + 1,
    icon: coachingTypeIcons[index],
  }));

  // Details
  const coachingDetails = (t('coaching.details', { returnObjects: true }) || []).map((detail, index) => ({
    ...detail,
    icon: coachingDetailIcons[index],
  }));

  // Tiers
  const tiers = (t('coaching.tiers', { returnObjects: true }) || []).map((tier, index) => ({
    ...tier,
    id: ['basic', 'standard', 'premium'][index],
    price: [40, 90, 230][index],
    billingCycle: 'm', // month
  }));

  // Button text map for type-only selection (fallback)
  const buttonKeys = ['invest', 'trainer', 'dating', 'onlyfans', 'advisor', 'habits', 'manager', 'researcher'];
  const buttonTextMap = buttonKeys.reduce((acc, key, index) => {
    acc[index + 1] = t(`coaching.buttons.${key}`);
    return acc;
  }, {});

  // --- Derived state ---------------------------------------------------------
  const selectedTier = tiers.find((tier) => tier.id === selectedPlanId) || null;

  // Button text:
  // 1) If a tier is selected, mirror CoachingCard CTA: "Schedule Coaching - {price}€/{cycle}"
  // 2) Else if only a type is selected, use the type-specific button from the map
  // 3) Else use default
  let buttonText = t('coaching.buttons.default');
  if (selectedTier) {
    buttonText = `${t('hero.services.coaching.button')} - ${selectedTier.price}€/${selectedTier.billingCycle}`;
  } else if (selectedCoachingType) {
    buttonText = buttonTextMap[selectedCoachingType.id];
  }

  // --- Handlers --------------------------------------------------------------
  const handleBookClick = () => {
    onBookCoaching?.(selectedTier ?? null);
  };

  return (
    <section id="coaching-section" ref={sectionRef} className="max-w-4xl mx-auto py-4 md:px-6">
      <SectionText title={t('coaching.title')}>{t('coaching.subtitle')}</SectionText>

      {/* Types grid */}
      <ExpandableGrid items={coachingTypes} onItemSelected={setSelectedCoachingType} />

      {/* Details list */}
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

      {/* Tier cards */}
      <TierCards tiers={tiers} selectedPlanId={selectedPlanId} onTierSelect={setSelectedPlanId} />

      {/* Sticky CTA */}
      <StickyButton
        containerRef={sectionRef}
        onClick={handleBookClick}
      >
        {buttonText}
      </StickyButton>
    </section>
  );
}