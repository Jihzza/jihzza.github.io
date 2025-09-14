// src/components/layout/LanguageMenu.jsx

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function LanguageMenu({ open, topOffset, languages, currentKey, onSelect, onRequestClose, anchorRef }) {
  const menuRef = useRef(null);

  // Close on outside click, but allow clicks on the anchor (globe) and menu
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      const target = e.target;
      const insideMenu = menuRef.current && menuRef.current.contains(target);
      const insideAnchor = anchorRef?.current && anchorRef.current.contains(target);
      if (!insideMenu && !insideAnchor) onRequestClose?.();
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') onRequestClose?.();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onRequestClose, anchorRef]);

  if (!open) return null;

  const normalized = (currentKey || '').toLowerCase();

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ top: `${topOffset}px` }}
      className="fixed inset-x-0 z-50"
    >
      <div className="absolute inset-0"></div>
      <div className="relative w-full py-3">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar px-4">
          {languages.map((lang) => {
            const keyLower = lang.key.toLowerCase();
            const isSelected = normalized === keyLower || normalized.startsWith(keyLower + '-');
            return (
              <motion.button
                key={lang.key}
                onClick={() => onSelect?.(lang.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200
                  border-[2px] border-[#bfa200] whitespace-nowrap flex-shrink-0
                  flex items-center gap-2
                  ${isSelected ? 'bg-[#002147] text-[#bfa200] shadow-lg' : 'bg-[#002147] text-white hover:text-[#bfa200]'}
                `}
              >
                <img src={lang.flag} alt={`${lang.label} flag`} className="w-4 h-3 object-contain" />
                {lang.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}


