import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from "../context/AppContext";
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const { backendUrl, currentUser, getAllDoctors } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (currentUser?._id) {
      loadAppointments();
    }
  }, [currentUser]);

  const handleCancelAppointment = async (appointmentId, userId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { userId, appointmentId })
      if (data.success) {
        getAllDoctors()
        loadAppointments();
      }
      else {
        toast.error(data.error)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(backendUrl + '/api/user/get-appointments', {
        userId: currentUser._id
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());

      }
    } catch (error) {
      console.log(error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verify-razorpay', response)
          if (data.success) {
            loadAppointments()
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }
  const handlePayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId })
      if (data.success) {
        initPay(data.order)

      }
    } catch (error) {
      toast.error(error.message)
      console.log(error.message)
    }
  };

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedAppointments = showAll ? appointments : appointments.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8">
          <p className="text-red-600 font-medium mb-2">Error Loading Appointments</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={loadAppointments}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-800 mb-2">My Appointments</h1>
        <div className="h-1 w-16 bg-indigo-600 rounded-full"></div>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-zinc-600 font-medium mb-2">No appointments found</p>
            <p className="text-zinc-500 text-sm">Your upcoming appointments will appear here</p>
          </div>
        ) : (
          displayedAppointments.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-start">
                  {/* Doctor Image */}
                  <div className="flex justify-center lg:justify-start">
                    <div className="relative">
                      <img
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover bg-indigo-50 border-2 border-indigo-100"
                        src={item.docData.image}
                        alt={`Dr. ${item.docData.name}`}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjY0IiBjeT0iNDQiIHI9IjIwIiBmaWxsPSIjOUM2NEZGIi8+CjxwYXRoIGQ9Ik0zNiA5NkM0MCA4MCA1MCA3MiA2NCA3MkM3OCA3MiA4OCA4MCA5MiA5NiIgZmlsbD0iIzlDNjRGRiIvPgo8L3N2Zz4K';
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-800 mb-1">
                        {item.docData.name}
                      </h3>
                      <p className="text-indigo-600 font-medium text-sm">
                        {item.docData.speciality}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-zinc-700 font-semibold text-sm mb-1 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Address
                        </p>
                        <div className="ml-6 text-zinc-600 text-sm space-y-0.5">
                          <p>{item.docData.address.line1}</p>
                          <p>{item.docData.address.line2}</p>
                        </div>
                      </div>

                      <div className="ml-6">
                        <div className="inline-flex items-center bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
                          <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                          </svg>
                          <span className="font-semibold text-indigo-700 text-sm mr-2">
                            {item.slotDate.replace(/_/g, '/')}
                          </span>
                          <span className="text-indigo-600 text-sm">
                            | {item.slotTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 w-full lg:w-auto">
                    {/* Pay Online button */}
                  {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 text-stone-500 bg-indigo-50'>Paid</button>}

                    {!item.cancelled && !item.payment && !item.isCompleted &&(
            
                      <button
                        onClick={() => handlePayment(item._id)}
                        className="group relative px-6 py-3 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 min-w-full lg:min-w-[180px] overflow-hidden cursor-pointer"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Pay Online
                        </span>
                        <div className="absolute inset-0 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </button>
                    )}

                    {!item.cancelled && !item.isCompleted &&(
                      <button
                        onClick={() => handleCancelAppointment(item._id, item.userId)}
                        className="group relative px-6 py-3 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 min-w-full lg:min-w-[180px] overflow-hidden cursor-pointer"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel Appointment
                        </span>
                        <div className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </button>
                    )}
                  {item.isCompleted && <button className='sm:min-w-48 py-2 
                 text-green-500'>Appointment Completed</button>}
                  {item.cancelled && <button className='sm:min-w-48 py-2 
                 text-red-500'>Appointment Cancelled</button>}
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-3 border-t border-indigo-200">
                <div className="flex items-center justify-between">

                  <span className="text-xs text-indigo-600">Appointment #{index + 1}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Show More/Less Button */}
      {appointments.length > 3 && (
        <div className="text-center mt-8">
          <button
            onClick={handleShowAll}
            className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300"
          >
            <span>{showAll ? 'Show Less' : `View All Appointments (${appointments.length})`}</span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;