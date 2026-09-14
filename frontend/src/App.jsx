import './App.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={ <LoginPage />}/>
        <Route path="/register" element={ <RegisterPage />}/>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={ <HomePage />}/>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
