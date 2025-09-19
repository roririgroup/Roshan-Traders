import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../screens/DashboardLayout";
import DashboradPage from "../screens/DashboradPage/DashboradPage";
import ManufacturersPage from "../pages/Manufactures/ManufacturesPage";
import ManufacturerDetailsPage from "../pages/Manufactures/components/ManufacturesDetailsPage";
import CompaniesPage from "../screens/CompaniesPage/CompaniesPage";
import AgentsPage from "../screens/AgentPage/AgentsPage";
import EmployeesPage from "../screens/EmployeesPage/EmployeesPage";
import UsersPage from "../screens/UsersPage/UsersPage";
import Dashboard from "../user/agents/dashboard/Dashboard";
import Products from "../user/agents/dashboard/Products";
import Orders from "../user/agents/dashboard/Orders";
import PaymentReport from "../user/agents/dashboard/PaymentReport";
import Profile from "../user/agents/dashboard/Profile";
import Reports from "../user/agents/dashboard/Reports";
import ManufacturerDashboard from "../user/manufactures/dashboard/Dashboard";
import ManufacturerProducts from "../user/manufactures/dashboard/Products";
import CustomerOrder from "../user/manufactures/dashboard/Orders";
import Payments from "../user/manufactures/dashboard/PaymentReport";
import Employees from "../user/manufactures/dashboard/Employees";
import ManufacturerReports from "../user/manufactures/dashboard/Reports";
import ManufacturerProfile from "../user/manufactures/dashboard/Profile";
import { isAuthenticated } from "../lib/auth";
import UserLogin from "../pages/Login/components/UserLogin";
import SuperAdminLogin from "../pages/Login/components/SuperAdminLogin";
import { hasRole } from "../lib/roles";
import AdminOrders from "../features/orders/pages/AdminOrders";

function ProtectedRoute({ children, requiredRole = null }) {
  if (!isAuthenticated()) {
    return <Navigate to="/user/login" replace />;
  }
  
  // If a specific role is required, check for it
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function RoleBasedRedirect() {
  if (!isAuthenticated()) {
    return <Navigate to="/user/login" replace />;
  }

  if (hasRole("superadmin")) {
    return <Navigate to="/dashboard" replace />; // 👈 fixed
  } else if (hasRole("manufacturer")) {
    return <Navigate to="/manufacturers/dashboard" replace />;
  } else if (hasRole("agent")) {
    return <Navigate to="/agents/dashboard" replace />;
  }

  return <Navigate to="/user/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Role-based redirect for root path */}
        <Route index element={<RoleBasedRedirect />} />

        {/* Superadmin Routes - Manufacturer Management */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredRole="superadmin">
             <DashboradPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturers"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <ManufacturersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturers/:manufacturerId"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <ManufacturerDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="companies"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <CompaniesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="agents"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <AgentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employees"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <EmployeesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/orders"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        {/* Agent Routes */}
        <Route
          path="agents/dashboard"
          element={
            <ProtectedRoute requiredRole="agent">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="agents/products"
          element={
            <ProtectedRoute requiredRole="agent">
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="agents/orders"
          element={
            <ProtectedRoute requiredRole="agent">
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="agents/payment-report"
          element={
            <ProtectedRoute requiredRole="agent">
              <PaymentReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="agents/profile"
          element={
            <ProtectedRoute requiredRole="agent">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="agents/reports"
          element={
            <ProtectedRoute requiredRole="agent">
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Manufacturer Dashboard Routes - Accessible only to manufacturers */}
        <Route
          path="manufacturers/dashboard"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturers/products"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturers/orders"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <CustomerOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturers/payments"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturers/employees"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturers/reports"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturers/profile"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}