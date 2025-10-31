import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard'
import Load from './dashboard/Load'
import DeliveriesList from './dashboard/DeliveriesList'
import Earnings from './dashboard/Earnings'
import Profile from './dashboard/Profile'


export default function Driver() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/load" element={<Load />} />
      <Route path="/trip-details" element={<DeliveriesList />} />
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
