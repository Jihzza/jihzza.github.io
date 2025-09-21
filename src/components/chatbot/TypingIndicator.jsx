import React from 'react';

export default function TypingIndicator({ label = 'Typing' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center">
        <span className="typing-pulse bg-[#BFA200]/20" />
        <span className="typing-pulse typing-pulse-delay bg-[#BFA200]/30" />
        <span className="typing-pulse typing-pulse-delay-2 bg-[#BFA200]/40" />
        <span className="sr-only">{label}</span>
      </div>
      <span className="opacity-80 text-sm">{label}</span>
    </div>
  );
}


