const {SuccessResponse} = require('../cores/success.response')
const DiscountService = require("../services/discount.service");

class DiscountController {

  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create discount code success',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountCodesByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all Discount Code success',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query
      })
    }).send(res)
  }

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all Discount amount success',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res)
  }

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all Discount Code with Product success',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query
      })
    }).send(res)
  }
}

module.exports = new DiscountController()
