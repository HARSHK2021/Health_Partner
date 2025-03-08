// user model 
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    middleName:{ 
        type:String,

    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:email,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:[""]
    }
})
