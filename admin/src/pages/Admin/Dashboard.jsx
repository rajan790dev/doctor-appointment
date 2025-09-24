import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';

const Dashboard = () => {
  const {adminDashboard,dashboardData,aToken,backendUrl} = useContext(AdminContext);
  const {slotDateFormat} = useContext(AppContext)
      const handleCancelAppointment = async (appointmentId, userId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { userId, appointmentId },{headers:{aToken}})
      if (data.success) {
        adminDashboard()
      }
      else {
        toast.error(data.error)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(()=>{
    adminDashboard()
  },[])
  return dashboardData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.doctor_icon} alt="" />
        <div>
          <p className='text-xl font-semibold text-gray-600'>{dashboardData.doctors}</p>
          <p className='text-gray-400'>Doctors</p>
        </div>
      </div>
      <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.appointments_icon} alt="" />
        <div>
          <p className='text-xl font-semibold text-gray-600'>{dashboardData.appointments}</p>
          <p  className='text-gray-400'>Appointments</p>
        </div>
      </div>
      <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.patients_icon} alt="" />
        <div>
          <p className='text-xl font-semibold text-gray-600'>{dashboardData.patients}</p>
          <p  className='text-gray-400'>Patients</p>
        </div>
      </div>
      </div>
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-200'>
        <img src={assets.list_icon} alt="" />
        <p className='font-semibold'>Latest Bookings</p>
      </div>
      <div className='pt-4 border border-t-0 border-gray-200'>
        {
          dashboardData.latestAppointments.map((item,index)=>(
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <img className='rounded-full w-14' src={item.docData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
              </div>
                {item.cancelled || item.isCompleted
                                ? item.isCompleted ? <p className='text-green-400 text-xs font-medium'>Completed</p>:<p className='text-red-400 text-xs font-medium'>Cancelled</p> : <img onClick={() => handleCancelAppointment(item._id, item.userId)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
            </div>
          ))}
      </div>
      </div>
    </div>
  )
}

export default Dashboard