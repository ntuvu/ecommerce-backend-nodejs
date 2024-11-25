const {BadRequestError, NotFoundError} = require('../cores/error.response')
const discount = require('../models/discount.model')
const {Types} = require("mongoose");
const {findAllProducts} = require("../models/repos/product.repo");
const {findAllDiscountCodesUnSelect, checkDiscountExists, findAllDiscountCodesSelect} = require("../models/repos/discount.repo");
class DiscountService {

  static async createDiscountCode(payload) {
    const {
      code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name, description, type,
      value, users_used, max_uses, uses_count, max_uses_per_user
    } = payload

    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError(`Discount code has expired`)
    // }

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
      discount_uses_count: uses_count,
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
      code, shopId, limit, page
    } = payload
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId)
    }).lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError(`Discount not exist!`)
    }

    let products
    const {discount_applies_to, discount_product_ids} = foundDiscount
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: new Types.ObjectId(shopId),
          isPublish: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: {$in: discount_product_ids},
          isPublish: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    return products
  }

  static async getAllDiscountCodesByShop(payload) {
    const {limit, page, shopId} = payload
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: new Types.ObjectId(shopId),
        discount_is_active: true
      },
      select: ['discount_code', 'discount_name'],
      model: discount
    })

    return discounts
  }

  static async getDiscountAmount({codeId, userId, shopId, products}) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: new Types.ObjectId(shopId),
      }
    })

    if (!foundDiscount) {
      throw new NotFoundError('Discount not found!')
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value
    } = foundDiscount

    if (!discount_is_active) {
      throw new NotFoundError('Discount expired')
    }
    if (!discount_max_uses) {
      throw new NotFoundError('Discounts are out')
    }
    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new NotFoundError('Discount expired')
    }

    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`Discount requires a minimum order of ${discount_min_order_value}` )
      }
    }

    if (discount_max_uses_per_user > 0) {
      const usersUseDiscount = discount_users_used.find(user => user.userId === userId)
      if (usersUseDiscount) {
        ///
      }
    }

    console.log('found discount::', foundDiscount)
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({shopId, codeId}) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: new Types.ObjectId(shopId)
    })

    return deleted
  }

  static async cancelDiscountCode({shopId, codeId, userId}) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: new Types.ObjectId(shopId)
      }
    })

    if (!foundDiscount) {
      throw new NotFoundError(`Discount doesn't exist`)
    }

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })

    return result
  }
}

module.exports = DiscountService
