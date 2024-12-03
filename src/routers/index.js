const express = require('express')
const {apiKey, permission} = require("../auth/checkAuth");
const {pushLogToDiscord} = require('../middlewares')

const router = express.Router()

//add log to discord
router.use(pushLogToDiscord)
// check apiKey
router.use(apiKey)
// check permission
router.use(permission('0000'))

router.use('/v1/api/cart', require('./cart'))

router.use('/v1/api/checkout', require('./checkout'))

router.use('/v1/api/discount', require('./discount'))

router.use('/v1/api/product', require('./product'))

router.use('/v1/api', require('./access'))


module.exports = router
