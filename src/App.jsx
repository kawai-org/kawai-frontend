import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import LinksPage from './pages/LinksPage';
import CalendarPage from './pages/CalendarPage';
import FaqPage from './pages/FaqPage';
import DashboardLayout from './layout/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
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

        {/* Fallback to dashboard if logged in */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
