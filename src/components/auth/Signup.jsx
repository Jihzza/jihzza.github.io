// src/components/auth/Signup.jsx

// A "dumb" sign-up form. It receives onSubmit + isLoading props from the parent page and never talks to global state.

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form'; // form helper
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';
import GoogleButton from '../common/Forms/GoogleButton';

export default function Signup({ onSubmit, isLoading }) {
    // RFH initialisation
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    // Helper to compare passwords in real time
    const password = watch('password'); // read current password

    return (
        // Outer form: handleSumit validates then runs onSubmit
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    /* register() attaches validation rule */
                    {...register('email', { registered: 'Email is required' })}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
            {/* Password field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register('password', { required: 'Password is required', minLenght: { value: 6, message: 'Minimum lenght is 6'} })}
                />
                {errors.password && <p className="text-sm text-red-600">
                    {errors.password.message}</p>}
            </div>
            {/* Confirm Password field */}
            <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    {...register('confirm', { validate: value => value === password || 'Passwords do not match', })}
                />
                {errors.confirm && <p className="text-sm text-red-600">{errors.confirm.message}</p>}
                </div>
                {/* Submit button */}
                <FormButton type="submit" isLoading={isLoading}>
                    Create&nbsp;&nbsp;Account
                </FormButton>

                {/* Google button */}
                <GoogleButton />
                <div className="relative">
                    <hr className="my-6" />
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs text-gray-500">or
                    </span>
                </div>
                <p>
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-indigo-600 hover:text-indigo-700 underline"
                    >
                        Log in
                    </Link>
                </p>
        </form>
    )
}