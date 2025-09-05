import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageButton from './LanguageButton';
import LanguageMenu from './LanguageMenu';

const languages = [
  { key: 'en', label: 'English' },
  { key: 'es', label: 'Español' },
  { key: 'pt-PT', label: 'Português PT' },
  { key: 'pt-BR', label: 'Português BR' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click or Esc
  useEffect(() => {
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKeyDown = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const selectLang = (key) => { i18n.changeLanguage(key); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      <LanguageButton onClick={() => setOpen(v => !v)} ariaExpanded={open} />
      {open && (
        <LanguageMenu
          languages={languages}
          current={i18n.language}
          onSelect={selectLang}
        />
      )}
    </div>
  );
}
