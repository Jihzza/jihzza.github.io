// src/pages/profile/AccountSettingsPage.jsx

import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import hook
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';
import SectionTextWhite from '../../components/common/SectionTextWhite';
import UpdateEmailForm from './AccountSettings/UpdateEmailForm';
import UpdatePasswordForm from './AccountSettings/UpdatePasswordForm';
import DeleteAccountSection from './AccountSettings/DeleteAccountSection';
import PrivacySettingsSection from './AccountSettings/PrivacySettingsSection';
import LegalLinksSection from './AccountSettings/LegalLinksSection';

const AccountSettingsPage = () => {
    const { t } = useTranslation(); // 2. Initialize hook

    return (
        <div className="bg-gradient-to-b from-[#002147] to-[#ECEBE5]">
            <ProfileSectionLayout>
                {/* 3. Use translated title */}
                <SectionTextWhite title={t('accountSettings.pageTitle')} />
                <div className="space-y-8">
                    <UpdateEmailForm />
                    <UpdatePasswordForm />
                    <PrivacySettingsSection />
                    <LegalLinksSection />
                    <DeleteAccountSection />
                </div>
            </ProfileSectionLayout>
        </div>
    );
};

export default AccountSettingsPage;