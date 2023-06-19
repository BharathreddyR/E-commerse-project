const express =require('express')
const router =express.Router()

const user =require('./controller/userfile')
router.use('/first',user)
const product =require('./controller/productfile')
router.use('/second',product)

const cart =require('./controller/cartfile')
router.use('/third',cart)
const order=require('./controller/order')
router.use('/four',order)
const invoice =require('./controller/invoicefile')
router.use('/last',invoice)

module.exports =router