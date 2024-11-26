const express = require('express')
const cartController = require('../../controllers/cart.controller')
const asyncHandler = require("../../helpers/asyncHandler");
const {authentication} = require("../../auth/authUtils");

const router = express.Router()

router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.get('', asyncHandler(cartController.list))
router.post('/update', asyncHandler(cartController.update))

module.exports = router

