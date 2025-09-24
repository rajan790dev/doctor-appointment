import { createContext, useContext, useState } from "react";
import axios from "axios";
import { AdminContext } from "./AdminContext";
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(localStorage.getItem('dToken'));
  const [appointments, setAppointmets] = useState(null);
  const [dashData, setDashData] = useState();
  const [profileData, setProfileData] = useState();
  const { backendUrl } = useContext(AdminContext)
  const loadAppointments = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/doctors/doctor-appointments', {}, { headers: { dtoken: dToken } })
      setAppointmets(data.appointments)
    } catch (error) {
      console.log(error);
    }
  }
  const getDashData = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/doctors/dashboard', {}, { headers: { dtoken: dToken } })

      if (data.success) {
        setDashData(data.dashData);
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const getProfile = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctors/profile', { headers: { dtoken: dToken } })
      if (data.success) {
        setProfileData(data.profileData)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const editProfile = async (editProfile) => {
    try {
    const { data } = await axios.post(backendUrl + '/api/doctors/update-profile', {
      available: editProfile.available
      , fees: editProfile.fees, address: editProfile.address
    }, { headers: { dtoken: dToken } })
    if(data.success)
    {
      getProfile();
    }
    else
    {
      toast.error(error.message)
    }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const value = {
    dToken, setDToken, loadAppointments, appointments, dashData, getDashData, profileData, getProfile, setProfileData, editProfile
  }
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider