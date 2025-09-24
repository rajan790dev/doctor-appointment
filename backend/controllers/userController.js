import validator from "validator";
import bcrypt from "bcrypt";
import userrModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Detals" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a 8 Digit Strong Password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userrModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
      } else {
        res.json({ success: false, message: "Invalid Cridentials" });
      }
    } else {
      res.json({ success: false, message: "User does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export const myProfile = async (req, res) => {
  try {
    const { token } = req.headers;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const objectId = new mongoose.Types.ObjectId(decoded.id);

    const user = await userModel.findById(objectId).select("-password -__v"); // password hide kar diya

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const editProfile = async (req, res) => {
  try {
    const { _id, email, ...rest } = req.body;

    const user = await userModel
      .findByIdAndUpdate(_id, { $set: rest }, { new: true })
      .select("-password -__v"); // 👈 ye fields hata dega

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const checkToken = async (req, res) => {
  try {
    const { token } = req.headers; // keep as is
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Login Again." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

// api to book  appointment/
export const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // Fetch doctor data excluding password
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    const updatedDoctor = await doctorModel.findOneAndUpdate(
      {
        _id: docId,
        [`slots_booked.${slotDate}`]: { $ne: slotTime }, // only if slot not booked
      },
      {
        $push: { [`slots_booked.${slotDate}`]: slotTime }, // push the slot
      },
      { new: true } // remove upsert
    );

    if (!updatedDoctor) {
      return res.json({ success: false, message: "Slot not available" });
    }
    // Fetch user data excluding password
    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Prepare appointment data
    const appointmentData = {
      userId,
      docId,
      userData,
      docData: { ...docData.toObject(), slots_booked: undefined }, // remove slots_booked
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    // Save appointment
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    res.json({ success: true, message: "Appointment booked" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getAppointment = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const appointments = await appointmentModel
      .find({ userId })
      .populate("docData")
      .populate("userData");

    // Just return appointments, even if empty
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const cancelAppointment = async (req, res) => {
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

// payment using razorpay
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export const paymentRarorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not founde",
      });
    }
    const options = {
      amount: appointmentData.amount*100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };
    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyRazorpay = async(req,res)=>{
  try {
    const {razorpay_order_id} = req.body
    const orederInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    if (orederInfo.status==='paid') 
    {
      await appointmentModel.findByIdAndUpdate(orederInfo.receipt,{payment:true})
      res.json({success:true,message:'Payment Successfull'})
    }
    else
    {
      res.json({success:false,message:'Payment Failed'})
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}