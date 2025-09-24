import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import ReleatedDoctors from '../components/ReleatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, verifyToken, backendUrl, getAllDoctors, currentUser } = useContext(AppContext);
  const navigate = useNavigate();
  const daysofWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // Fetch doctor info from context
  const fetchDocInfo = async () => {
    const doc = doctors.find(doc => doc._id === docId);
    setDocInfo(doc);
  };

  // Format Date object to 12-hour time string: "hh:mm AM/PM"
  const formatTime12Hour = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // 0 hour = 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // Get available slots for 7 days
  const getAvailableSlots = async () => {
    if (!docInfo) return;

    const today = new Date();
    const allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // End time: 9 PM
      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      // Start time
      if (i === 0) {
        const now = new Date();
        currentDate.setHours(Math.max(now.getHours() + 1, 10));
        currentDate.setMinutes(now.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
        const slotTimeFormatted = formatTime12Hour(currentDate);

        // Normalize booked slots to uppercase
        const bookedSlots = (docInfo.slots_booked[slotDate] || []).map(t => t.toUpperCase());
        const isSlotAvailable = !bookedSlots.includes(slotTimeFormatted.toUpperCase());

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: slotTimeFormatted,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  // Book appointment
  const bookAppointment = async () => {
    const isValid = await verifyToken();
    if (!isValid) return;

    try {
      const date = docSlots[slotIndex][0].datetime;
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', {
        userId: currentUser._id,
        docId,
        slotDate,
        slotTime
      });

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  return docInfo && (
    <div>
      {
        !docInfo.available && navigate('/doctors') 
      }
      {/* Doctor Info */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 texty-sm text-gray-600 mt-1'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <div>
            <p className='text-gray-500 font-medium mt-4'>Appointment fee:<span className='text-gray-800'>${docInfo.fees}</span></p>
          </div>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
              key={index}
            >
              <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full mt-4">
          {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-primary text-white" : "text-gray-400 border border-gray-300"}`}
              key={index}
            >
              {item.time}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          disabled={!slotTime}
          className={`bg-primary px-5 py-2 rounded-full mt-6 disabled:cursor-not-allowed disabled:bg-[#5f6fffc2] text-white cursor-pointer hover:bg-[#4a5cfe]`}
        >
          Book Appointment
        </button>
      </div>

      <ReleatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
