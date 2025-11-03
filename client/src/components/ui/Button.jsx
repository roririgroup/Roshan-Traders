import React from 'react'

export default function Button({ children, onClick, variant = 'default', size = 'default', className = '', ...props }) {
  let baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  let variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
  }

  let sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant] || ''} ${sizeClasses[size] || ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}