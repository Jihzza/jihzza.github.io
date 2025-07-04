// src/components/common/StickyButton.jsx

import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import Button from './Button'; // We reuse your existing common Button.

/**
 * A button that remains "sticky" at the bottom of the screen as long as a target
 * container is visible, and then "docks" at the bottom of that container.
 *
 * @param {object} props
 * @param {React.RefObject<HTMLElement>} props.containerRef - A ref to the parent container section that this button belongs to.
 * @param {function} props.onClick - The function to call when the button is clicked.
 * @param {React.ReactNode} props.children - The content for the button.
 * @param {string} [props.className] - Optional additional classes for the wrapper div.
 */
export default function StickyButton({ containerRef, onClick, children, className }) {
    // --- Observer Hook ---
    // We use our custom hook to watch the container section.
    // `entry` will give us information like `isIntersecting`.
    // We set a `threshold` of 0, meaning the observer will fire as soon as a single pixel
    // of the container is visible. The `rootMargin` pushes the "bottom" of the observer's
    // boundary up by 80px, preventing the button from overlapping with your main navigation bar.
    const [sentinelRef, entry] = useIntersectionObserver({
        threshold: 0,
        rootMargin: "0px 0px -80px 0px"
    });

    // Determine if the button should be in its "sticky" (fixed) state.
    // It is sticky if the observer entry exists and its `isIntersecting` property is true.
    const isSticky = entry?.isIntersecting;

    return (
        <>
            {/*
              The Sentinel:
              This is a zero-height, zero-width div that we place inside the container.
              This is the element our IntersectionObserver will actually watch.
              It acts as an invisible tripwire. When this sentinel scrolls into view,
              the observer fires.
            */}
            <div ref={sentinelRef} />

            {/*
              The Button Wrapper:
              This div handles the positioning and animation of the button.
            */}
            <div
                className={`
                    sticky bottom-5 w-full flex justify-center z-30
                    transition-all duration-300 ease-in-out
                    ${isSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}
                    ${className || ''}
                `}
            >
                {/* We render your existing, reusable Button component inside our smart wrapper. */}
                <Button onClick={onClick}>
                    {children}
                </Button>
            </div>
        </>
    );
}