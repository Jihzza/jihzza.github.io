// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AddTestimonialPage from './pages/AddTestimonialPage';
import AppointmentsPage from './pages/profile/AppointmentsPage';
import SubscriptionsPage from './pages/profile/SubscriptionsPage';
import PitchDeckRequestsPage from './pages/profile/PitchDeckRequestsPage';
import ChatbotHistoryPage from './pages/profile/ChatbotHistoryPage';
import AccountSettingsPage from './pages/profile/AccountSettingsPage';
import CalendarPage from './pages/CalendarPage';
import NotificationsPage from './pages/NotificationsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import SuccessPage from './pages/SuccessPage';
import ChatbotPage from './pages/ChatbotPage';
import SchedulingFormPage from './pages/SchedulingFormPage';
import ServiceSelectionPage from './pages/ServiceSelectionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes className="bg-gradient-to-b from-[#002147] to-[#ECEBE5]">
        {/* All pages now render within the main Layout */}
        <Route element={<Layout />}>
          {/* Public & Authentication Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/select-service" element={<ServiceSelectionPage />} />
          <Route path="/schedule" element={<SchedulingFormPage />} />

          {/* Protected Routes */}
          <Route
            path="/add-testimonial"
            element={<ProtectedRoute><AddTestimonialPage /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />
          <Route
            path="/profile/edit"
            element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>}
          />
          <Route
            path="/profile/appointments"
            element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>}
          />
          <Route
            path="/profile/subscriptions"
            element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>}
          />
          <Route
            path="/profile/pitch-requests"
            element={<ProtectedRoute><PitchDeckRequestsPage /></ProtectedRoute>}
          />
          <Route
            path="/profile/chatbot-history"
            element={<ProtectedRoute><ChatbotHistoryPage /></ProtectedRoute>}
          />
          <Route
            path="/calendar"
            element={<ProtectedRoute><CalendarPage /></ProtectedRoute>}
          />
          <Route
            path="/notifications"
            element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>}
          />
          <Route
            path="/success"
            element={<SuccessPage />}
          />
          <Route 
            path="/chat"
            element={<ChatbotPage />} 
          />
          <Route 
            path="/chat/:sessionId"
            element={<ChatbotPage />} 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;