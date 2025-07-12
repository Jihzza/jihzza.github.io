// src/components/hero/Cards/ConsultationCard.jsx

import React from 'react';
import CtaButton from '../../common/Button';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function ConsultationCard({ onScheduleClick }) {
  const { t } = useTranslation(); // 2. Initialize hook

  const handleCardClick = () => {
    document.getElementById('consultations-section').scrollIntoView({ behavior: 'smooth' });
  }

  const handleButtonClick = (e) => {
    e.stopPropagation();
    onScheduleClick();
  };

  return (
    <div className="bg-transparent border border-2 border-[#BFA200] rounded-lg p-6 text-center flex flex-col items-center" onClick={handleCardClick}>
      {/* 3. Use translation keys */}
      <h3 className="text-3xl font-bold text-white">{t('hero.services.consultation.title')}</h3>
      
      <div className="my-6">
        <p className="text-3xl font-bold text-white">{t('hero.services.consultation.price')}</p>
        <p className="text-sm text-white mt-1">{t('hero.services.consultation.minDuration')}</p>
      </div>

      <div className="w-full mt-auto flex flex-col justify-center items-center">
        <CtaButton onClick={handleButtonClick}>{t('hero.services.consultation.button')}</CtaButton>
        <a href="#" className="inline-block mt-3 text-sm text-white">
          {t('hero.services.consultation.learnMore')}
        </a>
      </div>
    </div>
  );
}