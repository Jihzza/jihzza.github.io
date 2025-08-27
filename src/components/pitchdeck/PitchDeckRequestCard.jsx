// src/components/pitchdeck/PitchDeckRequestCard.jsx
import React from 'react';
import { DocumentArrowDownIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const STATUS_MAP = {
  submitted: { label: 'Submitted', cls: 'bg-blue-100 text-blue-800' },
  'in review': { label: 'In Review', cls: 'bg-yellow-100 text-yellow-800' },
  in_review: { label: 'In Review', cls: 'bg-yellow-100 text-yellow-800' },
  feedback_sent: { label: 'Feedback Sent', cls: 'bg-green-100 text-green-800' },
  archived: { label: 'Archived', cls: 'bg-gray-100 text-gray-800' },
};

function normalizeStatus(raw) {
  if (!raw) return STATUS_MAP.archived;
  const key = String(raw).toLowerCase();
  return STATUS_MAP[key] || { label: String(raw), cls: STATUS_MAP.archived.cls };
}

export default function PitchDeckRequestCard({ request }) {
  const { t } = useTranslation();

  // Accept both API shapes: { company_name, submitted_at } or { project, created_at, name }
  const company =
    request?.company_name ??
    request?.project ??
    request?.name ??
    t('pitchDeckRequest.untitled', 'Untitled');

  const submittedAt = request?.submitted_at ?? request?.created_at ?? null;
  const formattedDate = submittedAt ? new Date(submittedAt).toLocaleDateString() : '—';

  const { label: statusLabel, cls: statusCls } = normalizeStatus(request?.status);
  const fileUrl = request?.file_url || null;
  const canDownload = Boolean(fileUrl);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800 md:text-2xl lg:text-xl">{company}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1 md:text-base lg:text-sm">
            <ClockIcon className="h-4 w-4 mr-1.5 md:h-6 md:w-6 lg:h-5 lg:w-5" />
            {t('pitchDeckRequest.submittedOn', 'Submitted on')} {formattedDate}
          </div>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize md:text-base lg:text-sm ${statusCls}`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
