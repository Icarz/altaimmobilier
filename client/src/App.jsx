import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Home          from './pages/Home'
import Listings      from './pages/Listings'
import ListingDetail from './pages/ListingDetail'

import AdminLogin     from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminListings  from './pages/admin/AdminListings'
import NewListing     from './pages/admin/NewListing'
import EditListing    from './pages/admin/EditListing'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"             element={<Home />} />
        <Route path="/listings"     element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />

        {/* Admin — unprotected */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin — protected */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/listings" element={
          <ProtectedRoute><AdminListings /></ProtectedRoute>
        } />
        <Route path="/admin/listings/new" element={
          <ProtectedRoute><NewListing /></ProtectedRoute>
        } />
        <Route path="/admin/listings/:id/edit" element={
          <ProtectedRoute><EditListing /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
