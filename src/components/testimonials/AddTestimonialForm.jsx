// src/components/testimonials/AddTestimonialForm.jsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function AddTestimonialForm({ onSubmit, isSubmitting, profileData }) {
    const { t } = useTranslation(); // 2. Initialize hook
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (profileData) {
            reset({ name: profileData.username });
        }
    }, [profileData, reset]);

    const handleFormSubmit = (data) => {
        const imageFile = data.image && data.image[0] ? data.image[0] : null;
        onSubmit({ name: data.name, content: data.content }, imageFile);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
                {profileData?.avatar_url && (
                    <img
                        src={profileData.avatar_url}
                        alt="Current profile"
                        className="h-20 w-20 rounded-full object-cover border-2 border-[#bfa200]"
                    />
                )}
                <div className="flex-1">
                    {/* 3. Use translated text */}
                    <label htmlFor="image" className="block text-sm font-medium text-white">
                        {profileData?.avatar_url ? t('addTestimonial.changePhoto') : t('addTestimonial.uploadPhoto')} {t('addTestimonial.optional')}
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

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">{t('addTestimonial.yourNameLabel')}</label>
                <Input
                    id="name"
                    type="text"
                    {...register('name', { required: t('addTestimonial.yourNameRequired') })}
                    className="mt-1"
                    readOnly
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-white">{t('addTestimonial.testimonialLabel')}</label>
                <textarea
                    id="content"
                    rows="4"
                    {...register('content', {
                        required: t('addTestimonial.testimonialRequired'),
                        maxLength: { value: 120, message: t('addTestimonial.testimonialMaxLength') }
                    })}
                    className="w-full px-3 py-2 border-2 border-[#BFA200] rounded-md shadow-sm mt-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
            </div>

            <FormButton type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? t('addTestimonial.submitting') : t('addTestimonial.submitButton')}
            </FormButton>
        </form>
    );
}