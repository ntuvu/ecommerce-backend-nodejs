const {BadRequestError, NotFoundError} = require('../cores/error.response')
const discount = require('../models/discount.model')
const {Types} = require("mongoose");
class DiscountService {

  static async createDiscountCode(payload) {
    const {
      code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name, description, type,
      value, users_used, max_uses, uses_count, max_uses_per_user
    } = payload

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError(`Discount code has expired`)
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError(`start_date must be before end_date`)
    }

    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId)
    }).lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError(`Discount exist`)
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_users_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })

    return newDiscount
  }

  static async getAllDiscountCodesWithProduct(payload) {
    const {
      code, shopId, userId, limit, page
    } = payload

    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId)
    }).lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError(`Discount not exist!`)
    }

  }
}

module.exports = DiscountService
