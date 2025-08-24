// src/components/auth/Signup.jsx

// A "dumb" sign-up form. It receives onSubmit + isLoading props from the parent page and never talks to global state.

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form'; // form helper
import Input from '../common/Forms/Input';
import FormButton from '../ui/Button';
import GoogleButton from '../common/Forms/GoogleButton';
import { useTranslation } from 'react-i18next';

export default function Signup({ onSubmit, isLoading }) {
    // RFH initialisation
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { t } = useTranslation();

    // Helper to compare passwords in real time
    const password = watch('password'); // read current password

    return (
        // Outer form: handleSumit validates then runs onSubmit
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('signup.form.emailLabel')}
                </label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    /* register() attaches validation rule */
                    {...register('email', { required: t('signup.form.validation.emailRequired') })}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
            {/* Password field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t('signup.form.passwordLabel')}
                </label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register('password', { required: t('signup.form.validation.passwordRequired'), minLength: { value: 6, message: t('signup.form.validation.passwordMinLength') } })}
                />
                {errors.password && <p className="text-sm text-red-600">
                    {errors.password.message}</p>}
            </div>
            {/* Confirm Password field */}
            <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                    {t('signup.form.confirmPasswordLabel')}
                </label>
                <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    {...register('confirm', { validate: value => value === password || t('signup.form.validation.passwordsNoMatch') })}
                />
                {errors.confirm && <p className="text-sm text-red-600">{errors.confirm.message}</p>}
            </div>
            {/* Submit button */}
            <FormButton type="submit" isLoading={isLoading}>
                {t('signup.form.createAccountButton')}
            </FormButton>

            {/* Google button */}
            <GoogleButton />
            <div className="relative my-6">
                
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-black">{t('signup.form.orSeparator')}</span>
                </div>
            </div>
            <p className="text-gray-400">
                {t('signup.form.loginPrompt')}{' '}
                <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-700 underline"
                >
                    {t('signup.form.loginLink')}
                </Link>
            </p>
        </form>
    )
}