import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import LinksPage from './pages/LinksPage';
import CalendarPage from './pages/CalendarPage';
import FaqPage from './pages/FaqPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardLayout from './layout/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import MobileGuard from './components/MobileGuard';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time for visual polish
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileGuard>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Dashboard Routes */}
            <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/links" element={<LinksPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/faq" element={<FaqPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      )}
    </MobileGuard>
  );
}

export default App;
