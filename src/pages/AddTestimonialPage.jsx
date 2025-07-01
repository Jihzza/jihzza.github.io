// src/pages/AddTestimonialPage.jsx

// This page component manages the state and logic for submitting a new testimonial.
// It now redirects immediately upon successful submission.

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddTestimonialForm from '../components/testimonials/AddTestimonialForm';

export default function AddTestimonialPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (testimonialData, imageFile) => {
        if (!user) {
            setError("You must be logged in to submit a testimonial.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const { error: createError } = await createTestimonial(
            { ...testimonialData, userId: user.id },
            imageFile
        );

        if (createError) {
            setIsLoading(false);
            setError(createError.message);
        } else {
            // --- CHANGE: On success, navigate directly to the home page. ---
            // The loading state is not turned off, as the component will unmount upon navigation.
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
            {/* --- CHANGE: Removed the conditional rendering for the success message. --- */}
            {/* The component will now always display the form until it redirects. */}
            <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-xl shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Leave a Testimonial
                    </h2>
                    <AddTestimonialForm onSubmit={handleSubmit} isLoading={isLoading} />
                    {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
}