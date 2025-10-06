import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard'
import TripDetails from './dashboard/TripDetails'
import Earnings from './dashboard/Earnings'
import Profile from './dashboard/Profile'

export default function Driver() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/trip-details" element={<TripDetails />} />
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
