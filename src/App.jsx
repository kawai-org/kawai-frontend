import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthPage from './features/auth/AuthPage';
import LandingPage from './features/landing/LandingPage';
import DashboardPage from './features/dashboard/DashboardPage';
import NotesPage from './features/notes/NotesPage';
import RemindersPage from './features/reminders/RemindersPage';
import LinksPage from './features/links/LinksPage';
import CalendarPage from './features/calendar/CalendarPage';
import FaqPage from './features/faq/FaqPage';
import NotFoundPage from './features/NotFoundPage';
import TestDataPage from './features/test-data/TestDataPage';
import DashboardLayout from './layout/DashboardLayout';
import LoadingScreen from './components/common/LoadingScreen';
import MagicLinkPage from './features/auth/MagicLinkPage';

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
            <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
            <Route path="/notes" element={<DashboardLayout><NotesPage /></DashboardLayout>} />
            <Route path="/links" element={<DashboardLayout><LinksPage /></DashboardLayout>} />
            <Route path="/reminders" element={<DashboardLayout><RemindersPage /></DashboardLayout>} />
            <Route path="/calendar" element={<DashboardLayout><CalendarPage /></DashboardLayout>} />
            <Route path="/faq" element={<DashboardLayout><FaqPage /></DashboardLayout>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
