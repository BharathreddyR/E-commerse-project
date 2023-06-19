// register user
const express = require('express')
const router = express.Router()
const User = require('../model/usermodel')
const validate = require('./validations')
const jwt = require('jsonwebtoken')
const { userAuth } = require('../middleware/middleware')
router.post('/user', async (req, res) => {
    try {
        let reqBody = req.body
        if (!validate.isValidRequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "no user Details found" });
            return;
        }
        let { fname, lname, email, phone, password, address } = reqBody;

        if (!validate.isValid(fname)) {
            res.status(400).send({ status: false, message: "username field is not be empty" });
            return;
        }
        if (!validate.isValid(lname)) {
            res.send(400).send({ status: false, message: "username field is not be empty" });
            return
        }
        if (!validate.isValid(email)) {
            res.send(400).send({ status: false, messsage: "email field is not be empty" })
            return
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
            res.status(400).send({ status: false, message: `${email} is not a valid email` });
            return;
        }

        let findEmail = await User.findOne({ email });

        if (findEmail) {
            res.status(400).send({ status: false, message: `${email} is already registered please login` });
            return;
        }
        if (!validate.isValid(phone)) {
            res.send(400).send({ status: false, messsage: "phone field is not be empty" })
            return
        }
        if (!validate.isValidPhone(phone)) {
            res.status(400).send({ status: false, message: `${phone} is not a valid phone` });
            return;
        }

        let findPhone = await User.findOne({ phone });

        if (findPhone) {
            res.status(400).send({ status: false, message: `${phone} is already registered please login` });
            return;
        }

        if (!validate.isValid(password)) {
            res.send(400).send({ status: false, messsage: "password field is not be empty" })
            return
        }
        if (!(password.length <= 8)) {
            res.status(400).send({ status: false, message: "password length must be 8 " });
            return;
        }

        if (!validate.isValid(address)) {
            res.send(400).send({ status: false, messsage: " address field is required" })
            return
        }
        if (!validate.isValid(address)) {
            res.send(400).send({ status: false, messsage: " address field is required" })
            return
        }
        if (!validate.isValid(address.shipping)) {
            res.send(400).send({ status: false, messsage: "Invalid request parameters. Please Provide valid shipping  address" })
            return
        }

        if (!validate.isValid(address.shipping.street)) {
            res.send(400).send({ status: false, messsage: "Invalid request parameters. Please Provide valid  street  shipping  street address" })
            return
        }
        if (!validate.isValid(address.shipping.city)) {
            res.send(400).send({ status: false, messsage: "Invalid request parameters. Please Provide valid  city shipping address " })
            return
        }
        if (!validate.isValid(address.shipping.pincode)) {
            res.send(400).send({ status: false, messsage: "Invalid request parameters. Please Provide valid  pincode shipping address" })
            return
        }
        if (!validate.isValid(address.billing)) {
            res.send(400).send({ status: false, messsage: "Invalid request parameters. Please Provide valid billing address" })
            return
        }
        if (!validate.isValid(address.billing.street)) {
            res.send(400).send({ status: false, messsage: "Invalid request parameters. Please Provide valid  street billing address" })
            return
        } if (!validate.isValid(address.billing.pincode)) {
            res.send(400).send({ status: false, messsage: "Invalid request parameters. Please Provide valid  pinocode billing address" })
            return
        }
        if (!validate.isValid(address.billing.pincode)) {
            res.send(400).send({ status: false, messsage: "Invalid request parameters. Please Provide valid  pincode billing address" })
            return
        }
        let saveData = {
            fname,
            lname,
            email,
            //profileImage,
            phone,
            password,
            address
        }
        const userData = await User.create(saveData);
        res.status(200).send({ status: true, message: 'user sucesfully created', data: userData })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
})
//loginup
router.post('/loginUp', async (req, res) => {
    try {
        const requestBody = req.body
        if (!validate.isValidRequestBody) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide author details' })
            return
        }
        const { email, password } = req.body
        if (!validate.isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        if (!validate.isValid(password)) {
            res.status(400).send({ status: false, message: 'password is required' })
        }
        const user = await User.findOne({ email, password });

        if (!user) {
            res.status(401).send({ status: false, message: `Invalid login credentials` });
            return
        }

        const token = await jwt.sign({ userId: user._id }, 'secretkey', {

            expiresIn: "3h"

        })

        res.header('x-api-key', token);
        res.status(200).send({ status: true, message: `user login successfull`, data: { token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
})
//getuser
router.get('/:userid', userAuth, async (req, res) => {
    try {
        let userId = req.params.userid;
        let userToken = req.userId;

        if (!validate.isValidObjectId(userId)) {
            res
                .status(404)
                .send({ status: false, message: `${userId} is not valid user id ` });
            return;
        }

        if (userToken !== userId) {
            res.status(400).send({ status: false, message: "authorization failed!" });
            return;
        }

        let getUser = await User.findOne({ _id: userId });
        if (!getUser) {
            return res.status(404).send({ status: false, msg: "Provide valid UserId" });
        }
        res.status(200).send({ status: true, message: "User profile details", data: getUser });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
})

//update
router.post('/update/:userid', userAuth, async (req, res) => {
    try {
        let userId = req.params.userid;
        const requestBody = req.body;
        let TokenDetail = req.userId

        if (!validate.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: "enter valid object Id" })
        }

        if (!validate.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "which filed do you want to update ?" })
            return
        }

        const UserFound = await User.findOne({ _id: userId })
        if (!UserFound) {
            return res.status(404).send({ status: false, message: `User not found with given UserId` })
        }

        if (!(TokenDetail === userId)) {
            res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
            return
        }

        let { fname, lname, email, phone } = requestBody
        if (!validate.isValid(fname)) {
            res.status(400).send({ status: false, message: 'fname  is required' })
            return
        }    
        const istitleAlreadyUsed = await User.findOne({ fname });
            
        if (istitleAlreadyUsed) {
                res.status(400).send({ status: false, message: `${fname}  is already registered` })
                return
        }
        if (!validate.isValid(lname)) {
            res.status(400).send({ status: false, message: 'lname is required' })
            return
        }    
        const islnameAlready= await User.findOne({ lname});
            
        if (islnameAlready) {
            res.status(400).send({ status: false, message: `${lname}  is already registered` })
            return
        }
        if (!validate.isValid(email)) {
            res.status(400).send({ status: false, message: 'email is required' })
            return
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        };
        const isemailAlreadyUsed = await User.findOne({ email });
            
        if (isemailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email}  is already registered` })
            return
        }
        
        let newData={
            fname,
            lname,
            email,
            phone
        }
        let updatedUserDetails = await User.findOneAndUpdate({_id:userId}, newData, { new: true })
        return res.status(200).send({ status: true, message: 'update user details successfully', data: updatedUserDetails })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
    })



module.exports = router