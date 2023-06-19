const mongoose = require('mongoose')
const  ObjectId = mongoose.Schema.Types.ObjectId
const invoiceSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "userModel",
        required: "order id is required"
    },
    items: [{
        productId: {
            type: ObjectId,
            ref: "Product",
            required: true
        },
        productPrice:{
            type:Number,
            required:false
        },
    }],
    GST:Number,
    totalPrice:Number,
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

 }, {timestamps:true});

module.exports = mongoose.model('INVOICE', invoiceSchema)