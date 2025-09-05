// src/components/common/LanguageMenu.jsx
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

export default function LanguageMenu({ languages, current, onSelect }) {
  return (
    <div
      className="absolute right-0 mt-6 w-44 bg-white rounded-md shadow-lg z-20 origin-top-right select-none"
      role="menu"
      aria-orientation="vertical"
    >
      <ul className="py-1">
        {languages.map((lang) => {
          const selected = current === lang.key;
          return (
            <li key={lang.key} role="none">
              <button
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => onSelect(lang.key)}
                className={`w-full text-left px-3 py-2 text-sm md:text-base
                            flex items-center justify-between gap-2
                            rounded-md cursor-pointer border border-transparent
                            transition-none
                            hover:bg-gray-100 focus-visible:bg-gray-100
                            ${selected ? 'text-gray-900' : 'text-gray-700'}`}
              >
                <span className="whitespace-nowrap">{lang.label}</span>
                <span className="w-5 h-5 shrink-0 inline-flex items-center justify-center">
                  {selected && <CheckIcon className="h-5 w-5 text-[#bfa200]" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
