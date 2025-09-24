import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className=' min-h-[70vh] flex flex-col items-center p-4 sm:p-6 lg:p-8'>
      {/* Title */}
      <p className='text-1xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-8 sm:mb-10 lg:mb-12 text-center'>
        CONTACT US
      </p>
      
      {/* Main content section */}
      <div className='flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16 w-full max-w-6xl items-center lg:items-start'>
        {/* Image section */}
        <div className='w-full lg:w-auto flex justify-center lg:justify-start flex-shrink-0 '>
          <img 
            className='rounded-lg shadow-md w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[430px]' 
            src={assets.contact_image} 
            alt="Contact Us" 
          />
        </div>
        
        {/* Contact information */}
        <div className='flex flex-col gap-6 sm:gap-8 w-full lg:flex-1 text-center lg:text-left'>
          {/* Office section */}
          <div className='space-y-3 sm:space-y-4'>
            <p className='text-xl sm:text-2xl font-semibold text-gray-800 mb-4'>
              OUR OFFICE
            </p>
            
            <div className='space-y-2 sm:space-y-3'>
              <p className='text-base sm:text-lg text-gray-600 leading-relaxed'>
                54709 Willms Station
              </p>
              <p className='text-base sm:text-lg text-gray-600 leading-relaxed'>
                Suite 350, Washington, USA
              </p>
            </div>
            
            <div className='space-y-2 sm:space-y-3 mt-2 sm:mt-6'>
              <p className='text-base sm:text-lg text-gray-600'>
                <span className='font-medium text-gray-700'>Tel:</span> (415) 555‑0132
              </p>
              <p className='text-base sm:text-lg text-gray-600'>
                <span className='font-medium text-gray-700'>Email:</span> greatstackdev@gmail.com
              </p>
            </div>
          </div>
          
          {/* Careers section */}
          <div className='mt-1 sm:mt-2 lg:mt-3 space-y-4 sm:space-y-3'>
            <p className='text-xl sm:text-2xl font-semibold text-gray-800'>
              Careers at PRESCRIPTO
            </p>
            
            <p className='text-base sm:text-lg text-gray-600 leading-relaxed'>
              Learn more about our teams and job openings.
            </p>
            
            <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform'>
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
      
     
    </div>
  )
}

export default Contact