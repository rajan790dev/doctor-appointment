import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, getAllDoctors, aToken,changeAvailability}= useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Doctors</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {doctors.map((doctor, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md  transition-all duration-300 overflow-hidden cursor-pointer group relative">


            {/* Doctor Image */}
            <div className="aspect-square bg-gray-100 hover:bg-primary flex items-center justify-center relative">
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300">
                  <svg
                    className="w-12 h-12 text-gray-500 group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Doctor Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900  text-lg mb-1 truncate transition-colors duration-300">
                {doctor.name}
              </h3>
              <p className="text-gray-600  text-sm capitalize transition-colors duration-300">
                {doctor.speciality || 'General physician'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <input 
                 onClick={()=>changeAvailability(doctor._id)}
                  type="checkbox"
                  checked={doctor.available || false}
                  onChange={() => { }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <p>Available</p>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* No doctors message */}
      {doctors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No doctors found</div>
        </div>
      )}
    </div>
  )
}

export default DoctorsList