// src/components/testimonials/AddTestimonialForm.jsx

// This is a "dumb" component that renders the form for creating a testimonial.
// It uses react-hook-form for efficient state management and validation.

import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';

/**
 * @param {function} onSubmit - The callback function to execute when the form is submitted.
 * @param {boolean} isLoading - A flag to indicate if the form is currently being processed.
 */
export default function AddTestimonialForm({ onSubmit, isLoading }) {
    // Initialize react-hook-form.
    const { register, handleSubmit, formState: { errors } } = useForm();

    // This internal handler is needed to extract the image file from the form data.
    const handleFormSubmit = (data) => {
        // The image file is located at data.image[0].
        const imageFile = data.image[0] ? data.image[0] : null;
        // We call the parent's onSubmit with the text data and the image file separately.
        onSubmit({ name: data.name, content: data.content }, imageFile);
    };

    return (
        // When the form is submitted, react-hook-form's handleSubmit will validate the fields
        // before calling our custom handleFormSubmit function.
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Name Input */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                <Input
                    id="name"
                    type="text"
                    // Register this input with react-hook-form and add a validation rule.
                    {...register('name', { required: 'Your name is required.' })}
                    className="mt-1"
                />
                {/* Display an error message if the name field fails validation. */}
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Testimonial Content Textarea */}
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Testimonial</label>
                <textarea
                    id="content"
                    rows="4"
                    // Register this textarea with react-hook-form and add a validation rule.
                    {...register('content', { required: 'Testimonial content is required.' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mt-1"
                />
                {/* Display an error message if the content field fails validation. */}
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
            </div>

            {/* Image Upload Input */}
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Your Photo (Optional)</label>
                <Input
                    id="image"
                    type="file"
                    // Register this input. We specify that it should only accept image files.
                    {...register('image')}
                    accept="image/*"
                    className="mt-1"
                />
            </div>

            {/* Submit Button */}
            <div>
                <FormButton type="submit" disabled={isLoading} fullWidth>
                    {isLoading ? 'Submitting...' : 'Submit Testimonial'}
                </FormButton>
            </div>
        </form>
    );
}