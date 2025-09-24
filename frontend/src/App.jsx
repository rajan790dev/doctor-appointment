import React, { useContext, useEffect } from 'react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import './style.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import { AppContext } from './context/AppContext'
import ProtectedRoute from './Routes/ProtectedRoute'

const App = () => {
  const { verifiedToken,verifyToken } = useContext(AppContext)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <ProtectedRoute>
        <Navbar />
      </ProtectedRoute>

      <Routes>
        <Route
          path="/login"
          element={verifiedToken ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
        <Route path="/doctors/:speciality" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
        <Route path="/my-appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
        <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/appointment/:docId" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ProtectedRoute>
        <Footer />
      </ProtectedRoute>
    </div>
  )
}

export default App
