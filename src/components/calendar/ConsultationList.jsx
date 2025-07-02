// src/components/consultations/ConsultationList.jsx

import React from 'react';
import AppointmentCard from '../appointments/AppointmentCard';

export default function ConsultationList({ appointments, title }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      {appointments.length === 0 ? (
        // The styling is now cleaner, without a dashed border.
        <div className="text-center py-10">
          <p className="text-gray-500 text-base">No appointments scheduled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(app => (
            <AppointmentCard key={app.id} appointment={app} />
          ))}
        </div>
      )}
    </div>
  );
}