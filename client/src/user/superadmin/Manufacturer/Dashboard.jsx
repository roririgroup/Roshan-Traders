import React from "react";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  Gift,
  BarChart3,
  User,
} from "lucide-react";

const stats = [
  { title: "Dashboard", icon: TrendingUp, color: "bg-blue-500" },
  { title: "My Products", icon: Package, color: "bg-green-500" },
  { title: "Customer Orders", icon: ShoppingCart, color: "bg-yellow-500" },
  { title: "Deliveries", icon: Truck, color: "bg-orange-500" },
  { title: "Payments", icon: DollarSign, color: "bg-purple-500" },
  { title: "Referrals", icon: Gift, color: "bg-pink-500" },
  { title: "Reports", icon: BarChart3, color: "bg-indigo-500" },
  { title: "Profile", icon: User, color: "bg-gray-500" },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manufacturer Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white shadow rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition"
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl text-white ${item.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">View {item.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
