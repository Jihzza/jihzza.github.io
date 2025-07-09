import React from 'react';
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import UpdateEmailForm from './AccountSettings/UpdateEmailForm';
import UpdatePasswordForm from './AccountSettings/UpdatePasswordForm';
import DeleteAccountSection from './AccountSettings/DeleteAccountSection';
import PrivacySettingsSection from './AccountSettings/PrivacySettingsSection'; // Import new component
import LegalLinksSection from './AccountSettings/LegalLinksSection'; // Import new component

const AccountSettingsPage = () => {
    return (
        <ProfileSectionLayout>
            <SectionTextBlack title="Account & Settings" />
            <div className="space-y-8">
                {/* Account Management */}
                <UpdateEmailForm />
                <UpdatePasswordForm />
                
                {/* Privacy & Data */}
                <PrivacySettingsSection />

                {/* Legal & Information */}
                <LegalLinksSection />

                {/* Danger Zone */}
                <DeleteAccountSection />
            </div>
        </ProfileSectionLayout>
    );
};

export default AccountSettingsPage;