// src/components/scheduling/ServiceSelectionStep.jsx

import React from 'react';

// --- COMPONENT DEFINITION ---
// This is a "dumb" component. It doesn't know what step it is, nor does it manage any state.
// It simply renders the options it's told to and notifies a parent component when an option is selected.

// We define the service options as an array of objects outside the component.
// This is efficient because this data is static and doesn't need to be recreated on every render.
const services = [
  { id: 'consultation', title: 'Consultations'},
  { id: 'coaching', title: 'Coaching' },
  { id: 'pitchdeck', title: 'Pitch Deck' },
];

/**
 * @param {string} selectedService - The ID ('consultation', 'coaching', 'pitchdeck') of the currently selected service.
 * @param {function} onSelectService - A callback function to be executed when the user clicks on a service option. It receives the service ID as an argument.
 */
export default function ServiceSelectionStep({ selectedService, onSelectService }) {
  // --- RENDER (JSX) ---
  return (
    <div className="w-full max-w-2xl mx-auto">
      
      <div className="space-y-4">
        {/*
          We map over our `services` array to render a selectable card for each service.
          This is a core React pattern that keeps our JSX clean and scalable. If we add a new service, we just update the array, not the JSX.
        */}
        {services.map((service) => (
          <div
            // The `key` prop is essential for React's rendering performance and identity tracking in lists.
            key={service.id}
            // We call the `onSelectService` prop passed down from the parent when this div is clicked.
            onClick={() => onSelectService(service.id)}
            // Here we dynamically apply CSS classes. This is the key to showing the "selected" state.
            // If the service's ID matches the `selectedService` prop, we apply a blue border and background; otherwise, we use default gray styling.
            className={`
              p-3 border rounded-lg cursor-pointer transition-all duration-200 md:p-4
              ${selectedService === service.id
                ? 'border-2 border-[#BFA200] shadow-lg' // Active state
                : 'border-2 border-[#BFA200] hover:border-[#BFA200] hover:bg-gray-50' // Inactive state
              }
            `}
          >
            <h3 className="text-lg text-center text-white md:text-xl">{service.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}