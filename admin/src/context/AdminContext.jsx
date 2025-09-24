import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) =>
{
    const [aToken,setAToken] = useState(localStorage.getItem('aToken')||'')
    const [doctors,setdoctors] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dashboardData,setDashboardData]=useState();
    const [appointments,setAppointments] = useState([]);
    const getAllDoctors = async() =>{
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/all-doctors',{},{headers:{aToken}})
            if(data.success)
            {
                setdoctors(data.doctors)
            }
            else
            {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const changeAvailability = async (docId) =>{
        console.log('working')
        try 
        {
            const {data} =await axios.post(backendUrl + '/api/admin/change-availability',{docId},{headers:{aToken}})
            if (data.success) 
            {
                toast.success(data.message)  
                getAllDoctors()  
            }
            else{
                toast.error(data.message)  
            }
        } 
        catch (error) 
        {
            toast.error(error.message);
        }
    }
    const getAllAppointments = async() =>{
        try {
            const {data} = await axios.get(backendUrl+'/api/admin/appointments',{headers:{aToken}})
            if(data.success){
                setAppointments(data.appointments);
            }
            else
            {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const adminDashboard = async()=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/admin-dashboard',{headers:{aToken}})
        if(data.success)
        {
            setDashboardData(data.dashData)
        }
        else
        {
            return data;
        }
        } catch (error) {
         console.log(error.message);   
        }
    }
    const value = 
    {
        aToken,
        setAToken,
        backendUrl,
        getAllDoctors,
        doctors,
        changeAvailability,
        getAllAppointments,setAppointments,appointments,adminDashboard,dashboardData,setDashboardData
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider