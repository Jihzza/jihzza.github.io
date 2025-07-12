// src/components/auth/Login.jsx

// --- Core React/Router Imports ---
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// --- UI Component Imports ---
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';
import GoogleButton from '../common/Forms/GoogleButton';

/**
 * A reusable, "dumb" login form component.
 *
 * Core Responsibilities:
 * 1.  **Presentation**: Renders the input fields (email, password), buttons (Submit, Google), and links (Sign Up, Forgot Password).
 * 2.  **Form Management**: Uses `react-hook-form` for efficient, uncontrolled form state management and validation.
 * 3.  **Props-Driven**: It is entirely controlled by its parent. It receives an `onSubmit` handler to execute upon successful validation
 * and an `isLoading` prop to disable the form during submission.
 * 4.  **Styling Flexibility**: Accepts a `containerClassName` prop to allow parent components to customize the styling of the root `<form>` element,
 * making it adaptable to different layouts (e.g., in a dedicated login page vs. a section on the homepage).
 *
 * @param {function} onSubmit - The function to call with form data when the form is successfully submitted.
 * @param {boolean} isLoading - A flag to show a loading state on the submit button.
 * @param {string} [containerClassName] - Optional CSS classes to apply to the root form element for custom styling. Defaults to 'space-y-6'.
 */
export default function Login({ onSubmit, isLoading, containerClassName = 'space-y-6' }) {
    // --- HOOKS ---
    // Initialize react-hook-form. `register` links inputs, `handleSubmit` wraps our submit handler with validation.
    const { register, handleSubmit, formState: { errors } } = useForm();

    // --- RENDER LOGIC ---
    return (
        // The root <form> element.
        // - `handleSubmit(onSubmit)`: A react-hook-form function that validates the form first, then calls our `onSubmit` prop with the form data.
        // - `className`: Applies the `containerClassName` prop, allowing for flexible styling from the parent.
        <form onSubmit={handleSubmit(onSubmit)} className={containerClassName}>
            {/* Email Input Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <div className="mt-1">
                    <Input
                        id="email"
                        type="email"
                        // `register` wires the input into react-hook-form and defines a validation rule.
                        {...register('email', { required: 'Email is required' })}
                    />
                    {/* Display a validation error message if the "required" rule fails. */}
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>
            </div>

            {/* Password Input Field */}
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

            {/* Submit Button */}
            <FormButton type="submit" isLoading={isLoading} fullWidth>
                Log in
            </FormButton>

            {/* "or" Separator and Google Button */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-400" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-black">or</span>
                </div>
            </div>
            <GoogleButton />

            {/* Navigation Links */}
            <div className="text-sm text-center mt-6">
                <p className="text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-medium text-indigo-400 hover:text-indigo-300 underline"
                    >
                        Create one
                    </Link>
                </p>
                <p className="mt-2 text-gray-400">
                    Forgot your password?{' '}
                    <Link
                        to="/forgot-password"
                        className="font-medium text-indigo-400 hover:text-indigo-300 underline"
                    >
                        Reset it
                    </Link>
                </p>
            </div>
        </form>
    );
}