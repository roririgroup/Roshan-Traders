import {
  Users,
  Factory,
  Building2,
  CreditCard,
  FileText,
  TrendingUp,
  DollarSign,
  Package,
  UserCheck,
  AlertCircle,
  BarChart3,
} from "lucide-react";

// Card components
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
  >
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 pb-4 ${className}`}>{children}</div>
);

// ✅ StatCard with colored icons
const StatCard = ({ title, value, trend, description, icon: Icon, color }) => (
  <Card className="hover:scale-[1.02]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">
        {title}
      </CardTitle>
      {Icon && (
        <div
          className={`p-2 rounded-full ${color?.bg}`}
        >
          <Icon className={`h-5 w-5 ${color?.text}`} />
        </div>
      )}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {trend && (
        <p className="text-xs text-gray-500 mt-1">
          <span
            className={
              trend.startsWith("+") ? "text-green-600" : "text-red-600"
            }
          >
            {trend}
          </span>{" "}
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

export default function SuperAdminDashboard() {
  const stats = {
    totalManufacturers: 45,
    totalAgents: 128,
    totalCompanies: 67,
    totalEmployees: 342,
    totalUsers: 510,
    pendingPayments: 23,
    totalReports: 89,
    revenue: "$125,430",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Super Admin Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Last updated: Today</span>
          </div>
        </div>

        {/* Stats Grid - Top Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Manufacturers"
            value={stats.totalManufacturers}
            icon={Factory}
            trend="+12%"
            description="from last month"
            color={{ bg: "bg-blue-100", text: "text-blue-600" }}
          />
          <StatCard
            title="Agents"
            value={stats.totalAgents}
            icon={UserCheck}
            trend="+8%"
            description="from last month"
            color={{ bg: "bg-green-100", text: "text-green-600" }}
          />
          <StatCard
            title="Companies"
            value={stats.totalCompanies}
            icon={Building2}
            trend="+5%"
            description="from last month"
            color={{ bg: "bg-indigo-100", text: "text-indigo-600" }}
          />
          <StatCard
            title="Employees"
            value={stats.totalEmployees}
            icon={Users}
            trend="+15%"
            description="from last month"
            color={{ bg: "bg-purple-100", text: "text-purple-600" }}
          />
        </div>

        {/* Stats Grid - Second Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Users"
            value={stats.totalUsers}
            icon={Users}
            trend="+20%"
            description="from last month"
            color={{ bg: "bg-pink-100", text: "text-pink-600" }}
          />
          <StatCard
            title="Pending Payments"
            value={stats.pendingPayments}
            icon={AlertCircle}
            trend="-3%"
            description="from last month"
            color={{ bg: "bg-yellow-100", text: "text-yellow-600" }}
          />
          <StatCard
            title="Reports"
            value={stats.totalReports}
            icon={BarChart3}
            trend="+10%"
            description="from last month"
            color={{ bg: "bg-red-100", text: "text-red-600" }}
          />
        </div>

        {/* Revenue Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <DollarSign className="h-6 w-6 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">
              {stats.revenue}
            </div>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
