// src/pages/SignupPage.jsx

// Handles local loading + error, calls Supabase sign-up service, and redirects to /profile on success.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpNewUser, signInWithGoogle } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import SignUp from '../components/auth/Signup';
import EmailVerificationModal from '../components/auth/EmailVerificationModal';
import SectionTextWhite from '../components/common/SectionTextWhite';

export default function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [needVerification, setNeedVerification] = useState(false);

  // Redirect away if user is already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/profile');
  }, [isAuthenticated, navigate]);

  // Handler receives { email, password, confirm } from the child form
  const handleSignup = async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await signUpNewUser(email, password);
      if (error) throw error;

      // If Confirm-email ON: session === null
      if (!data.session) {
        setNeedVerification(true); // show modal instead of redirect
        return;
      }
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // Google sign-in will redirect, so no need to navigate manually
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#002147] ">
      {/* Decorative background accents (subtle, no color change) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#002147]/40 blur-3xl" />
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 py-12">
        <SectionTextWhite title="Create an account" />

        <div className="mt-8 w-full max-w-md">
          <div className="rounded-2xl bg-black/10  border border-white/20 p-8 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl">
            {/* Form */}
            <SignUp
              onSubmit={handleSignup}
              onGoogleSignIn={handleGoogleSignIn}
              isLoading={isLoading}
              containerClassName="space-y-6"
            />

            {/* Error alert */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}
          </div>

          {/* Modal lives at root so screen-readers see it next */}
          <EmailVerificationModal
            open={needVerification}
            onClose={() => setNeedVerification(false)}
          />

          {/* Tiny reassurance footer */}
          <p className="mt-6 text-center text-xs text-white">
            We’ll email you a verification link if required.
          </p>
        </div>
      </div>
    </div>
  );
}
