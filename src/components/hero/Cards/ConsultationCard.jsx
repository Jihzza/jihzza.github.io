// src/components/hero/Cards/ConsultationCard.jsx
import React from 'react';
import Button from '../../ui/Button';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';

export default function ConsultationCard({ onScheduleClick }) {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const handleCardClick = () => {
    document.getElementById('consultations-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    onScheduleClick?.();
  };

  return (
    <motion.div
      className="bg-transparent border-2 md:border-3 border-[#BFA200] rounded-2xl p-6 text-center flex flex-col items-center cursor-pointer h-full shadow-lg hover:shadow-xl transition-shadow duration-200"
      onClick={handleCardClick}
      initial={prefersReduced ? false : { opacity: 0, y: 8 }}
      animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
      whileHover={prefersReduced ? undefined : { scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.12 }}
    >
      <h3 className="text-3xl font-bold text-white">{t('hero.services.consultation.title')}</h3>

      <div className="my-8 justify-center items-center flex flex-col">
        <p className="text-3xl font-bold text-white">{t('hero.services.consultation.price')}</p>
        <p className="text-sm md:text-base text-white mt-1">{t('hero.services.consultation.minDuration')}</p>
      </div>

      <div className="w-full mt-auto flex flex-col justify-center items-center">
        <Button onClick={handleButtonClick} className="cursor-pointer">
          {t('hero.services.consultation.button')}
        </Button>
        <a href="#consultations-section" className="inline-block mt-3 text-sm md:text-base text-white cursor-pointer" onClick={(e)=>e.stopPropagation()}>
          {t('hero.services.consultation.learnMore')}
        </a>
      </div>
    </motion.div>
  );
}
