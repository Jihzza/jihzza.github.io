// src/components/scheduling/ServiceSelectionStep.jsx

import React from 'react';

// --- COMPONENT DEFINITION ---
// This is a "dumb" component. It doesn't know what step it is, nor does it manage any state.
// It simply renders the options it's told to and notifies a parent component when an option is selected.

// We define the service options as an array of objects outside the component.
// This is efficient because this data is static and doesn't need to be recreated on every render.
const services = [
  { id: 'consultation', title: 'Consultations', description: 'Schedule a one-on-one session to discuss your project.' },
  { id: 'coaching', title: 'Coaching', description: 'Get ongoing mentorship with a structured program.' },
  { id: 'pitchdeck', title: 'Pitch Deck', description: 'Request a professionally designed pitch deck.' },
];

/**
 * @param {string} selectedService - The ID ('consultation', 'coaching', 'pitchdeck') of the currently selected service.
 * @param {function} onSelectService - A callback function to be executed when the user clicks on a service option. It receives the service ID as an argument.
 */
export default function ServiceSelectionStep({ selectedService, onSelectService }) {
  // --- RENDER (JSX) ---
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        How can we help you today?
      </h2>
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
              p-6 border rounded-lg cursor-pointer transition-all duration-200
              ${selectedService === service.id
                ? 'border-indigo-600 bg-indigo-50 shadow-lg' // Active state
                : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50' // Inactive state
              }
            `}
          >
            <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}