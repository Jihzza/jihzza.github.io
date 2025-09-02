// src/components/hero/Cards/InvestmentCard.jsx

import React from 'react';
import CtaButton from '../../ui/Button';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function InvestmentCard({ onScheduleClick }) {
  const { t } = useTranslation(); // 2. Initialize hook

  const handleCardClick = () => {
    document.getElementById('invest-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    onScheduleClick();
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-transparent border-2 md:border-3 border-[#BFA200] rounded-lg p-6 text-center flex flex-col items-center cursor-pointer h-full"
    >
      {/* 3. Use translation keys */}
      <h3 className="text-3xl font-bold text-white">{t('hero.services.investment.title')}</h3>

      <p className="text-white my-6 text-base md:text-lg">
        {t('hero.services.investment.description')}
      </p>

      <div className="w-full mt-auto flex flex-col justify-center items-center">
        <CtaButton onClick={handleButtonClick}>{t('hero.services.investment.button')}</CtaButton>
        <a href="#" className="inline-block mt-3 text-sm md:text-base text-white">
          {t('hero.services.investment.learnMore')}
        </a>
      </div>
    </div>
  );
}