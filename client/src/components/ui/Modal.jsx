import React from 'react'

export default function Modal({ isOpen, onClose, children, inline = false, title, size = 'md' }) {
  if (!isOpen) return null

  const containerClass = inline
    ? 'absolute inset-0 z-40 flex items-center justify-center bg-black/30 p-4'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4'

  const sizeClass = (() => {
    switch (size) {
      case 'sm':
        return 'max-w-sm'
      case 'lg':
        return 'max-w-lg'
      case 'xl':
        return 'max-w-2xl'
      case 'landscape':
        return 'max-w-4xl w-[90vw]'
      case 'full':
        return 'max-w-5xl w-[95vw]'
      default:
        return 'max-w-md'
    }
  })()
  

  return (
    <div className={containerClass}>
      <div className={`bg-white rounded-lg shadow-lg w-full ${sizeClass} relative`}>
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            &#x2715;
          </button>
          {title && (
            <h3 className="text-sm font-medium text-slate-700 mb-2">{title}</h3>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
