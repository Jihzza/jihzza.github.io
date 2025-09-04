// src/components/auth/Signup.jsx

// A "dumb" sign-up form. It receives onSubmit + isLoading props from the parent page and never talks to global state.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form'; // form helper
import Input from '../common/Forms/Input';
import FormButton from '../ui/Button';
import GoogleButton from '../common/Forms/GoogleButton';
import { useTranslation } from 'react-i18next';

export default function Signup({ onSubmit, isLoading, containerClassName = 'space-y-6' }) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { t } = useTranslation();

    // Helper to compare passwords in real time
    const password = watch('password'); // read current password

    // Password visibility toggles (separate for both fields)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        // HTML form landmark with visible heading label (via surrounding section)
        <form onSubmit={handleSubmit(onSubmit)} className={containerClassName} noValidate>
            {/* Email field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    {t('signup.form.emailLabel')}
                </label>
                <div className="mt-1">
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        {...register('email', { required: t('signup.form.validation.emailRequired') })}
                    />
                    {errors.email && (
                        <p id="email-error" className="mt-2 text-sm text-red-600" aria-live="polite">
                            {errors.email.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Password field + Show/Hide */}
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                        {t('signup.form.passwordLabel')}
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        aria-pressed={showPassword ? 'true' : 'false'}
                        className="text-xs font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500 focus:outline-none"
                    >
                        {showPassword ? t('signup.form.hidePassword', 'Hide password') : t('signup.form.showPassword', 'Show password')}
                    </button>
                </div>

                <div className="mt-1">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        aria-invalid={errors.password ? 'true' : 'false'}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        {...register('password', {
                            required: t('signup.form.validation.passwordRequired'),
                            minLength: { value: 6, message: t('signup.form.validation.passwordMinLength') }
                        })}
                    />
                    {errors.password && (
                        <p id="password-error" className="mt-2 text-sm text-red-600" aria-live="polite">
                            {errors.password.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Confirm Password field + Show/Hide */}
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="confirm" className="block text-sm font-medium text-gray-900">
                        {t('signup.form.confirmPasswordLabel')}
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowConfirm(v => !v)}
                        aria-pressed={showConfirm ? 'true' : 'false'}
                        className="text-xs font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500 focus:outline-none"
                    >
                        {showPassword ? t('signup.form.hidePassword', 'Hide password') : t('signup.form.showPassword', 'Show password')}
                    </button>
                </div>

                <div className="mt-1">
                    <Input
                        id="confirm"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        aria-invalid={errors.confirm ? 'true' : 'false'}
                        aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                        {...register('confirm', {
                            validate: value => value === password || t('signup.form.validation.passwordsNoMatch')
                        })}
                    />
                    {errors.confirm && (
                        <p id="confirm-error" className="mt-2 text-sm text-red-600" aria-live="polite">
                            {errors.confirm.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Submit button */}
            <div className="justify-center flex">
                <FormButton type="submit" isLoading={isLoading}>
                    {t('signup.form.createAccountButton')}
                </FormButton>
            </div>

            {/* OR separator (matches Login) */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="rounded-full bg-white px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-black/70 shadow">
                        {t('signup.form.orSeparator')}
                    </span>
                </div>
            </div>

            {/* Google button */}
            <div className="flex justify-center">
                <GoogleButton />
            </div>

            {/* Bottom link */}
            <p className="mt-6 text-center text-sm text-gray-600">
                {t('signup.form.loginPrompt')}{' '}
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 underline">
                    {t('signup.form.loginLink')}
                </Link>
            </p>
        </form>
    );
}
