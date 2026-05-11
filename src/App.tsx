import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import AuthPage from './pages/AuthPage';

const ProtectedRoute = ({ children }: any) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="h-screen bg-deep-black flex items-center justify-center text-[#0ea5e9]">Loading...</div>;
  if (!token) return <Navigate to="/auth" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
