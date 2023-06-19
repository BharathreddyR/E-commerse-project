const express = require('express')
const router = express.Router()
const User = require('../model/usermodel')
const Product = require('../model/productmodel')
const validate = require('./validations')
const jwt = require('jsonwebtoken')
const Cart = require('../model/cartmodel')
const { userAuth } = require('../middleware/middleware')
const Order = require('../model/ordermodel')
router.post('/createOrder/:userid', userAuth, async (req, res) => {
    try {

        const reqBody = req.body
        const id = req.params.userid
        const userIdFromToken = req.userId
        // const cartId = req.body

        if (!validate.isValidRequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "please enter valid details" })
            return
        }

        if (!validate.isValidObjectId(id)) {
            res.status(400).send({ status: false, message: "please enter valid user details" })
            return
        }
        if (!(userIdFromToken === id)) {
            res.status(400).send({ status: false, message: "user Authorization failed" })
            return
        }
        // const findUser = await User.findOne({_id:id })

        // if (!findUser) {
        //      res.status(400).send({ status: false, message: "user dose not exist" })
        //     return
        // }
        // const cartUser =await Cart.findOne({_id:id,_id:id})
        // if(!cartUser){
        //     res.status(400).send({ status: false, message: "cart dose not exist" })
        //     return 
        // }

        let { userId, items, totalPrice, totalItems, cancellable, status, cartId, totalQuantity } = reqBody
        if (!validate.isValid(userId)) {
            res.status(400).send({ status: false, message: 'user id is required' })
        }
        if (!validate.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: `${userId}is invalid user id` })
            return
        } if (!validate.isValid(items)) {
            res.status(400).send({ status: false, message: 'user id is required' })
        }
        if (!validate.isValid(cartId)) {
            res.status(400).send({ status: false, message: "enter cart id" })
            return
        }
        if (!validate.isValidObjectId(cartId)) {
            res.status(400).send({ status: false, message: "cart id  is not valid" })
            return
        }
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
            res.status(400).send({ status: false, message: 'enter  a quanity number' })

        }
        if (!validate.isValid(items)) {
            res.status(400).send({ status: false, message: 'enter a items number' })
        }
        if (!validate.isValid(totalPrice)) {
            res.status(400).send({ status: false, message: 'enter  a total price number' })
        }
        if (!validate.isValid(totalItems)) {
            res.status(400).send({ status: false, message: 'enter  a total items number' })

        }
        if (!validate.isValid(cancellable)) {
            res.status(400).send({ status: false, message: 'enter  a cancellable ' })

        }
        if (!validate.isValid(status)) {
            res.status(400).send({ status: false, message: 'enter  a status ' })

        }
        if (!validate.isValid(totalQuantity)) {
            res.status(400).send({ status: false, message: "enter an quantity number" })

        }
        const order = {
            userId,
            items,
            totalPrice,
            totalItems,
            totalQuantity,
            cancellable,
            status
        }

        let newOrder = await Order.create(order)
        res.status(200).send({ status: false, message: 'sucessfully cret order', data: newOrder })

    } catch (error) {
        res.status(400).send({ status: false, message: error.message })

    }
})

router.post('/updateOrder/:userid', userAuth, async (req, res) => {
    try {
        let userId = req.params.userid
        let orderId = req.body.orderId
        const userIdFromToken = req.userId
        if (!validate.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: "please enter valid userId details" })
            return
        }

        if (!(userIdFromToken === userId)) {
            res.status(400).send({ status: false, message: "user Authorization failed" })
            return
        }

        const findUser = await User.findOne({ _id: userId })
        if (!findUser) {
            res.status(400).send({ status: false, message: "user dose not exist" })
            return
        }
        if (!validate.isValidObjectId(orderId)) {
            res.status(400).send({ status: false, message: "please enter valid orderId details" })
            return
        }
        const findOrder = await Order.findOne({ _id: orderId, userId: userId, isDeleted: false })
        if (!findOrder) {
            res.status(400).send({ status: false, message: "order Id does not exist" })
            return
        }
        let isOrderCancellable = findOrder.cancellable
        let status = findOrder.status
        if (isOrderCancellable === true) {
            if (status !== 'cancelled') {
                const orderCancelled = await Order.findOneAndUpdate({ _id: orderId },  { new: true })
                res.status(200).send({ status: true, message: "order successfully   cancelled", data: orderCancelled })
                return
            } else {
                res.status(400).send({ status: false, message: "order already cancelled" })
            }
        } else {
            res.status(400).send({ status: false, message: "order cannot be cancelled" })
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
})
module.exports = router