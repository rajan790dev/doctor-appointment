import express from 'express'
import { appointmentComplete, doctorAppointments, doctorCancelAppointment, doctorDashboard, doctorList, doctorLogin, doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter=express.Router();

doctorRouter.get('/list',doctorList);
doctorRouter.post('/doctor-login',doctorLogin);
doctorRouter.post('/doctor-appointments',authDoctor,doctorAppointments);
doctorRouter.post('/appointment-completed',authDoctor,appointmentComplete);
doctorRouter.post('/appointment-cancel',authDoctor,doctorCancelAppointment);
doctorRouter.post('/dashboard',authDoctor,doctorDashboard);
doctorRouter.get('/profile',authDoctor,doctorProfile);
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile);
export default doctorRouter;