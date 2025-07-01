// src/pages/profile/AccountSettingsPage.jsx

import React from 'react';
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import UpdateEmailForm from './AccountSettings/UpdateEmailForm';
import UpdatePasswordForm from './AccountSettings/UpdatePasswordForm';
import DeleteAccountSection from './AccountSettings/DeleteAccountSection';

const AccountSettingsPage = () => {
    return (
        <ProfileSectionLayout>
                <SectionTextBlack title="Account & Settings" />
            <div className="space-y-8">
                <UpdateEmailForm />
                <UpdatePasswordForm />
                <DeleteAccountSection />
            </div>
        </ProfileSectionLayout>
    );
};

export default AccountSettingsPage;