// src/components/hero/Cards/InvestmentCard.jsx
import React from 'react';
import Button from '../../ui/Button';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';

export default function InvestmentCard({ onScheduleClick }) {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const handleCardClick = () => {
    document.getElementById('invest-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    onScheduleClick?.();
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
      <h3 className="text-3xl font-bold text-white">{t('hero.services.investment.title')}</h3>

      <p className="text-white my-6 text-base md:text-lg">
        {t('hero.services.investment.description')}
      </p>

      <div className="w-full mt-auto flex flex-col justify-center items-center">
        <Button onClick={handleButtonClick} className="cursor-pointer">
          {t('hero.services.investment.button')}
        </Button>
        <a href="#invest-section" className="inline-block mt-3 text-sm md:text-base text-white cursor-pointer" onClick={(e)=>e.stopPropagation()}>
          {t('hero.services.investment.learnMore')}
        </a>
      </div>
    </motion.div>
  );
}
