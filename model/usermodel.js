const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    fname: {
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    // profileImage:{
    //     type:String,
    //     required:true
    // },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:Number,
        required:true,
        minLen:8
    },
    address:{
        shipping:{
            street:{type:String,required:true},
            city:{type:String,required:true},
            pincode:{type:String,required:true}
        },
        billing:{
            street:{type:String,required:true},
            city:{type:String,required:true},
            pincode:{type:Number,required:true}
        }
    }

 }, {timestamps:true});//collection in mongodb database
 module.exports =mongoose.model('userModel',userSchema)