// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SchedulingPage from './pages/SchedulingPage';
import MessagesPage from './pages/MessagesPage';
// 1. Import the new page component we are about to create.
import ConversationPage from './pages/ConversationPage';
import AddTestimonialPage from './pages/AddTestimonialPage';
import AppointmentsPage from './pages/profile/AppointmentsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import PitchDeckRequestsPage from './pages/profile/PitchDeckRequestsPage';
import ChatbotHistoryPage from './pages/profile/ChatbotHistoryPage';
import AccountSettingsPage from './pages/profile/AccountSettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/add-testimonial" element={<AddTestimonialPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scheduling" element={<SchedulingPage />} />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
          />
          <Route 
            path="/profile/edit"
            element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>}
          />
          <Route 
            path="/profile/account-settings"
            element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>}
          />
          <Route 
            path="/messages" 
            element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} 
          />
          {/* 2. Add the new dynamic route for a single conversation. */}
          {/* This route will render our new ConversationPage component. */}
          <Route 
            path="/messages/:conversationId"
            element={<ProtectedRoute><ConversationPage /></ProtectedRoute>}
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
