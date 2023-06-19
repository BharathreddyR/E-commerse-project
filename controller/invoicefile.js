const express = require('express')
const router = express.Router()
const User = require('../model/usermodel')
const Product = require('../model/productmodel')
const validate = require('./validations')
const Order = require('../model/ordermodel')
const invoice = require('../model/invoicemodel')
router.post('/invoice/:userid', async (req, res) => {
    try {
        const reqBody = req.body;
        const userId = req.params.userid
        let product = await Order.findOne({ userId: userId })
        // console.log(product)
        let productItems = product.items
        //console.log(productItems)

        let products1 = productItems.map((a) => {
            return a.productId
        })

        let productId = products1
        // console.log(productId)
        let UserName = await User.findOne({ _id: userId })
        let products = await Product.findOne({ _id: productId })
        let itemss = product.items
        console.log(itemss)
        let productPrice = products.price
        console.log(productPrice)
        let GstPrice = (18 / 100) * productPrice
        let gst = GstPrice

        let invoiceData = {
            userId: userId,
            user_name: UserName.fname,
            //   items:product.productItems,
            items: itemss,
            productPrice: productPrice,
            GST: GstPrice,
            totalPrice: productPrice + gst,
            address: UserName.address


        }

        const data = await invoice.create(invoiceData)
        res.status(200).send({ status: false, message: 'sucessfully crete invoice', data: data })

    } catch (error) {
        res.status(400).send({ status: false, message: error.message })

    }

})


///get
router.get('/getinvoice/:userid', async (req, res) => {
    try {
        const invoiceId = req.params.userid
        const findInvoice = await invoice.find({ _id: invoiceId })
    if(!findInvoice){
        res.status(400).send({status:false,message:"invoiceid is not valid id" })
    }
    console.log(findInvoice)  


    }

    catch (error) {
        res.status.send({ status: false, message: error.message })

    }

})






module.exports = router






    // let { userId,items,GST,totalPrice,address,} = reqBody
    // if (!validate.isValid(userId)) {
    //     res.status(400).send({ status: false, message: 'user id is required' })
    // }
    // if (!validate.isValidObjectId(userId)) {
    //     res.status(400).send({ status: false, message: `${userId}is invalid user id` })
    //     return
    // }
    // if (!validate.isValid(items)) {
    //     res.status(400).send({ status: false, messsage: " item field is required" })
    //     return
    // }
    // let productID =items[0].productId;
    // let productNAME =items[0].productName;
    // if(!validate.isValid(productID)){
    //     res.status(400).send({status:false,message:"product field is required"})
    //     return
    // }
    // if(!validate.isValidObjectId(productID)){
    //    res.status(400).send({status:false,message:"prodcut id  vaid"})
    //    return
    // }
    // if(!validate.isValid(productNAME)){
    //     res.status(400).send({status:false,message:"prodcut id  vaid"})
    //     return
    //  }
    // if(!validate.isValid(GST)){
    //     res.status(400).send({status:false,message:"gst is required"})
    //     return
    // }
    // if(!validate.isValid(totalPrice)){
    //     res.status(400).send({status:false,message:"total price"})
    //     return
    // }

    // if (!validate.isValid(address)) {
    //     res.status(400).send({ status: false, messsage: " address field is required" })
    //     return
    // }
    // if (!validate.isValid(address.shipping)) {
    //
