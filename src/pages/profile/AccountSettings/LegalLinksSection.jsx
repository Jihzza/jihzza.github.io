// src/pages/profile/AccountSettings/LegalLinksSection.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, ShieldCheckIcon, ScaleIcon } from '@heroicons/react/24/outline';
import SettingsSectionHeader from '../AccountSettings/SettingsSectionHeader';
import { useTranslation } from 'react-i18next';

const LegalLink = ({ to, label, icon: Icon }) => (
  <Link
    to={to}
    className="flex items-center justify-between p-4 rounded-xl  transition-colors duration-150"
  >
    <div className="flex items-center gap-3">
      {Icon && (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#002147]/5">
          <Icon className="h-5 w-5 text-[#002147]" />
        </span>
      )}
      <span className="text-sm text-gray-800 md:text-base">{label}</span>
    </div>
    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
  </Link>
);

export default function LegalLinksSection() {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 ">
      <SettingsSectionHeader title={t('accountSettings.legal.title')} />
      <nav className="divide-y divide-gray-200">
        <LegalLink
          to="/privacy-policy"
          label={t('accountSettings.legal.privacyPolicy')}
          icon={ShieldCheckIcon}
        />
        <LegalLink
          to="/terms-of-service"
          label={t('accountSettings.legal.termsOfService')}
          icon={ScaleIcon}
        />
      </nav>
    </section>
  );
}
