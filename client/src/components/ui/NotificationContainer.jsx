import React from 'react'
import Notification from './Notification'

const NotificationContainer = ({ notifications, onRemove, onNotificationClick }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onRemove}
          onClick={onNotificationClick}
        />
      ))}
    </div>
  )
  
}

export default NotificationContainer
