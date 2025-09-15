import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/Login/LoginPage'
import DashboardLayout from '../screens/DashboardLayout'
import ManufacturersPage from '../pages/Manufactures/ManufacturesPage'
import ManufacturerDetailsPage from '../pages/Manufactures/components/ManufacturesDetailsPage'
import CompaniesPage from '../screens/CompaniesPage'
import TradersPage from '../screens/TradersPage'
import AgentsPage from '../screens/AgentsPage'
import EmployeesPage from '../screens/EmployeesPage'
import UsersPage from '../screens/UsersPage'
import Dashboard from '../user/agents/dashboard/Dashboard'
import Products from '../user/agents/dashboard/Products'
import Orders from '../user/agents/dashboard/Orders'
import PaymentReport from '../user/agents/dashboard/PaymentReport'
import Profile from '../user/agents/dashboard/Profile'
import Reports from '../user/agents/dashboard/Reports'
import ManufacturesDashboard from '../user/manufactures/dashboard/Dashboard'
import ManufacturesProducts from '../user/manufactures/dashboard/Products'
import ManufacturesOrders from '../user/manufactures/dashboard/Orders'
import ManufacturesEmployees from '../user/manufactures/dashboard/Employees'
import ManufacturesPaymentReport from '../user/manufactures/dashboard/PaymentReport'
import ManufacturesProfile from '../user/manufactures/dashboard/Profile'
import ManufacturesReports from '../user/manufactures/dashboard/Reports'
import { isAuthenticated } from '../lib/auth'

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManufacturersPage />} />
        <Route path="manufacturers" element={<ManufacturersPage />} />
        <Route path="manufacturers/:manufacturerId" element={<ManufacturerDetailsPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="traders" element={<TradersPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="agents/dashboard" element={<Dashboard />} />
        <Route path="agents/products" element={<Products />} />
        <Route path="agents/orders" element={<Orders />} />
        <Route path="agents/payment-report" element={<PaymentReport />} />
        <Route path="agents/profile" element={<Profile />} />
        <Route path="agents/reports" element={<Reports />} />
        <Route path="manufactures/dashboard" element={<ManufacturesDashboard />} />
        <Route path="manufactures/products" element={<ManufacturesProducts />} />
        <Route path="manufactures/orders" element={<ManufacturesOrders />} />
        <Route path="manufactures/employees" element={<ManufacturesEmployees />} />
        <Route path="manufactures/payment-report" element={<ManufacturesPaymentReport />} />
        <Route path="manufactures/profile" element={<ManufacturesProfile />} />
        <Route path="manufactures/reports" element={<ManufacturesReports />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}