// src/components/bugReport/BugReportForm.jsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // 1. Import hook
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';

export default function BugReportForm({ onSubmit, isLoading, defaultValues = {} }) {
    const { t } = useTranslation(); // 2. Initialize hook
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    // 3. Render form with translated text
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">{t('bugReport.form.name.label')}</label>
                <Input
                    id="name"
                    type="text"
                    {...register('name', { required: t('bugReport.form.name.required') })}
                />
                {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">{t('bugReport.form.email.label')}</label>
                <Input 
                    id="email"
                    type="email"
                    {...register('email', { required: t('bugReport.form.email.required') })}
                />
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-white">{t('bugReport.form.description.label')}</label>
                <textarea
                    id="description"
                    rows="4"
                    {...register('description', { required: t('bugReport.form.description.required') })}
                    className="mt-2 block w-full px-3 py-2 border border-[#BFA200] rounded-md shadow-sm placeholder-gray-400 bg-transparent text-white"
                    placeholder={t('bugReport.form.description.placeholder')}
                />
                {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <FormButton type="submit" isLoading={isLoading} fullWidth>
                {t('bugReport.form.submitButton')}
            </FormButton>
        </form>
    );
}