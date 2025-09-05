// src/components/common/SectionNavigator.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable nav for switching sections.
 * Accepts either `activeSectionId` (preferred) or `activeSection` (back-compat).
 */
export default function SectionNavigator({
  sections,
  activeSectionId,
  activeSection,           // ← back-compat with older callers
  onSelectSection,
  className = '',
}) {
  const activeId = activeSectionId ?? activeSection;

  return (
    <div className={`flex justify-start items-center gap-2 h-auto ${className}`}>
      {sections.map((section) => {
        const isActive = activeId === section.id;
        const baseScale = isActive ? 1.06 : 1;
        const hoverScale = isActive ? 1.09 : 1.06;

        return (
          <motion.button
            key={section.id}
            type="button"
            onClick={() => onSelectSection(section.id)}
            aria-current={isActive ? 'true' : undefined}
            className={[
              // keep your original sizing/shape
              'px-3 py-1 rounded-lg text-sm md:px-4 md:py-2 md:text-lg lg:px-3 lg:py-1',
              // colors for active/inactive (removed scale-105 utility; Motion handles scale)
              isActive
                ? 'bg-[#BFA200] text-black shadow-lg'
                : 'bg-transparent text-black border-2 border-[#BFA200] hover:bg-[#BFA200] hover:text-black',
              // hand cursor for obvious clickability
              'cursor-pointer',
              // focus ring stays for a11y
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/70',
            ].join(' ')}
            // header-like micro-interactions
            animate={{ scale: baseScale }}
            whileHover={{ scale: hoverScale }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.12 }}
          >
            {section.label}
          </motion.button>
        );
      })}
    </div>
  );
}
