// src/components/bugReport/BugReportForm.jsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';

/**
 * It manages its own form state with react-hook-form but delegates
 * the submission logix to a parent component via the onSubmit prop
 * 
 * @param {function} onSubmit - The function to call when the form is submitted
 * @param {boolean} isLoading - Whether the form is currently submitting
 * @param {object} [defaultValues={}] - The default values for the form fields
 */

export default function BugReportForm({ onSubmit, isLoading, defaultValues = {} }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
            defaultValues
        });

    // Reset form when defaultValues change (e.g., when user profile is loaded)
    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

        return (
            // handleSubmit validates the form before calling the onSubmit prop from the parent
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
                    <Input
                        id="name"
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                    <Input 
                        id="email"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-white">Bug Description</label>
                    <textarea
                        id="description"
                        rows="4"
                        {...register('description', { required: 'Please descrive the issue in detail' })}
                        className="mt-2 block w-full px-3 py-2 border border-[#BFA200] rounded-md shadow-sm placeholder-gray-400"
                        placeholder="Describe the steps to reproduce the bug, what you expected to happen, and what actually happened."
                        />
                    {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description.message}</p>}
                </div>

                <FormButton type="submit" isLoading={isLoading} fullWidth>
                    Submit Bug Report
                </FormButton>
            </form>
        );
}