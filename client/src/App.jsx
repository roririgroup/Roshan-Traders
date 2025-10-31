import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { NotificationProvider } from './lib/notifications.jsx'
import { AuthProvider } from './Context/AuthContext'


function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
