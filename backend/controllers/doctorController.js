// controllers/adminController.js
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });

    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export const doctorList = async (req,res) =>{
  try {
    const doctors = await doctorModel.find({}).select('-password -email');

    res.json({success:true,doctors})
  } catch (error) {
      res.json({success:false,message:error.message})
  }
}
export const doctorLogin = async (req,res) =>
{
  try {
    const {email,password} = req.body;
    const user = await doctorModel.findOne({email})
    if(!user)
    {
      return res.json({success:false,message:"User Not Exist"})
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
     const token = jwt.sign(
      { id: user._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      doctor: {
        id: user._id,
        name: user.name,
        email: user.email,
        specialization: user.specialization,
      },
    });
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}
export const doctorAppointments = async(req,res) =>
{
  try {
    const {docId} = req.body
    const appointments =await appointmentModel.find({docId})
    res.json({success:true,appointments})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}

export const appointmentComplete = async(req,res)=>{
  try {
    const {docId,appointmentId} = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if(appointmentData && appointmentData.docId ===docId)
    {
      await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
      res.json({success:true,message:"Appointment Completed"})
    }else
    {
      
    res.json({success:false,message:"Not Found"})
    }
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}
export const doctorCancelAppointment = async (req, res) => {
  try {
    const {docId,appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    const {  slotDate, slotTime } = appointmentData;
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
export const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    // Calculate total earnings
    let earning = 0;
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earning += item.amount;
      }
    });

    // Unique patients
    let patients = [];
    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    // Dashboard data
    const dashData = {
      earning,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: [...appointments].reverse().slice(0, 5), // safe reverse
    };

    res.json({ success: true, dashData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const doctorProfile = async (req, res) => {
  try {
    const { docId } = req;

    if (!docId) {
      return res.json({ success: false, message: "Doctor ID is required" });
    }

    const profileData = await doctorModel.findById(docId).select('-password');

    if (!profileData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, profileData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const updateDoctorProfile = async (req,res) =>{
  try {
    const {docId,fees,address,available} = req.body

    await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
    res.json({success:true,message:'Profile Updated'});
  } catch (error) {
        res.json({ success: false, message: error.message });
  }
}
