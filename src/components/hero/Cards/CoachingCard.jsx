// src/components/hero/Cards/CoachingCard.jsx
import React, { useState } from 'react';
import Button from '../../ui/Button';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';

export default function CoachingCard({ onScheduleClick }) {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const tiers = [
    { id: 'basic', price: '40', planName: t('hero.services.coaching.tiers.basic'), billingCycle: 'm' },
    { id: 'standard', price: '90', planName: t('hero.services.coaching.tiers.standard'), billingCycle: 'm' },
    { id: 'premium', price: '230', planName: t('hero.services.coaching.tiers.premium'), billingCycle: 'm' },
  ];

  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const selectedTier = tiers.find(tier => tier.id === selectedPlanId);

  const buttonText = selectedTier
    ? `${t('hero.services.coaching.button')} - ${selectedTier.price}€/${selectedTier.billingCycle}`
    : t('hero.services.coaching.button');

  const handleCardClick = () => {
    document.getElementById('coaching-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    onScheduleClick?.(selectedTier?.id ?? null);
  };

  const handleTierClick = (e, planId) => {
    e.stopPropagation();
    setSelectedPlanId(prev => (prev === planId ? null : planId));
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="bg-transparent border-2 md:border-3 border-[#BFA200] rounded-2xl p-6 text-center flex flex-col items-center cursor-pointer h-full shadow-lg hover:shadow-xl transition-shadow duration-200"
      initial={prefersReduced ? false : { opacity: 0, y: 8 }}
      animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
      whileHover={prefersReduced ? undefined : { scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.12 }}
    >
      <h3 className="text-3xl font-bold text-white">{t('hero.services.coaching.title')}</h3>

      <div className="flex justify-center space-x-2 my-6 lg:my-0 lg:mt-6 lg:mb-2 w-full">
        {tiers.map((tier) => {
          const isSelected = selectedPlanId === tier.id;
          return (
            <motion.div
              key={tier.id}
              onClick={(e) => handleTierClick(e, tier.id)}
              className="border-2 md:border-3 border-[#BFA200] rounded-xl p-3 lg:p-2 flex-1 cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200"
              style={{ scale: isSelected ? 1.02 : 1 }}
              whileHover={prefersReduced ? undefined : { scale: isSelected ? 1.07 : 1.06 }}
              whileTap={{ scale: isSelected ? 1.02 : 0.95 }}
              transition={{ duration: 0.12 }}
            >
              <p className="font-bold text-white text-lg md:text-lg lg:text-lg">{tier.price}€</p>
              <p className="text-xs md:text-sm lg:text-xs text-white">{tier.planName}</p>
            </motion.div>
          );
        })}
      </div>

      <p className="text-sm text-white md:mb-3">{t('hero.services.coaching.spots')}</p>

      <div className="w-full mt-auto flex flex-col justify-center items-center">
        <Button onClick={handleButtonClick} className="cursor-pointer">{buttonText}</Button>
        <a
          href="#coaching-section"
          className="inline-block mt-3 text-sm md:text-base text-white cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          {t('hero.services.coaching.learnMore')}
        </a>
      </div>
    </motion.div>
  );
}
