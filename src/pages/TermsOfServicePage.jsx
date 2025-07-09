import React from 'react';
import ProfileSectionLayout from '../components/profile/ProfileSectionLayout';
import SectionTextBlack from '../components/common/SectionTextBlack';

export default function TermsOfServicePage() {
  return (
    <ProfileSectionLayout>
        <SectionTextBlack title="Terms of Service" />
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 prose prose-sm md:prose-base max-w-none">
            <p className="lead">Last updated: July 09, 2025</p>

            <p>Please read these Terms of Service ("Terms") carefully before using the DaGalow website and services operated by DaGalow ("we," "us," or "our").</p>

            <h4>1. Acceptance of Terms</h4>
            <p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>

            <h4>2. User Accounts</h4>
            <p>You are responsible for safeguarding your account password and for all activities that occur under your account. You must provide accurate and complete information and notify us immediately of any unauthorized use.</p>

            <h4>3. Payments and Subscriptions</h4>
            <p>For paid services, you agree to pay all fees based on the billing terms in effect. Subscriptions will automatically renew until cancelled at least 24 hours before the end of the current billing period.</p>
            
            <h4>4. Limitation of Liability</h4>
            <p>In no event shall DaGalow be liable for any indirect, incidental, special, consequential or punitive damages, including loss of profits, data, or goodwill.</p>

            <h4>5. Contact Us</h4>
            <p>If you have any questions about these Terms, please contact us at terms@dagalow.com</p>
        </div>
    </ProfileSectionLayout>
  );
};