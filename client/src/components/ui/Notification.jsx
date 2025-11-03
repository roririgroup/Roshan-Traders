import React, { useState, useEffect } from 'react'
import { X, Bell, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const Notification = ({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  onClick,
  show = true 
}) => {
  const [isVisible, setIsVisible] = useState(show)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.(id)
    }, 300)
  }

  const handleClick = () => {
    onClick?.(id)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="size-5 text-green-600" />
      case 'error':
        return <XCircle className="size-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="size-5 text-yellow-600" />
      default:
        return <Bell className="size-5 text-blue-600" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  if (!isVisible) return null

  
  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      } ${getStyles()}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 text-sm opacity-90">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleClose}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        {onClick && (
          <div className="mt-3">
            <button
              className="text-sm font-medium underline hover:no-underline"
              onClick={handleClick}
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification
