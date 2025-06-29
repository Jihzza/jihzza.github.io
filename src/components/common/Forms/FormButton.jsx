// src/components/common/Forms/FormButton.jsx

import React from 'react';

/**
 * A styled button for use within forms.
 *
 * @param {boolean} fullWidth - If true, the button will take up the full width of its container.
 * @param {React.Node} children - The content of the button.
 * @param {object} rest - Any other props to be passed to the underlying button element (e.g., type, onClick, disabled).
 */
// 1. We destructure `fullWidth` from the props object here.
export default function FormButton({ children, fullWidth, ...rest }) {
  // 2. We use the `fullWidth` variable to conditionally apply the 'w-full' class.
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      // 3. The `...rest` object now contains all props EXCEPT `fullWidth`,
      //    so our custom prop is no longer passed to the DOM element.
      {...rest}
      className={`
        ${widthClass}
        flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
        text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
}