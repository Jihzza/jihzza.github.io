// src/components/scheduling/ContactInfoStep.jsx

import React from 'react';

import Input from '../common/Forms/Input';
import GoogleButton from '../common/Forms/GoogleButton';
import FormButton from '../common/Forms/FormButton';

// COMPONENT DEFINITION

/**
 * A step to collect user contact information
 * It intelligently adaps its UI based on the user's authentication status
 * 
 * @param {bollean} isLoggedIn - Flag indicating if the user is authenticated
 * @param {object} contactInfoData - Object containing the form data for this step (name, email, phone, etc.).
 * @param {function} onUpdateField - Callback to update the parent component's state
 * @param {function} onGoogleSignIn - Callback to trigger the Google sign-in flow
 */
export default function ContactInfoStep({ isLoggedIn, contactInfoData, onUpdateField, onGoogleSignIn }) {

    // RENDER LOGIC
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-center text- mb-4">
                {/* We display a different title based  on the login state */}
                {isLoggedIn ? 'Contact Info' : 'Tell Us About Yourself'}
            </h2>

            {/* This is the core logix: a conditional (ternary) operator that renders one of two entirely different blocks of JSX based on the `isLoggedIn` prop. */}
            {isLoggedIn ? (
                // LOGGED IN VIEW
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white">Full Name</label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={contactInfoData.name}
                            onChange={onUpdateField} // The parent's handler updates the state
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                        <Input 
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={contactInfoData.email}
                            onChange={onUpdateField}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-white">Phone Number</label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (123) 456-7890"
                            value={contactInfoData.phone}
                            onChange={onUpdateField}
                        />
                    </div>
                </div>
            ) : (
                // GUEST / LOGGED-OUT VIEW
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white">Full Name</label>
                        <Input id="name" name="name" type="text" placeholder="Enter your full name" value={contactInfoData.name} onChange={onUpdateField} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" value={contactInfoData.email} onChange={onUpdateField} />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-white">Phone Number</label>
                        <Input id="phone" name="phone" type="tel" placeholder="+1 (123) 456-7890" value={contactInfoData.phone} onChange={onUpdateField} />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white">Create Password</label>
                        <Input id="password" name="password" type="password" placeholder="**********" value={contactInfoData.password} onChange={onUpdateField} />
                    </div>

                    <div className="p-2">
                        {/* The Google Sign-In button should trigger a function passed down from the parent */}
                        <GoogleButton onClick={onGoogleSignIn} text="Sign up with Google" />
                    </div>
                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}