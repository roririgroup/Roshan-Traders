import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "../user/superadmin/DashboardLayout";
import DashboradPage from "../user/superadmin/DashboradPage/DashboradPage";
import ManufacturersPage from "../user/superadmin/Manufactures/ManufacturesPage";
import ManufacturerDetailsPage from "../user/superadmin/Manufactures/components/ManufacturesDetailsPage";
import CompaniesPage from "../user/superadmin/CompaniesPage/CompaniesPage";
import AgentsPage from "../user/superadmin/AgentPage/AgentsPage";
import EmployeesPage from "../user/superadmin/EmployeesPage/EmployeesPage";
import UsersPage from "../user/superadmin/UsersPage/UsersPage";
import Dashboard from "../user/agents/dashboard/Dashboard";
import Products from "../user/agents/dashboard/Products";
import AgentOrders from "../user/agents/dashboard/Orders";
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
import TruckOwner from "../user/truck owners/TruckOwner";
import Driver from "../user/drivers/Driver";
import { isAuthenticated } from "../lib/auth";
import UserLogin from "../pages/Login/components/UserLogin";
import SuperAdminLogin from "../pages/Login/components/SuperAdminLogin";
import { hasRole } from "../lib/roles";
import OrdersScreen from "../user/superadmin/Orders/OrdersScreen";
import PaymentReports from "../user/superadmin/PaymentReportPage/PaymentReports";
import ReportPage from "../user/superadmin/ReportPage/ReportPage";
import AgentDetailsPage from "../user/superadmin/AgentPage/AgentDetailsPage";
import Signup from "../pages/signup/signup";
import SignUpApprovalPage from "../user/superadmin/SignUpApprovalPage/SignUpApprovalPage";
import ProductsPage from "../user/superadmin/ProductsPage/ProductsPage";
import LandingPage from "../pages/LandingPage/LandinPage";

// Custom hook to prevent infinite redirects
function useSafeNavigate() {
  const location = useLocation();
  
  const shouldRedirect = (targetPath) => {
    return location.pathname !== targetPath;
  };

  return { shouldRedirect };
}

function ProtectedRoute({ children, requiredRole = null }) {
  const { shouldRedirect } = useSafeNavigate();
  
  if (!isAuthenticated()) {
    return shouldRedirect('/user/login') ? <Navigate to="/user/login" replace /> : children;
  }
  
  // If a specific role is required, check for it
  if (requiredRole && !hasRole(requiredRole)) {
    return shouldRedirect('/') ? <Navigate to="/" replace /> : children;
  }
  
  return children;
}

function PublicRoute({ children }) {
  const { shouldRedirect } = useSafeNavigate();
  
  if (isAuthenticated()) {
    // Redirect based on role only if we're not already on the correct path
    if (hasRole("superadmin") && shouldRedirect('/dashboard/home')) {
      return <Navigate to="/dashboard/home" replace />;
    } else if (hasRole("manufacturer") && shouldRedirect('/dashboard/manufacturer-dashboard')) {
      return <Navigate to="/dashboard/manufacturer-dashboard" replace />;
    } else if (hasRole("agent") && shouldRedirect('/dashboard/agent-dashboard')) {
      return <Navigate to="/dashboard/agent-dashboard" replace />;
    } else if (hasRole("truckOwner") && shouldRedirect('/dashboard/truck-owners')) {
      return <Navigate to="/dashboard/truck-owners" replace />;
    } else if (hasRole("driver") && shouldRedirect('/dashboard/drivers')) {
      return <Navigate to="/dashboard/drivers" replace />;
    }
  }
  return children;
}

function RoleBasedRedirect() {
  const { shouldRedirect } = useSafeNavigate();
  
  if (!isAuthenticated()) {
    return shouldRedirect('/') ? <Navigate to="/" replace /> : <LandingPage />;
  }

  if (hasRole("superadmin") && shouldRedirect('/dashboard/home')) {
    return <Navigate to="/dashboard/home" replace />;
  } else if (hasRole("manufacturer") && shouldRedirect('/dashboard/manufacturer-dashboard')) {
    return <Navigate to="/dashboard/manufacturer-dashboard" replace />;
  } else if (hasRole("agent") && shouldRedirect('/dashboard/agent-dashboard')) {
    return <Navigate to="/dashboard/agent-dashboard" replace />;
  } else if (hasRole("truckOwner") && shouldRedirect('/dashboard/truck-owners')) {
    return <Navigate to="/dashboard/truck-owners" replace />;
  } else if (hasRole("driver") && shouldRedirect('/dashboard/drivers')) {
    return <Navigate to="/dashboard/drivers" replace />;
  }

  // Default fallback - stay on current page
  return <div>Loading...</div>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      {/* Landing Page as default route */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/user/login" 
        element={
          <PublicRoute>
            <UserLogin />
          </PublicRoute>
        } 
      />
      <Route 
        path="/superadmin/login" 
        element={
          <PublicRoute>
            <SuperAdminLogin />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } 
      />

      {/* Protected Routes with Layout */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Role-based redirect for dashboard */}
        <Route index element={<RoleBasedRedirect />} />

        {/* Superadmin Routes */}
        <Route
          path="home"
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
          path="products"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <ProductsPage />
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
          path="agents/:id"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <AgentDetailsPage />
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
          path="orders"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <OrdersScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="paymentreports"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <PaymentReports/>
            </ProtectedRoute>
          }
        />
        <Route
          path="report"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <ReportPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="signup-approval"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <SignUpApprovalPage />
            </ProtectedRoute>
          }
        />

        {/* Agent Routes */}
        <Route
          path="agent-dashboard"
          element={
            <ProtectedRoute requiredRole="agent">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="agent-products"
          element={
            <ProtectedRoute requiredRole="agent">
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="agent-orders"
          element={
            <ProtectedRoute requiredRole="agent">
              <AgentOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="agent-payment-report"
          element={
            <ProtectedRoute requiredRole="agent">
              <PaymentReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="agent-profile"
          element={
            <ProtectedRoute requiredRole="agent">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="agent-reports"
          element={
            <ProtectedRoute requiredRole="agent">
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Manufacturer Dashboard Routes */}
        <Route
          path="manufacturer-dashboard"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturer-products"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturer-orders"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <CustomerOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturer-payments"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturer-employees"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturer-reports"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="manufacturer-profile"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerProfile />
            </ProtectedRoute>
          }
        />

        {/* Truck Owner Routes */}
        <Route
          path="truck-owners/*"
          element={
            <ProtectedRoute requiredRole="truckOwner">
              <TruckOwner />
            </ProtectedRoute>
          }
        />

        {/* Driver Routes */}
        <Route
          path="drivers/*"
          element={
            <ProtectedRoute requiredRole="driver">
              <Driver />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}