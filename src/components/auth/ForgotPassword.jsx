// src/components/auth/ForgotPassword.jsx

import { useForm } from 'react-hook-form';
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';

// Pure UI - parent passes onSubmit + isLoading

export default function ForgotPassword({ onSubmit, isLoading }) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Enter your account email
                </label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className='mt-2 text-sm text-red-600'>{errors.email.message}</p>}
            </div>
            <FormButton type="submit" disabled={isLoading}>
                Send Reset Link
            </FormButton>
        </form>
    );
}