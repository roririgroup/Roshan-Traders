import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../screens/DashboardLayout";
import ManufacturersPage from "../pages/Manufactures/ManufacturesPage";
import ManufacturerDetailsPage from "../pages/Manufactures/components/ManufacturesDetailsPage";
import CompaniesPage from "../screens/CompaniesPage/CompaniesPage";
import TradersPage from "../screens/TradersPage/TradersPage";
import AgentsPage from "../screens/AgentPage/AgentsPage";
import EmployeesPage from "../screens/EmployeesPage/EmployeesPage";
import UsersPage from "../screens/UsersPage/UsersPage";
import Dashboard from "../user/agents/dashboard/Dashboard";
import Products from "../user/agents/dashboard/Products";
import Orders from "../user/agents/dashboard/Orders";
import PaymentReport from "../user/agents/dashboard/PaymentReport";
import Profile from "../user/agents/dashboard/Profile";
import Reports from "../user/agents/dashboard/Reports";
import ManufacturerDashboard from "../components/Manufacturer/Dashboard";
import ManufacturerProducts from "../components/Manufacturer/Products";
import CustomerOrder from "../components/Manufacturer/CustomerOrder";
import Deliveries from "../components/Manufacturer/Deliveries";
import Payments from "../components/Manufacturer/Payment";
import Referrals from "../components/Manufacturer/Referrals";
import ManufacturerReports from "../components/Manufacturer/Report";
import ManufacturerProfile from "../components/Manufacturer/Profile";

import { isAuthenticated } from "../lib/auth";
import UserLogin from "../pages/Login/components/UserLogin";
import SuperAdminLogin from "../pages/Login/components/SuperAdminLogin";
import { hasRole } from "../lib/roles";
import AdminOrders from "../features/orders/pages/AdminOrders";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/user/login" replace />;
  }
  return children;
}

function RoleRoute({ roles, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/user/login" replace />;
  }
  if (!hasRole(roles)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
     
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        
        <Route index element={<Navigate to="/agents/dashboard" replace />} />

       
        <Route path="manufacturers" element={<ManufacturersPage />} />
        <Route
          path="manufacturers/:manufacturerId"
          element={<ManufacturerDetailsPage />}
        />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="traders" element={<TradersPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="users" element={<UsersPage />} />

        
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

        {/* Manufacturer Routes */}
        <Route
          path="manufacturers/dashboard"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="manufacturers/products"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturerProducts />
            </RoleRoute>
          }
        />
        <Route
          path="manufacturers/orders"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <CustomerOrder />
            </RoleRoute>
          }
        />
        <Route
          path="manufacturers/deliveries"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <Deliveries />
            </RoleRoute>
          }
        />
        <Route
          path="manufacturers/payments"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <Payments />
            </RoleRoute>
          }
        />
        <Route
          path="manufacturers/referrals"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <Referrals />
            </RoleRoute>
          }
        />
        <Route
          path="manufacturers/reports"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturerReports />
            </RoleRoute>
          }
        />
        <Route
          path="manufacturers/profile"
          element={
            <RoleRoute roles={["manufacturer"]}>
              <ManufacturerProfile />
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

     
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
