import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import axios from 'axios'
const AllAppointments = () => {
  const { calculateAge, slotDateFormat } = useContext(AppContext);
  const { getAllAppointments, aToken, appointments, backendUrl } = useContext(AdminContext);
  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])
  const handleCancelAppointment = async (appointmentId, userId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { userId, appointmentId }, { headers: { aToken } })
      if (data.success) {
        getAllAppointments()
      }
      else {
        toast.error(data.error)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border border-gray-200 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-b-gray-200'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b border-gray-200 hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="" />
              <p>{item.docData.name}</p>
            </div>
            <p>${item.amount}</p>
            {item.cancelled || item.isCompleted
              ? item.isCompleted ? <p className='text-green-400 text-xs font-medium'>Completed</p> : <p className='text-red-400 text-xs font-medium'>Cancelled</p> : <img onClick={() => handleCancelAppointment(item._id, item.userId)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments