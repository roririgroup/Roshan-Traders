const InfoCard = ({ children, title, icon }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200 overflow-hidden group">
    {/* Header */}
    <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
        {title}
      </h3>
    </div>
    
    {/* Body */}
    <div className="p-6 text-gray-600 leading-relaxed">
      {children}
    </div>
  </div>
)


export default InfoCard
