import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard'
import TruckManagement from './dashboard/TruckManagement'
import DriverManagement from './dashboard/DriverManagement'
import Trips from './dashboard/Trips'
import Payments from './dashboard/Payments'
import Profile from './dashboard/Profile'
import Orders from './dashboard/Orders'

export default function TruckOwner() {
 return (
   <Routes>
     <Route index element={<Dashboard />} />
     <Route path="truck-management" element={<TruckManagement />} />
     <Route path="driver-management" element={<DriverManagement />} />
     <Route path="orders" element={<Orders />} />
     <Route path="trips" element={<Trips />} />
     <Route path="payments" element={<Payments />} />
     <Route path="profile" element={<Profile />} />
     {/* This route will match any undefined routes and redirect to the index (Dashboard) */}
     <Route path="*" element={<Navigate to="." replace />} />
   </Routes>
 )
}