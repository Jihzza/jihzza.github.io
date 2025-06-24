import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
// Create these placeholder files in the next step
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SchedulingPage from './pages/SchedulingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Routes that SHOULD have the navigation bar are nested under the Layout route */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scheduling" element={<SchedulingPage />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          {/* Add other pages that need the nav bar here in the future */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;