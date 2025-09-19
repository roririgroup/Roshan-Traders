import React from 'react';

const reportData = [
  { id: 1, name: 'John Doe', department: 'Sales', performance: 'Excellent', sales: 12000 },
  { id: 2, name: 'Jane Smith', department: 'Marketing', performance: 'Good', sales: 9000 },
  { id: 3, name: 'Mike Johnson', department: 'Development', performance: 'Outstanding', sales: 15000 },
  { id: 4, name: 'Emily Davis', department: 'HR', performance: 'Satisfactory', sales: 7000 },
];

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Monthly Report</h1>
        <p className="text-gray-500">Summary of team performance and key metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col">
          <span className="text-gray-500">Total Employees</span>
          <span className="text-2xl font-bold text-gray-800">{reportData.length}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col">
          <span className="text-gray-500">Top Performer</span>
          <span className="text-2xl font-bold text-gray-800">
            {reportData.reduce((prev, curr) => (curr.sales > prev.sales ? curr : prev)).name}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col">
          <span className="text-gray-500">Total Sales</span>
          <span className="text-2xl font-bold text-gray-800">
            ${reportData.reduce((sum, item) => sum + item.sales, 0)}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.performance}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${item.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
