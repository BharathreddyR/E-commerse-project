const express = require('express')
const router = express.Router()
const User = require('../model/usermodel')
const validate = require('./validations')
const Product = require('../model/productmodel')
router.post('/product', async (req, res) => {
    try {
        let reqBody = req.body
        if (!validate.isValidRequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "no user Details found" });
            return;
        }
        let { title, description, price, currencyId, currencyFormat, installments, style, availableSizes } = reqBody
        if (!validate.isValid(title)) {
            res.status(400).send({ status: false, message: "enter valid title" })
            return
        }

        if (!validate.isValid(description)) {
            res.status(400).send({ status: false, message: "enter valid description" })
            return
        }

        if (!validate.isValid(price)) {
            res.status(400).send({ status: false, message: "price is required" })
            return
        }
        if (!validate.isValid(currencyId)) {
            res.status(400).send({ status: false, message: "currencyId is required" })
            return
        }

        if (!validate.isValid(currencyFormat)) {
            res.status(400).send({ status: false, message: "currencyFormat is required" })
            return
        }

        if (!validate.isValid(availableSizes)) {
            res.status(400).send({ status: false, message: `size is required` })
            return
        }
        if (!validate.isValidSize(availableSizes)) {
            res.status(400).send({ status: false, message: `${availableSizes}is not valid size plese enter 's','m''M', 'X', 'L', 'XXL', 'XL` })
            return
        

        }
        let findTitle = await Product.findOne({ title })
        if (findTitle) {
            res.status(403).send({ status: false, message: "product with this title already exist it must be unique" })
            return
        }
        let saveProductData = {
            title,
            description,
            price,
            currencyId,
            currencyFormat,
            availableSizes,
            installments,
            style
        }
        let createProduct = await Product.create(saveProductData)
        res.status(200).send({ status: true, message: `product ${title} created successfully`, data: createProduct })
        return
    } catch (error) {
        res.status(500).send({ seatus: false, message: error.message })
        return
    }
})

//getprodut 
router.get('/getProduct', async (req, res) => {
    try {
        if (req.query.size || req.query.name || req.query.priceGreaterThan || req.query.priceLessThan) {
            let availableSizes = req.query.size
            let title = req.query.name
            let priceGreaterThan = req.query.priceGreaterThan
            let priceLessThan = req.query.priceLessThan
            obj = {}
            if (availableSizes) {
                obj.availableSizes = availableSizes.toUpperCase()
            }
           
            if (priceGreaterThan) {
                obj.price = { $gt: priceGreaterThan }
            }
            if (priceLessThan) {
                obj.price = { $lt: priceLessThan }
            }

            if (priceGreaterThan && priceLessThan) {
                obj.price = { $gt: priceGreaterThan, $lt: priceLessThan }
            }
            obj.isDeleted = false
            obj.deletedAt = null

            console.log(obj)
            const getProductsList = await Product.find(obj).sort({ price: 1 })
           
            if (!getProductsList || getProductsList.length == 0) {
                res.status(400).send({ status: false, message: `product is not available right now.` })
            } else {
                res.status(200).send({ status: true, message: 'Success', data: getProductsList })
            }
        } else {
            const getListOfProducts = await Product.find({ isDeleted: false, deletedAt: null }).sort({ price: 1 })
            res.status(200).send({ status: true, message: 'Success', data: getListOfProducts })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

})
//get product iddd
router.get('/:productId',async(req,res)=>{
try {
    let id = req.params.productId

    if (!validate.isValidObjectId(id)) {
        res.status(404).send({ status: false, message: `${id} is not valid user id ` });
        return;
    }

    let findProduct = await Product.findOne({ _id: id, isDeleted: false })
    if (!findProduct) {
        res.status(404).send({ status: false, message: `product is not available with this ${id} id` })
        return

    }
    const getData = await Product.findOne({_id:id})
    res.status(200).send({status:true,message:'sucesss',data:getData})


    } catch(error){
        res.status(500).send({status:false,message:'internal serve error'})
    }
})
///updAATE PROduct
router.put('/update/:productId',async function (req, res) {
    try {
        const id = req.params.productId
        const requestBody = req.body

        if (!validate.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Please provide valid data in request body" })
            return
        }

        if (!validate.isValidObjectId(id)) {
            res.status(400).send({ status: false, message: "productId should be valid" })
            return
        }
        let productDetails = await Product.findOne({ _id:id })
        
        if (!productDetails) {
            res.status(404).send({ status: false, message: "No prodcutid data found" })
            return
        } 
        const { title,description,price,isFreeShipping,currencyId,currencyFormat,style} = requestBody
        
        if (!validate.isValid(title)) {
            res.status(400).send({ status: false, message: 'product Title is required' })
            return
        }    
        const istitleAlreadyUsed = await Product.findOne({ title });
            
        if (istitleAlreadyUsed) {
                res.status(400).send({ status: false, message: `${title} these title is already registered` })
                return
        }
        
        if (!validate.isValid(description)) {
            res.status(400).send({ status: false, message: 'description is required' })
            return
        }
        if (!validate.isValid(id)) {
            res.status(400).send({ status: false, message: 'product id is required' })
        }
        if (!validate.isValidObjectId(id)) {
            res.status(400).send({ status: false, message: `${_id}is invalid user id` })
            return
        }
        if (!validate.isValid(price)) {
            res.status(400).send({ status: false, message: 'price is required ' })
            return
        }


         if (!validate.isValid(isFreeShipping)) {
            res.status(400).send({ status: false, message: 'is free shipping is required ' })
            return
        }
        if (!validate.isValid(currencyId)) {
            res.status(400).send({ status: false, message: 'currency id is required ' })
            return
        }
        if (!validate.isValid(currencyFormat)) {
            res.status(400).send({ status: false, message: 'currency format is required ' })
            return
        }
        if (!validate.isValid(style)) {
            res.status(400).send({ status: false, message: 'style is required ' })
            return
        }
        let newData={
            title,
            description,
            price,
            isFreeShipping,
            currencyId,
            currencyFormat,
            style
        }
        let updatedProductDetails = await Product.findOneAndUpdate({_id:id}, newData, { new: true })
        return res.status(200).send({ status: true, message: 'product details updated successfully', data: updatedProductDetails })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}) 
router.delete('/:produtid',async(req,res)=>{
    try {
        const productId= req.params.produtid
        const userIdFromToken = req.userId

        if(!validate.isValidObjectId(productId)) {
            res.status(400).send({status: false, message: `${productId} is not a valid book id`})
            return
        }

        if(!validate.isValidObjectId(userIdFromToken)) {
            res.status(400).send({status: false, message: `${userIdFromToken} is not a valid token id`})
            return
        }

        if (!(userIdFromToken === productId)) {
            res.status(400).send({ status: false, message: "user Authorization failed" })
            return
        }

        let deleteProductDetails = await Product.findOneAndDelete({ productId }, { new: true })
        return res.status(200).send({ status: true, message: 'product details deleted successfully', data: deleteProductDetails })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    
    }
   
})




module.exports = router