import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}


export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    }
    
    setNotifications(prev => [...prev, newNotification])
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const showOrderNotification = useCallback((order) => {
    return addNotification({
      type: 'info',
      title: 'New Order Received',
      message: `Order #${order.id} from ${order.customerName} - ₹${order.totalAmount.toLocaleString()}`,
      duration: 0, // Don't auto-dismiss
      orderId: order.id,
      order: order
    })
  }, [addNotification])

  const showSuccessNotification = useCallback((message) => {
    return addNotification({
      type: 'success',
      title: 'Success',
      message,
      duration: 3000
    })
  }, [addNotification])

  const showErrorNotification = useCallback((message) => {
    return addNotification({
      type: 'error',
      title: 'Error',
      message,
      duration: 5000
    })
  }, [addNotification])

  const showWarningNotification = useCallback((message) => {
    return addNotification({
      type: 'warning',
      title: 'Warning',
      message,
      duration: 4000
    })
  }, [addNotification])

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showOrderNotification,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
