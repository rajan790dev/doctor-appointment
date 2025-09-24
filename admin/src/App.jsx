import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  if (aToken) {
    return (
      <div>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            {/* Default / route redirect */}
            <Route path='/' element={<Navigate to="/admin-dashboard" />} />

            {/* Admin routes */}
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorsList />} />

            {/* Catch-all redirect */}
            <Route path='*' element={<Navigate to="/admin-dashboard" />} />
          </Routes>
        </div>
      </div>
    )
  }

  if (dToken) {
    return (
      <div>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            {/* Default / route redirect */}
            <Route path='/' element={<Navigate to="/doctor-dashboard" />} />

            {/* Doctor routes */}
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />

            {/* Catch-all redirect */}
            <Route path='*' element={<Navigate to="/doctor-dashboard" />} />
          </Routes>
        </div>
      </div>
    )
  }

  return (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
