import express from 'express'
import { bookAppointment, cancelAppointment, checkToken, editProfile, getAppointment, loginUser, myProfile, paymentRarorpay, registerUser, verifyRazorpay } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/my-profile',myProfile)
userRouter.post('/edit-profile',editProfile)
userRouter.post('/token',checkToken)
userRouter.post('/book-appointment',bookAppointment)
userRouter.post('/get-appointments',getAppointment)
userRouter.post('/cancel-appointment',cancelAppointment)
userRouter.post('/payment-razorpay',paymentRarorpay)
userRouter.post('/verify-razorpay',verifyRazorpay)
export default userRouter; 