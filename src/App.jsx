import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import ContractView from './pages/ContractView'
import DraftBot from './pages/DraftBot'
import FindLawyer from './pages/FindLawyer'
import Pricing from './pages/Pricing'
import Checkout from './pages/Checkout'
import ResetPassword from './pages/ResetPassword'

function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function PublicOnlyRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/find-lawyer" element={<FindLawyer />} />
          <Route path="/checkout/:plan" element={<Checkout />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/draft" element={<DraftBot />} />
            <Route path="/contract/new" element={<DraftBot />} />
            <Route path="/contract/:id" element={<ContractView />} />
          </Route>

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
