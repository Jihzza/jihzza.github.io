// src/components/testimonials/AddTestimonialForm.jsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';

/**
 * @param {function} onSubmit - The callback function.
 * @param {boolean} isSubmitting - A flag for the submission process.
 * @param {object} profileData - The pre-fetched user profile data.
 */
export default function AddTestimonialForm({ onSubmit, isSubmitting, profileData }) {
    // 1. Initialize `useForm`. We can set defaultValues directly here, but using `reset` in an effect is more robust for async data.
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // 2. `useEffect` to populate the form once `profileData` is available.
    // This is the recommended approach for setting form values from an async source.
    useEffect(() => {
        if (profileData) {
            // `reset` updates the form's values.
            reset({
                name: profileData.username, // Pre-fill the name
                // We don't pre-fill the testimonial content.
            });
        }
    }, [profileData, reset]); // This effect runs whenever profileData or reset changes.

    const handleFormSubmit = (data) => {
        const imageFile = data.image && data.image[0] ? data.image[0] : null;
        onSubmit({ name: data.name, content: data.content }, imageFile);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
                {/* 3. Display Existing Profile Picture */}
                {profileData?.avatar_url && (
                    <img
                        src={profileData.avatar_url}
                        alt="Current profile"
                        className="h-20 w-20 rounded-full object-cover border-2 border-[#bfa200]"
                    />
                )}
                <div className="flex-1">
                    <label htmlFor="image" className="block text-sm font-medium text-white">
                        {profileData?.avatar_url ? 'Change Photo' : 'Upload Photo'} (Optional)
                    </label>
                    <Input
                        id="image"
                        type="file"
                        {...register('image')}
                        accept="image/*"
                        className="mt-1"
                    />
                </div>
            </div>

            {/* 4. Name Input - now pre-populated */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">Your Name</label>
                <Input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Your name is required.' })}
                    className="mt-1" // A slightly different background can indicate it's pre-filled
                    readOnly // Make the name read-only to ensure data consistency
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Testimonial Content - remains the same */}
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-white">Testimonial</label>
                <textarea
                    id="content"
                    rows="4"
                    {...register('content', {
                        required: 'Testimonial content is required.',
                        maxLength: { value: 120, message: 'Testimonial cannot exceed 120 characters.' }
                    })}
                    className="w-full px-3 py-2 border-2 border-[#BFA200] rounded-md shadow-sm mt-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
            </div>

            <FormButton type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
            </FormButton>
        </form>
    );
}