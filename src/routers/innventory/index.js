const express = require('express')
const inventoryController = require('../../controllers/innventory.controller')
const asyncHandler = require("../../helpers/asyncHandler");
const {authentication} = require("../../auth/authUtils");

const router = express.Router()

router.use(authentication)

router.post('', asyncHandler(inventoryController.addStockToInnventory))

module.exports = router

