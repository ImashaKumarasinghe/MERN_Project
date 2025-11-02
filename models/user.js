import mongoose from 'mongoose';

// Define user schema
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
        default:"customer"
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false
    },
    img:{
        type:String,
        required:true,
        default:"https://avatar.iran.liara.run/public/boy?username=Ash"
    }

});

// Create the Student model
const User = mongoose.model("Users", userSchema);

export default User;
