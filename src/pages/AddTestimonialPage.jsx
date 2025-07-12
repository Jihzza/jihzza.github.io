// src/pages/AddTestimonialPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createTestimonial } from '../services/testimonialService';
import { getProfile } from '../services/profileService';
import AddTestimonialForm from '../components/testimonials/AddTestimonialForm';
import SectionTextWhite from '../components/common/SectionTextWhite';

export default function AddTestimonialPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const { data, error: fetchError } = await getProfile(user.id);
                if (fetchError) {
                    setError('Could not load your profile. Please try again later.');
                } else {
                    setProfileData(data);
                }
            };
            fetchProfile();
        }
    }, [user]);

    const handleSubmit = async (testimonialData, imageFile) => {
        if (!user) {
            setError("You must be logged in to submit a testimonial.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const fullData = {
            ...testimonialData,
            userId: user.id,
            existingAvatarUrl: profileData?.avatar_url,
        };

        const { error: createError } = await createTestimonial(fullData, imageFile);

        if (createError) {
            setError(createError.message);
            setIsSubmitting(false);
        } else {
            navigate('/');
        }
    };

    // The container is now simplified. It will inherit the background and height from the main Layout component.
    return (
        <div className="w-full max-w-lg mx-auto p-8 space-y-8 bg-gradient-to-b from-[#002147] to-[#ECEBE5] h-full">
            <SectionTextWhite title="Leave a Testimonial" />
            
            <AddTestimonialForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                profileData={profileData}
            />
            
            {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
        </div>
    );
}