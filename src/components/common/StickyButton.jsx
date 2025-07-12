// src/components/common/StickyButton.jsx

import React, { useEffect, useState } from 'react';
import Button from './Button';

/**
 * StickyButton
 * -----------------------------------------------------------------------------
 * The button stays invisible (opacity 0) until **≥ 10 %** of the parent section
 * becomes visible in the viewport. From that point on it fades in to
 * opacity 100 and remains usable. When the visible portion of the section drops
 * below 10 %, the button fades out again and stops receiving pointer events.
 *
 * A console.log shows the current `intersectionRatio` so that you can verify
 * the observer behaviour in DevTools.
 *
 * @param {object}   props
 * @param {React.RefObject<HTMLElement>} props.containerRef – **Required.** Ref
 *        to the section we want to track (e.g. the Consultations section).
 * @param {Function} props.onClick  – Click handler passed through to the
 *        underlying `Button` component.
 * @param {ReactNode} props.children – Button label / children.
 * @param {string}   [props.className] – Extra Tailwind classes.
 */
export default function StickyButton({ containerRef, onClick, children, className }) {
  // ---------------------------------------------------------------------------
  // 1️⃣  Local state: is the section ≥ 10 % visible?
  // ---------------------------------------------------------------------------
  const [isVisible, setIsVisible] = useState(false);

  // ---------------------------------------------------------------------------
  // 2️⃣  Attach an Intersection Observer to the *section* (NOT a sentinel).
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.intersectionRatio >= 0.1);
      },
      {
        threshold: [0, 0.1],          // fire at 0 % and 10 %
        root: null,                   // viewport
        rootMargin: '0px 0px -80px 0px' // compensate for fixed navbar height
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [containerRef]);

  // ---------------------------------------------------------------------------
  // 3️⃣  Render sticky wrapper with animated opacity / translate.
  // ---------------------------------------------------------------------------
  return (
    <div
      className={`
        sticky bottom-[70px] w-full flex justify-center z-10
        transition-all duration-200 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-5' : 'opacity-0 translate-y-5 pointer-events-none'}
        ${className || ''}
      `}
    >
      <Button onClick={onClick}>{children}</Button>
    </div>
  );
}
