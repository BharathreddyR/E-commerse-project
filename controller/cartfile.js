const express = require('express')
const router = express.Router()
const User = require('../model/usermodel')
const Product=require('../model/productmodel')
const validate = require('./validations')
const jwt = require('jsonwebtoken')
const Cart = require('../model/cartmodel')
const { userAuth } = require('../middleware/middleware')
router.post('/:userid/createCart', userAuth, async (req, res) => {
    try {

        let reqBody = req.body
        let id = req.body.userid
        const userIdFromToken = req.userId

        if (!validate.isValidObjectId(id)) {
            res.status(400).send({ status: false, message: "please enter valid details" })
            return
        }

        if (!validate.isValidRequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "please enter valid details" })
            return
        }

        if (userIdFromToken !== id) {
            res.status(400).send({ status: false, message: "user Authorization failed" })
            return
        }

        let { userId, items, totalPrice, totalItems } = reqBody

        if (id === userId) {
            if (!validate.isValid(userId)) {
                res.status(400).send({ status: false, message: "enter valide user id" })
                return
            }

        }
        if (!validate.isValidObjectId(userId))
            if (!validate.isValid(items)) {
                res.status(400).send({ status: false, message: 'product Title is required' })
                return
            }

        if (!validate.isValid(userId)) {
            res.status(400).send({ status: false, message: 'user id is required' })
        }
        if (!validate.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: `${userId}is invalid user id` })
            return
        }
        // const finUser = await Cart.findOne({ userId })
        // if (!finUser) {
        //     res.status(400).send({ status: false, message: "user dose not exist" })
        //     return
        // }

        let productID = items[0].productId
        let proQuantity = items[0].quantity


        if (!validate.isValid(productID)) {
            res.status(400).send({ status: false, message: ' enter productid is required' })
            return
        }
        if (!validate.isValidObjectId(productID)) {
            res.status(400).send({ status: false, message: 'prodoct id valid' })
            return
        }
        if (!validate.isValid(proQuantity)) {
            res.status(400), send({ status: false, message: 'enter  a quanity number' })
        }
        if (!validate.isValid(totalPrice)) {
            res.status(400), send({ status: false, message: 'enter  a total price number' })
        }
        if (!validate.isValid(totalItems)) {
            res.status(400), send({ status: false, message: 'enter  a total items number' })
        }
        let saveCart = {
            userId,
            items,
            totalPrice,
            totalItems
        };
        // const checkPrice = await Product.findOne({ _id: productID })
        // if (!checkPrice) {
        //     res.status(404).send({ status: false, message: `${productID} id dose not exist` })
        //     return
        // }
        const createCart = await Cart.create(saveCart)
        res.status(201).send({ status: true, message: "cart successfully created", data: createCart })
        return
    } catch (error) {
    res.status(500).send({ status: false, message: error.message })
    }
})
router.put('/:userid/CreatCart',async function (req, res) {
    try {
        const id = req.params.userid
        const requestBody = req.body
        const userIdFromToken = req.userId
        
        if (!validate.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Please provide valid data in request body" })
            return
        }

        if (!validate.isValidObjectId(id)) {
            res.status(400).send({ status: false, message: "CArt Id should be valid" })
            return
        }
        let CartDetails = await Cart.findOne({ _id:id })
        
        if (!CartDetails) {
            res.status(404).send({ status: false, message: "No prodcutid data found" })
            return
        } 
    
        if (!(userIdFromToken === id)) {
            res.status(400).send({ status: false, message: "user Authorization failed" })
            return
        }
        let { cartId, productId, removeProduct} =reqBody

        if (!validate.isValid(cartId)) {
            res.status(400).send({ status: false, message: 'enter a cart is required ' })
            return
        }
        if (!validate.isValidObjectId(cartId)) {
            res.status(400).send({ status: false, message: "cart id  is not valid" })
            return
        }
        const findCart = await Cart.findOne({_id:id,_id:cartId })
        if (!findCart) {
            res.status(400).send({ status: false, message: "cart dose not exist" })
            return
        }
        if (!validate.isValid(productId)) {
            res.status(400).send({ status: false, message: 'enter product is required ' })
            return
        }
        if (!validate.isValidObjectId(productId)) {
            res.status(400).send({ status: false, message: "product id  is not valid" })
            return
        }
        const findProduct = await Product.findOne({_id:Product})
        if (!findProduct) {
            res.status(400).send({ status: false, message: "prodcut dose not exist" })
            return

        }
        let updatedProductDetails = await Product.findOneAndUpdate({_id:id}, newData, { new: true })
      
        return res.status(200).send({ status: true, message: 'product details updated successfully', data: updatedProductDetails })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}) 

router.get('/:userid/cart',userAuth,async(req,res)=>{
    try {
        const userId = req.params.userid;
        const userIdFromToken = req.userId;

        if (!validate.isValidObjectId(userId)) {
            res.status(404).send({ status: false, message: `${userId} is not valid user id ` });
            return;
        }

        if (!(userIdFromToken === userId)) {
            res.status(400).send({ status: false, message: "user Authorization failed" })
            return
        }

        let getUser = await User.findOne({ _id: userId });
        if (!getUser) {
            return res.status(404).send({ status: false, msg: "user does not exist" });
        }
        let getCart = await Cart.findOne({ userId: userId });
        if (!getCart) {
            return res.status(404).send({ status: false, msg: "cart does not exist" });
        }
        res.status(200).send({ status: true, message: "User cart details", data: getCart });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
})
router.delete('/deletecart/:userid',userAuth,async(req,res)=>{
    try{
        const id =req.params.userid
        const userIdFromToken =req.userid
        if(!validate.isValidObjectId(id)){
            res.status(400).send({status:false,message:'id is not avalid userid'})
        }
        if(userIdFromToken===id){
            res.status(400).send({status: false, message: "user Authorization failed"})
        }
        const isUserExist = await User.findOne({ _id: id })
        if (!isUserExist) {
            return res.status(400).send({ status: false, message: `${id} user not available` })
        }




    }catch(error){

    }
})



module.exports = router
