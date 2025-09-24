import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        image:{type:String,default:"https://tse1.mm.bing.net/th/id/OIP.w-f-qDRUjGt9e_SuPTcfcgHaHw?rs=1&pid=ImgDetMain&o=7&rm=3"},
        address:{type:Object,default:{line1:'Not Defined',line2:'Not Defined'}},
        gender:{type:String,default:"Male"},
        dob:{type:String,default:"Not Selected"},
        phone:{type:String,default:"0123456789"},
})
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel