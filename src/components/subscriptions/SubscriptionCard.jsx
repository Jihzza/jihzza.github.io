// src/components/subscriptions/SubscriptionCard.jsx
import React from 'react';

export default function SubscriptionCard({ subscription }) {
  if (!subscription) return null;

  const {
    id,
    plan_id,
    status,
    created_at,
    current_period_end,
    stripe_subscription_id,
  } = subscription;

  const formatDate = (v) => {
    if (!v) return '—';
    const d = new Date(v);
    return isNaN(d.getTime())
      ? '—'
      : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-base font-semibold text-slate-900">
            {plan_id || 'Subscription'}
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
          {(status || 'unknown').replaceAll('_', ' ')}
        </span>
      </div>

      {/* Key info */}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="bg-white rounded-lg p-3 border border-[#002147]">
          <div className="text-xs uppercase tracking-wide text-black font-semibold">Next billing</div>
          <div className="mt-0.5 text-sm font-medium text-black/50">
            {formatDate(current_period_end)}
          </div>
        </div>
        <div className="bg-white border border-[#002147] rounded-lg p-3">
          <div className="text-xs uppercase tracking-wide text-black font-semibold">Started</div>
          <div className="mt-0.5 text-sm font-medium text-black/50">
            {formatDate(created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
