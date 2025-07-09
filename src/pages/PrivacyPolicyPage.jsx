import React from 'react';
import ProfileSectionLayout from '../components/profile/ProfileSectionLayout';
import SectionTextBlack from '../components/common/SectionTextBlack';

export default function PrivacyPolicyPage() {
  return (
    <ProfileSectionLayout>
        <SectionTextBlack title="Privacy Policy" />
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 prose prose-sm md:prose-base max-w-none">
            <p className="lead">Last updated: July 09, 2025</p>

            <p>At DaGalow, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.</p>

            <h4>1. Information We Collect</h4>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
                <li>Personal information (name, email address, phone number)</li>
                <li>Profile information</li>
                <li>Payment and transaction information</li>
                <li>Communications you send to us</li>
                <li>Usage information and interaction with our services</li>
            </ul>

            <h4>2. How We Use Your Information</h4>
            <p>We use your information to:</p>
            <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Personalize your experience</li>
                <li>Monitor and analyze trends and usage</li>
            </ul>

            <h4>3. Sharing of Information</h4>
            <p>We may share your information with service providers who perform services on our behalf, payment processors, professional advisors, and when required by law or to protect rights.</p>
            
            <h4>4. Your Rights</h4>
            <p>Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal data. You may also have the right to withdraw consent.</p>

            <h4>5. Contact Us</h4>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@dagalow.com</p>
        </div>
    </ProfileSectionLayout>
  );
};