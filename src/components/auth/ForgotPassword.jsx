// src/components/auth/ForgotPassword.jsx

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';
import SectionTextWhite from '../common/SectionTextWhite';
// Pure UI - parent passes onSubmit + isLoading

export default function ForgotPassword({ onSubmit, isLoading }) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col justify-center items-center">
            <SectionTextWhite title="Reset Your Password"></SectionTextWhite>
            <div className="bg-white p-6 shadow rounded-lg">
                <label htmlFor="email" className="block text-sm font-medium text-black">
                    Enter your account email
                </label>
                <div className="space-y-6">
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="account@email.com"
                    {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className='mt-2 text-sm text-red-600'>{errors.email.message}</p>}

                    <FormButton type="submit" disabled={isLoading}>
                        Send Reset Link
                    </FormButton>
                    <p className="text-black text-center">
                        Go back to{' '}
                        <Link
                            to="/login"
                            className="text-[#002147] underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </form>
    );
}