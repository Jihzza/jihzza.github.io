// src/pages/profile/AccountSettingsPage.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';
import SectionTextWhite from '../../components/common/SectionTextWhite';
import UpdateEmailForm from './AccountSettings/UpdateEmailForm';
import UpdatePasswordForm from './AccountSettings/UpdatePasswordForm';
import DeleteAccountSection from './AccountSettings/DeleteAccountSection';
import PrivacySettingsSection from './AccountSettings/PrivacySettingsSection';
import LegalLinksSection from './AccountSettings/LegalLinksSection';

const AccountSettingsPage = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-[#002147] ">
      <ProfileSectionLayout>
        <div className="pt-6 sm:pt-8">
          <SectionTextWhite title={t('accountSettings.pageTitle')} />
        </div>

        <div className="mx-auto max-w-3xl lg:px-8 pb-12 space-y-6">
          <UpdateEmailForm />
          <UpdatePasswordForm />
          <PrivacySettingsSection />
          <LegalLinksSection />
          <DeleteAccountSection />
        </div>
      </ProfileSectionLayout>
    </main>
  );
};

export default AccountSettingsPage;
