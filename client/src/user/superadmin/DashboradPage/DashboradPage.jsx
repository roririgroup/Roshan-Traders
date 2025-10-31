import {
  Users,
  Factory,
  Building2,
  TrendingUp,
  DollarSign,
  Package,
  UserCheck,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${className}`}>
    {children}
  </div>
  
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 pb-5 ${className}`}>{children}</div>
);

const StatCard = ({ title, value, trend, description, icon: Icon, color }) => (
  <Card className="relative overflow-hidden group">
    <div className={`absolute inset-0 ${color.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
        {title}
      </CardTitle>
      {Icon && (
        <div className={`p-3 rounded-xl ${color.bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-5 w-5 ${color.text}`} />
        </div>
      )}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      {trend && (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${trend.startsWith("+") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {trend}
          </span>
          <p className="text-xs text-gray-500 font-medium">{description}</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function SuperAdminDashboard() {
  const stats = {
    totalManufacturers: 45,
    totalAgents: 128,
    totalEmployees: 342,
    totalUsers: 510,
    pendingPayments: 23,
    totalReports: 89,
    revenue: "$125,430",
    availableBricks: 12450,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Super Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Monitor and manage your platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Last updated: Today</span>
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
            title="Employees"
            value={stats.totalEmployees}
            icon={Users}
            trend="+15%"
            description="from last month"
            color={{ bg: "bg-purple-100", text: "text-purple-600" }}
          />
        </div>

        {/* Stats Grid - Second Row with Section Header */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-pink-600 to-orange-600 rounded-full"></div>
            Operations Overview
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <StatCard
              title="Available Bricks"
              value={stats.availableBricks.toLocaleString()}
              icon={Package}
              trend="+5%"
              description="increase today"
              color={{ bg: "bg-orange-100", text: "text-orange-600" }}
            />
          </div>
        </div>

        {/* Enhanced Revenue Card */}
        <Card className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className="p-2.5 bg-green-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-gray-900 mb-3">{stats.revenue}</div>
            <div className="flex items-center gap-2 bg-green-100 w-fit px-3 py-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700 font-semibold">+20.1% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
