import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './modules/Auth/Login';
import Register from './modules/Auth/Register';
import AnimatedBackground from './components/AnimatedBackground';
import ErrorBoundary from './components/ErrorBoundary';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to AuditX, {user?.name}!</h1>
      <p className="text-xl mb-8 opacity-80">You are logged in as a {user?.role}.</p>
      <div className="bg-white/10 p-8 rounded-xl border border-white/20 backdrop-blur-md max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">Project setup complete (Part 1)</h2>
        <p className="mb-6 text-gray-300">
          The base authentication system and UI shell are ready. Dashboard features will be added in subsequent parts.
        </p>
        <button 
          onClick={logout} 
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <AnimatedBackground>
            <div className="min-h-screen font-sans selection:bg-purple-500 selection:text-white pb-10">
              <Navbar />
              <Routes>
                <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
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

  if (loading) return null;

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default App;
