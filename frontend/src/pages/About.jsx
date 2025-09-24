import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='flex flex-col items-center p-4 sm:p-6 lg:p-8'>
      {/* Title */}
      <p className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 text-center'>
        ABOUT US
      </p>
      
      {/* Main content section */}
      <div className='flex flex-col lg:flex-row mt-6 sm:mt-10 gap-6 sm:gap-8 lg:gap-12 w-full max-w-7xl items-center lg:items-start'>
        {/* Image section */}
        <div className='w-full lg:w-auto flex justify-center lg:justify-start flex-shrink-0'>
          <img 
            className='rounded-lg shadow-md w-full max-w-[250px] sm:max-w-[300px] lg:max-w-[390px]' 
            src={assets.about_image} 
            alt="About Us" 
          />
        </div>
        
        {/* Text content */}
        <div className='flex flex-col gap-4 sm:gap-5 w-full lg:flex-1 text-center lg:text-left'>
          <p className='text-base sm:text-lg text-gray-600 leading-relaxed'>
            Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          
          <p className='text-base sm:text-lg text-gray-600 leading-relaxed'>
            Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
          </p>
          
          <p className='text-lg sm:text-xl font-semibold text-gray-800 mt-2 sm:mt-4'>
            Our Vision
          </p>
          
          <p className='text-base sm:text-lg text-gray-600 leading-relaxed'>
            Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>
        </div>
      </div>
      
      {/* Why choose us section */}
      <div className='mt-16 sm:mt-20 w-full max-w-7xl'>
        <p className='text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-8 sm:mb-10 lg:mb-12 text-gray-800'>
          WHY CHOOSE US
        </p>
        
        {/* Feature cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 justify-items-center'>
          <div className='flex flex-col items-center p-4 sm:p-6 border border-gray-200 rounded-md shadow-sm w-full max-w-sm h-auto min-h-[160px] sm:min-h-[180px]'>
            <p className='text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center'>
              EFFICIENCY:
            </p>
            <p className='text-sm sm:text-base text-gray-600 text-center leading-relaxed'>
              Streamlined Appointment Scheduling That Fits Into Your Busy Lifestyle.
            </p>
          </div>
          
          <div className='flex flex-col items-center p-4 sm:p-6 border border-gray-200 rounded-md shadow-sm w-full max-w-sm h-auto min-h-[160px] sm:min-h-[180px]'>
            <p className='text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center'>
              CONVENIENCE:
            </p>
            <p className='text-sm sm:text-base text-gray-600 text-center leading-relaxed'>
              Access To A Network Of Trusted Healthcare Professionals In Your Area.
            </p>
          </div>
          
          <div className='flex flex-col items-center p-4 sm:p-6 border border-gray-200 rounded-md shadow-sm w-full max-w-sm h-auto min-h-[160px] sm:min-h-[180px] md:col-span-2 xl:col-span-1'>
            <p className='text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center'>
              PERSONALIZATION:
            </p>
            <p className='text-sm sm:text-base text-gray-600 text-center leading-relaxed'>
              Tailored Recommendations And Reminders To Help You Stay On Top Of Your Health.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About