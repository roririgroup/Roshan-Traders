import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard'
import Orders from './dashboard/Orders'
import TruckManagement from './dashboard/TruckManagement'
import DriverManagement from './dashboard/DriverManagement'
import Trips from './dashboard/Trips'
import Payments from './dashboard/Payments'
import Profile from './dashboard/Profile'


export default function TruckOwner() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/truck-management" element={<TruckManagement />} />
      <Route path="/driver-management" element={<DriverManagement />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
