import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import RemindersPage from './pages/RemindersPage';
import LinksPage from './pages/LinksPage';
import CalendarPage from './pages/CalendarPage';
import FaqPage from './pages/FaqPage';
import NotFoundPage from './pages/NotFoundPage';
import TestDataPage from './pages/TestDataPage';
import DashboardLayout from './layout/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import LoadingScreen from './components/LoadingScreen';
import MagicLinkPage from './pages/MagicLinkPage';

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
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/magic" element={<MagicLinkPage />} />

            {/* Protected Dashboard Routes */}
            <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/links" element={<LinksPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/faq" element={<FaqPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
