const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({

    userId: {
        type: objectId,
        ref: "userModel",
        required: "user id is required",
        unique: "user id must be unique"
    },
    
    items: [{
        productId: {
            type: objectId,
            ref: "Product",
            required: "product id is mandatory"
        },
        quantity: {
            type: Number,
            required: "quantity is mandatory",
            min: 1,
            default: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: "price is mandatory"
    },
    totalItems: {
        type: Number,
        required: "totel items is mandatory"
    },
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema) 