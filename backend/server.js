import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import cloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
const app = express();
const PORT  = process.env.PORT || 4000

app.use(express.json())
app.use(cors())
connectDB()

app.use('/api/admin',adminRouter)
app.use('/api/doctors',doctorRouter)
app.use('/api/user',userRouter)
app.get('/',(req,res)=>{
    res.send('Api Working');
})
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})