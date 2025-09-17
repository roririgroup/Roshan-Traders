import React from 'react'

export default function FilterBar({
  search = '',
  onSearchChange = () => {},
  placeholder = 'Search...',
  selects = [],
  className = ''
}) {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-3 sm:p-4 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 ${className}`}>
      <div className="flex-1">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {selects.map((sel) => (
          <div key={sel.name} className="min-w-[140px]">
            <select
              value={sel.value}
              onChange={(e) => sel.onChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {sel.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}


