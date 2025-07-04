// src/hooks/useIntersectionObserver.js

import { useState, useEffect, useRef } from 'react';

/**
 * A reusable React Hook to observe an element's intersection with the viewport.
 * This hook encapsulates the Intersection Observer API for clean, declarative use in components.
 *
 * @param {object} [options] - Configuration options for the IntersectionObserver (e.g., root, rootMargin, threshold).
 * @returns {[React.RefObject<HTMLElement>, IntersectionObserverEntry | null]} - A tuple containing:
 * - `ref`: A ref object to attach to the DOM element you want to observe.
 * - `entry`: The latest IntersectionObserverEntry object, or null if not intersecting.
 * This entry contains data like `isIntersecting`, `boundingClientRect`, etc.
 */
export default function useIntersectionObserver(options) {
    // `entry` will hold the latest intersection data from the observer.
    const [entry, setEntry] = useState(null);

    // The ref that will be attached to the element we want to observe.
    const ref = useRef(null);

    // We serialize the options object to a JSON string.
    // This is a crucial optimization. It ensures that our useEffect below
    // only re-runs if the options *actually* change, not just on every render.
    const frozenOptions = JSON.stringify(options);

    useEffect(() => {
        const node = ref?.current; // The DOM element to observe.

        // We only proceed if the element to observe actually exists.
        if (!node) return;

        // Create the observer instance with a callback that updates our state.
        const observer = new IntersectionObserver(([firstEntry]) => {
            // This callback fires whenever the observed element's intersection status changes.
            // We update our component's state with the new entry.
            setEntry(firstEntry);
        }, options);

        // Start observing the target element.
        observer.observe(node);

        // This is the cleanup function. It runs when the component unmounts
        // or when the dependencies of the useEffect hook change.
        // It's vital for preventing memory leaks.
        return () => {
            if (node) {
                // Stop observing the element to clean up resources.
                observer.unobserve(node);
            }
        };
    }, [ref, frozenOptions]); // Dependencies array: the effect will re-run if the ref or options change.

    return [ref, entry];
}