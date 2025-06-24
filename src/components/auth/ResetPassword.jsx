// src/components/auth/ResetPassword.jsx
import { useForm } from 'react-hook-form';
import Input from '../common/Forms/Input';
import FormButton from '../common/Forms/FormButton';

export default function ResetPassword({ onSubmit, isLoading }){
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const pwd = watch('password', '');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                </label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'min lenght 6'},
                    })}
                />
                {errors.password && <p className='mt-2 text-sm text-red-600'>{errors.password.message}</p>}
            </div>
            {/* Confirm Password */}
            <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    {...register('confirm', { validate: (v) => v === pwd || 'Passwords do not match',
                    })}
                />
                {errors.confirm && <p className="text-sm text-red-600">{errors.confirm.message}</p>}
            </div>
            <FormButton type="submit" disabled={isLoading}>
                Change Password
            </FormButton>
        </form>
    );
}