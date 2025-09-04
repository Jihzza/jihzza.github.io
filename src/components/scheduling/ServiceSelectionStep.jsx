// src/components/scheduling/ServiceSelectionStep.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // ← added

// --- COMPONENT DEFINITION ---
const services = [
  { id: 'consultation', title: 'Consultations'},
  { id: 'coaching', title: 'Coaching' },
  { id: 'pitchdeck', title: 'Pitch Deck' },
];

export default function ServiceSelectionStep({ selectedService, onSelectService }) {
  const navigate = useNavigate();
  const { t } = useTranslation(); // ← added

  const handleServiceClick = (serviceId) => {
    navigate(`/schedule?service=${serviceId}`);
    if (onSelectService) onSelectService(serviceId);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceClick(service.id)}
            className={`
              p-3 border rounded-lg cursor-pointer transition-all duration-200 md:p-4
              ${selectedService === service.id
                ? 'border-2 border-[#BFA200] shadow-lg'
                : 'border-2 border-[#BFA200] hover:border-[#BFA200] hover:bg-gray-50'
              }
            `}
          >
            {/* use i18n label by id */}
            <h3 className="text-lg text-center text-white md:text-xl">
              {t(`scheduling.serviceSelection.serviceLabels.${service.id}`)}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
