import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Loader from './components/ui/Loader.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const InterviewSetup = lazy(() => import('./pages/InterviewSetup.jsx'))
const InterviewSession = lazy(() => import('./pages/InterviewSession.jsx'))
const InterviewReport = lazy(() => import('./pages/InterviewReport.jsx'))
const InterviewHistory = lazy(() => import('./pages/InterviewHistory.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

export default function App() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview/setup" element={<InterviewSetup />} />
          <Route path="/interview/session/:id" element={<InterviewSession />} />
          <Route path="/interview/report/:id" element={<InterviewReport />} />
          <Route path="/interview/history" element={<InterviewHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
