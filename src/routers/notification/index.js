const express = require('express')
const notificationController = require('../../controllers/notification.controller')
const asyncHandler = require("../../helpers/asyncHandler");
const {authentication} = require("../../auth/authUtils");

const router = express.Router()


// authentication
router.use(authentication)
////////////////
router.post('', asyncHandler(notificationController.pushNotiToSystem))
router.get('', asyncHandler(notificationController.listNotiByUser))

module.exports = router
