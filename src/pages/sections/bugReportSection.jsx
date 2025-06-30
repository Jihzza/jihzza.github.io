// src/pages/sections/BugReportSection.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile } from '../../services/authService';
import { submitBugReport } from '../../services/bugReportService';
import { useNavigate } from 'react-router-dom';

import SectionTextBlack from '../../components/common/SectionTextBlack';
import BugReportForm from '../../components/bugReport/BugReportForm';
import Signup from '../../components/auth/Signup'; // Import the "dumb" signup form

/**
 * A "smart" section component that handles the logic for bug reporting.
 * - If the user is authenticated, it displays the BugReportForm.
 * - If the user is logged out, it displays a Signup form to encourage registration.
 * - It manages form submission state (loading, error, success).
 */
export default function BugReportSection() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formDefaults, setFormDefaults] = useState({ name: '', email: '' });

    // When the component loads, if the user is logged in, fetch their profile
    // to pre-fill the name and email fields for a better user experience.
    useEffect(() => {
        if (isAuthenticated && user) {
            // Set the email from the auth user object immediately.
            setFormDefaults(prev => ({ ...prev, email: user.email }));

            const fetchProfile = async () => {
                const { data: profileData } = await getProfile(user.id);
                if (profileData?.full_name) {
                    setFormDefaults(prev => ({ ...prev, name: profileData.full_name }));
                }
            };
            fetchProfile();
        }
    }, [user, isAuthenticated]);

    // This handler is for the Bug Report form submission.
    const handleBugSubmit = async (formData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const { error: submissionError } = await submitBugReport(formData, user?.id);

        if (submissionError) {
            setError(submissionError.message);
        } else {
            setSuccess(true);
        }
        setIsLoading(false);
    };
    
    // This handler is for the Signup form, it is not implemented in this component,
    // so we'll just navigate to the main signup page for a consistent experience.
    const handleSignupRequest = () => {
        navigate('/signup');
    };

    return (
        <section className="max-w-4xl mx-auto py-8 text-center">
            <SectionTextBlack title="Help Me Improve">
            As the website is in beta, your feedback is crucial. Please provide detailed information about any issues you've encountered to help us enhance the user experience.
            </SectionTextBlack>

            <div className="mt-8 mx-auto w-full max-w-lg bg-[#002147] p-8 rounded-lg shadow-md">
                {/* This is the core conditional logic based on authentication state */}
                {isAuthenticated ? (
                    // USER IS LOGGED IN
                    success ? (
                        // Show a success message after submission
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-green-600">Thank You!</h3>
                            <p className="text-gray-700 mt-2">Your bug report has been submitted successfully. We appreciate your help in making our platform better.</p>
                            <button onClick={() => setSuccess(false)} className="mt-4 text-indigo-600 hover:underline">Submit another report</button>
                        </div>
                    ) : (
                        // Show the bug report form
                        <BugReportForm
                            onSubmit={handleBugSubmit}
                            isLoading={isLoading}
                            defaultValues={formDefaults}
                        />
                    )
                ) : (
                    // USER IS LOGGED OUT
                    <div>
                        <p className="text-center text-gray-700 mb-4">
                            To report a bug, please create an account first. This helps us track issues and follow up with you.
                        </p>
                        {/* We pass a dummy onSubmit to the Signup component. 
                          A better approach for a truly embedded signup would be to implement the full signup logic here,
                          but for simplicity and to reuse the main signup page's logic, we can just use it as a visual placeholder
                          that encourages the user to go to the real signup page.
                        */}
                        <Signup onSubmit={handleSignupRequest} isLoading={false} />
                    </div>
                )}
                {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
            </div>
        </section>
    );
}