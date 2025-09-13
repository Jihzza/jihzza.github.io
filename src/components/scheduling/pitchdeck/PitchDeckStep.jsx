// src/components/scheduling/pitchdeck/PitchDeckStep.jsx

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FormTitle from '../../common/FormsTitle';

export default function PitchDeckStep({ selectedDeck, onSelectDeck }) {
  const { t } = useTranslation();

  const pitchDecks = useMemo(
    () => t('scheduling.pitchDeck.decks', { returnObjects: true }),
    [t]
  );

  return (
    <div className="w-full">
      <FormTitle title={t('scheduling.pitchDeck.title')} />

      {/* Match CoachingPlanStep container: centered column */}
      <div className="space-y-4 flex flex-col items-start">
        {pitchDecks.map((deck) => {
          const isSelected = selectedDeck === deck.id;
          const baseScale = isSelected ? 1.06 : 1;
          const hoverScale = 1.03;

          return (
            <motion.button
              key={deck.id}
              type="button"
              onClick={() => onSelectDeck(deck.id)}
              aria-pressed={isSelected ? 'true' : 'false'}
              animate={{ scale: baseScale }}
              whileHover={{ scale: hoverScale }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.04 }}
              className={`
                w-full max-w-sm p-3 border rounded-lg cursor-pointer transition-all duration-200 md:p-4
                ${isSelected
                  ? 'border-2 border-[#BFA200] shadow-xl'
                  : 'border-2 border-[#BFA200] hover:border-[#BFA200] hover:shadow-lg transition-shadow duration-200'
                }
              `}
            >
              <h3 className="text-lg text-center text-white md:text-xl">{deck.title}</h3>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
