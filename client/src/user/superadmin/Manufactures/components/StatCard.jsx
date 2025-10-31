const StatCard = ({ icon, label, value, color, gradient }) => (
  <div
    className={`bg-gradient-to-br ${gradient} backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 text-center shadow-lg hover:shadow-xl hover:shadow-${color}/30 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105`}
  >
    <div
      className={`mx-auto mb-3 sm:mb-4 inline-block p-3 sm:p-4 rounded-full bg-gradient-to-br from-${color}-400/30 to-${color}-600/20 ring-2 ring-${color}-400/30 shadow-inner animate-pulse`}
    >
      
      <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white">{icon}</div>
    </div>
    <h3
      className={`font-extrabold text-2xl sm:text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-${color}-300 to-${color}-500 drop-shadow-md`}
    >
      {value}
    </h3>
    <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base font-semibold text-white/70 tracking-wide uppercase">
      {label}
    </p>
  </div>
)

export default StatCard
