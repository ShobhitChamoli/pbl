import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './modules/Auth/Login';
import Register from './modules/Auth/Register';
import StudentDashboard from './modules/Student/StudentDashboard';
import MentorDashboard from './modules/Mentor/MentorDashboard';
import AnimatedBackground from './components/AnimatedBackground';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />; // Basic RBAC

  return children;
};

import OnboardingTour from './components/OnboardingTour';
import AdminDashboard from './modules/Admin/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <OnboardingTour />
          <AnimatedBackground>
            <div className="min-h-screen font-sans selection:bg-primary selection:text-white">
              <Navbar />
              <Routes>
                <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
                <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
                <Route path="/mentor/dashboard" element={<ProtectedRoute role="mentor"><MentorDashboard /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </AnimatedBackground>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // Or spinner

  if (user) {
    if (user.role === 'student') return <Navigate to="/student/dashboard" />;
    if (user.role === 'mentor') return <Navigate to="/mentor/dashboard" />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default App;
