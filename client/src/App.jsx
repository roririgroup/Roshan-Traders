import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { NotificationProvider } from './lib/notifications.jsx'


function App() {
  return (
    <NotificationProvider>
      <Router>
        <AppRoutes />
      </Router>
    </NotificationProvider>
  )
}


export default App
