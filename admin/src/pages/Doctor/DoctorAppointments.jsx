import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const DoctorAppointments = () => {
  const {dToken,loadAppointments,appointments} = useContext(DoctorContext);
  const {backendUrl} = useContext(AdminContext)
  const {calculateAge,slotDateFormat} = useContext(AppContext);
  useEffect(()=>{
    if(dToken)
    {
      loadAppointments();
    }
  },[dToken])
  const handleCompleteAppointment = async(appointmentId) =>{
    try {
      const {data} = await axios.post(backendUrl+'/api/doctors/appointment-completed',{appointmentId},{headers:{dtoken:dToken}})
      if(data.success)
      {
        loadAppointments();
      }
      else
      {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
    const handleCancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/doctors/appointment-cancel', { appointmentId },{headers:{dToken}})
      if (data.success) {
        loadAppointments();
      }
      else {
        toast.error(data.error)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return appointments && (
    <div className='w-full max-w-6xl m-5'>
        <p className='mb-3 text-lg font-medium'>All Appointments</p>
        <div className='bg-white border border-gray-200 rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll' >
          <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b border-gray-200'>
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
          </div>
          {appointments.map((item,index)=>(
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 px-6 py-2 border-b border-gray-200 hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{index+1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-10 rounded-full' src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>
              <p className='text-xs inline border border-green-500 px-2 rounded-full w-fit'>{item.payment?'Online':'Cash'}</p>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)} , {item.slotTime} </p>
              <p>${item.amount}</p>
               <div className='flex'>

                  { item.isCompleted || item.cancelled
                  ?(item.isCompleted ? <p className='text-green-500'>Completed</p>:<p className='text-red-500'>Cancelled</p>)
                  : <><img onClick={()=>handleCancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={()=>handleCompleteAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" /></>}
               </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default DoctorAppointments