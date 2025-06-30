// src/components/common/InfoBlock.jsx

import React from 'react';

/**
 * A reusable component to display a central icon with text below it.
 * This is designed as a "dumb" presentational component. It receives all
 * its data via props and is not aware of the application's state.
 *
 * @param {string} iconSrc - The require()'d source path for the icon image.
 * @param {string} altText - The alternative text for the icon for accessibility (A11y).
 * @param {React.ReactNode} children - The content (usually text) to display below the icon.
 */
export default function InfoBlock({ iconSrc, altText, children }) {
  // RENDER LOGIC
  return (
    // We use a flex container to center the content.
    // - `flex flex-col`: Stacks children vertically.
    // - `items-center`: Centers children horizontally.
    // - `space-y-4`: Adds vertical spacing between the icon and the text.
    <div className="flex flex-col items-center space-y-2">

      {/* The icon is displayed here. Its size is controlled by Tailwind classes. */}
      <img
        src={iconSrc}
        alt={altText}
        className="w-4" // A medium, distinct size for the icon.
      />

      {/* The text content passed in as children is rendered here. */}
      {/* We ensure the text is centered and has a constrained width for readability. */}
      <div className="text-black text-xs text-center max-w-md">
        {children}
      </div>

    </div>
  );
}