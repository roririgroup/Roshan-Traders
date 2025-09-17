import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../screens/DashboardLayout'
import ManufacturersPage from '../pages/Manufactures/ManufacturesPage'
import ManufacturerDetailsPage from '../pages/Manufactures/components/ManufacturesDetailsPage'
import CompaniesPage from '../screens/CompaniesPage'
import TradersPage from '../screens/TradersPage'
import AgentsPage from '../screens/AgentsPage'
import EmployeesPage from '../screens/EmployeesPage'
import UsersPage from '../screens/UsersPage'

// Agent dashboard imports
import Dashboard from '../user/agents/dashboard/Dashboard'
import Products from '../user/agents/dashboard/Products'
import Orders from '../user/agents/dashboard/Orders'
import PaymentReport from '../user/agents/dashboard/PaymentReport'
import Profile from '../user/agents/dashboard/Profile'
import Reports from '../user/agents/dashboard/Reports'

// Manufacture dashboard imports
import ManufacturesDashboard from '../user/manufactures/dashboard/Dashboard'
import ManufacturesProducts from '../user/manufactures/dashboard/Products'
import ManufacturesOrders from '../user/manufactures/dashboard/Orders'
import ManufacturesEmployees from '../user/manufactures/dashboard/Employees'
import ManufacturesPaymentReport from '../user/manufactures/dashboard/PaymentReport'
import ManufacturesProfile from '../user/manufactures/dashboard/Profile'
import ManufacturesReports from '../user/manufactures/dashboard/Reports'

// Auth & roles
import { isAuthenticated } from '../lib/auth'
import { hasRole } from '../lib/roles'

// Login
import UserLogin from '../pages/Login/components/UserLogin'
import SuperAdminLogin from '../pages/Login/components/SuperAdminLogin'

// Admin feature
import AdminOrders from '../features/orders/pages/AdminOrders'

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/user/login" replace />
  }
  return children
}

function RoleRoute({ roles, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/user/login" replace />
  }
  if (!hasRole(roles)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Login Routes */}
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect */}
        <Route index element={<Navigate to="/manufactures/dashboard" replace />} />

        {/* Master Pages */}
        <Route path="manufacturers" element={<ManufacturersPage />} />
        <Route path="manufacturers/:manufacturerId" element={<ManufacturerDetailsPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="traders" element={<TradersPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="users" element={<UsersPage />} />

        {/* Agent Dashboard Routes */}
        <Route
          path="agents/dashboard"
          element={
            <RoleRoute roles={["agent"]}>
              <Dashboard />
            </RoleRoute>
          }
        />
        <Route
          path="agents/products"
          element={
            <RoleRoute roles={["agent"]}>
              <Products />
            </RoleRoute>
          }
        />
        <Route
          path="agents/orders"
          element={
            <RoleRoute roles={["agent"]}>
              <Orders />
            </RoleRoute>
          }
        />
        <Route
          path="agents/payment-report"
          element={
            <RoleRoute roles={["agent"]}>
              <PaymentReport />
            </RoleRoute>
          }
        />
        <Route
          path="agents/profile"
          element={
            <RoleRoute roles={["agent"]}>
              <Profile />
            </RoleRoute>
          }
        />
        <Route
          path="agents/reports"
          element={
            <RoleRoute roles={["agent"]}>
              <Reports />
            </RoleRoute>
          }
        />

        {/* Manufactures Dashboard Routes */}
        <Route
          path="manufactures/dashboard"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturesDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="manufactures/products"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturesProducts />
            </RoleRoute>
          }
        />
        <Route
          path="manufactures/orders"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturesOrders />
            </RoleRoute>
          }
        />
        <Route
          path="manufactures/employees"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturesEmployees />
            </RoleRoute>
          }
        />
        <Route
          path="manufactures/payment-report"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturesPaymentReport />
            </RoleRoute>
          }
        />
        <Route
          path="manufactures/profile"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturesProfile />
            </RoleRoute>
          }
        />
        <Route
          path="manufactures/reports"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturesReports />
            </RoleRoute>
          }
        />

        {/* Superadmin Orders */}
        <Route
          path="admin/orders"
          element={
            <RoleRoute roles={["superadmin"]}>
              <AdminOrders />
            </RoleRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
