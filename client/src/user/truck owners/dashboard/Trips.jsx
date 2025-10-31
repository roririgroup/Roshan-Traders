import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

export default function Trips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Load mock + assigned trips
    const mockTrips = [
      {
        id: 1,
        truckNo: "TN01AB1234",
        driver: "Raj Kumar",
        from: "Chennai",
        to: "Bangalore",
        status: "Running",
        startTime: "2024-10-01 08:00",
        estimatedArrival: "2024-10-01 16:00",
        cargo: "Electronics - 15 Ton",
        agent: "ABC Logistics",
        podUploaded: false,
      },
      
      {
        id: 2,
        truckNo: "TN02CD5678",
        driver: "Suresh Patel",
        from: "Mumbai",
        to: "Delhi",
        status: "Upcoming",
        startTime: "2024-10-05 06:00",
        estimatedArrival: "2024-10-06 18:00",
        cargo: "Textiles - 12 Ton",
        agent: "XYZ Traders",
        podUploaded: false,
      },
    ];

    const storedTrips = JSON.parse(localStorage.getItem("truckTrips")) || [];
    setTrips([...storedTrips, ...mockTrips]);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
          <div className="w-1 h-8 bg-[#F08344] rounded-full"></div>
          Trips Management
        </h2>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#F08344] to-[#e67533]">
                  <th className="text-left px-6 py-4 text-white font-semibold text-sm uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold text-sm uppercase tracking-wider">
                    Truck No
                  </th>
                  <th className="text-center px-6 py-4 text-white font-semibold text-sm uppercase tracking-wider">
                    Route
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold text-sm uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold text-sm uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold text-sm uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold text-sm uppercase tracking-wider">
                    Est. Arrival
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold text-sm uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trips.map((trip, index) => (
                  <tr 
                    key={trip.id} 
                    className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800 group-hover:text-[#F08344] transition-colors">
                      {trip.driver}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-700 group-hover:bg-orange-100 transition-colors">
                        {trip.truckNo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{trip.from}</span>
                        <div className="flex items-center">
                          <div className="w-8 h-0.5 bg-gray-300"></div>
                          <MapPin className="w-4 h-4 mx-1 text-[#F08344] animate-pulse" />
                          <div className="w-8 h-0.5 bg-gray-300"></div>
                        </div>
                        <span className="font-medium text-gray-700">{trip.to}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{trip.cargo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">{trip.agent}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{trip.startTime}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{trip.estimatedArrival}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                          trip.status === "Running"
                            ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                            : "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          trip.status === "Running" ? "bg-white animate-pulse" : "bg-white"
                        }`}></span>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No trips available.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}