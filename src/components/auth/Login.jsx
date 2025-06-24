// src/components/auth/Login.jsx

// Pure presentational form - receives onSubmit + isLoading form its parent and never touches global state

// import { Link } so we can move to the /signup page without reloading the page.
// <Link> is a declarative navigation element in React-Router v6. 
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';
import GoogleButton from '../common/Forms/GoogleButton';

export default function Login({ onSubmit, isLoading }) {
    // Wire the form into react-hook-form. register() captures input values.
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        // Outer <form>. handleSubmit injects validation then calls onSubmit
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <div className="mt-1">
                    <Input id="email" type="email" /* register() wires the field into RHF + adds rule */
                        {...register('email', { required: 'Email is required' })}
                    />
                    {/* Inline error if rule fails */}
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        {...register('password', { required: 'Password is required' })}
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>
            </div>

            {/* Submit button */}
            <FormButton type="submit" isLoading={isLoading}>
                Log in
            </FormButton>

            {/* Google button */}
            <GoogleButton />
            <div className="relative">
                <hr className="my-6" />
                <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs text-gray-500">or
                </span>
            </div>

            {/* Simple text that links to /signup 
                Using <Link> instead of <a> avoids a full page reload. */}
            <p className="text-sm text-center text-gray-500">
                Don't have an account?{' '}
                <Link
                    to="/signup"
                    className="text-indigo-600 hover:text-indigo-700 underline"
                >
                    Create one
                </Link>
            </p>
            <p className="text-sm text-center text-gray-500">
                Forgot your password?{' '}
                <Link
                    to="/forgot-password"
                    className="text-indigo-600 hover:text-indigo-700 underline"
                >
                    Reset it
                </Link>
            </p>
        </form>
    )
}
