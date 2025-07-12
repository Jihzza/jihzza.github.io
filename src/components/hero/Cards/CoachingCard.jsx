// src/components/hero/Cards/CoachingCard.jsx

import React, { useState } from 'react';
import CtaButton from '../../common/Button';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function CoachingCard({ onScheduleClick }) {
  const { t } = useTranslation(); // 2. Initialize hook

  // 3. Update the tiers array to use translated plan names
  const tiers = [
    { id: 'basic', price: '40', planName: t('hero.services.coaching.tiers.basic'), billingCycle: 'm' },
    { id: 'standard', price: '90', planName: t('hero.services.coaching.tiers.standard'), billingCycle: 'm' },
    { id: 'premium', price: '230', planName: t('hero.services.coaching.tiers.premium'), billingCycle: 'm' },
  ];

  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const selectedTier = tiers.find(tier => tier.id === selectedPlanId);

  // 4. Update button text logic to use translations
  const buttonText = selectedTier
    ? `${t('hero.services.coaching.button')} - ${selectedTier.price}€/${selectedTier.billingCycle}`
    : t('hero.services.coaching.selectPlan');

  const handleCardClick = () => {
    document.getElementById('coaching-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (selectedTier) {
      onScheduleClick(selectedTier);
    }
  };

  const handleTierClick = (e, planId) => {
    e.stopPropagation();
    setSelectedPlanId(planId);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-transparent border-2 border-[#BFA200] rounded-lg p-6 text-center flex flex-col items-center cursor-pointer"
    >
      <h3 className="text-3xl font-bold text-white">{t('hero.services.coaching.title')}</h3>
      
      <div className="flex justify-center space-x-2 my-6 w-full">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            onClick={(e) => handleTierClick(e, tier.id)}
            className={`
              border-2 border-[#BFA200] rounded-md p-3 flex-1 cursor-pointer
              transition-transform duration-300 ease-in-out
              ${selectedPlanId === tier.id ? 'scale-110' : ''}
            `}
          >
            <p className="font-bold text-white text-lg">{tier.price}€</p>
            <p className="text-xs text-white">{tier.planName}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-white">{t('hero.services.coaching.spots')}</p>

      <div className="w-full mt-auto flex flex-col justify-center items-center">
        <CtaButton onClick={handleButtonClick}>{buttonText}</CtaButton>
        <a href="#coaching-section" className="inline-block mt-3 text-sm text-white" onClick={(e) => e.stopPropagation()}>
          {t('hero.services.coaching.learnMore')}
        </a>
      </div>
    </div>
  );
}