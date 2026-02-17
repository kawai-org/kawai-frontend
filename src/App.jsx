import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './features/landing/LandingPage';
import DashboardPage from './features/dashboard/DashboardPage';
import NotesPage from './features/notes/NotesPage';
import RemindersPage from './features/reminders/RemindersPage';
import LinksPage from './features/links/LinksPage';
import CalendarPage from './features/calendar/CalendarPage';
import FaqPage from './features/faq/FaqPage';
import NotFoundPage from './features/NotFoundPage';
import DashboardLayout from './layout/DashboardLayout';
import MagicLinkPage from './features/auth/MagicLinkPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/magic" element={<MagicLinkPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard-user"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <NotesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/links"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LinksPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RemindersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CalendarPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FaqPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
