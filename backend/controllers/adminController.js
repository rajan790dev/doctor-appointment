import validator from "validator"
import bcrypt from 'bcrypt'
import { v2 as cloudinary} from "cloudinary";
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      degree,
      speciality,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    if (
      !name ||
      !email ||
      !password ||
      !degree ||
      !speciality ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if(!validator.isEmail(email))
    {
         return res
        .status(400)
        .json({ success: false, message: "Entrer Valid Email" });
    }
    if(password.length<8)
    {
        return res.json({success:false,message:"Please enter a strong password"})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
    const imageUrl = imageUpload.secure_url

    const doctorData = {
        name,
        email,
        password:hashedPassword,
        degree,
        speciality,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        image:imageUrl,
        date:Date.now()
    }
    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()
    res.json({success:true,message:"Doctor Added"})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
}
};

export const loginAdmin = async (req,res) =>{
    try {
        const {email,password} = req.body;
        if(email=== process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)
        {
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else
        {
            res.json({success:false,message:"Invalit Criedentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})

    }
}
export const allDoctors = async(req,res) =>
{
  try {
    const doctors = await doctorModel.find({}).select('-password');
    res.json({success:true,doctors})
  } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
  }
}

export const appointmentsAdmin = async (req,res) =>{
  try {
    const appointments = await appointmentModel.find({});
    res.json({success:true,appointments})
  } catch (error) {
    console.log(error)
      res.json({success:false,message:error.message})
  }
}
export const adminCancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthhorized Action" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const adminDashboard = async (req,res) =>{
  try 
  {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments =await appointmentModel.find({})

    const dashData = {
      doctors:doctors.length,
      appointments:appointments.length,
      patients: users.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }
    res.json({success:true,dashData});
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}