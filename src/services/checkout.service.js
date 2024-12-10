const {findCardById} = require('../models/repos/card.repo')
const {BadRequestError} = require("../cores/error.response");
const {checkProductByServer} = require("../models/repos/product.repo");
const DiscountService = require("./discount.service");
const {acquireLock, releaseLock} = require("./redis.service");
const order = require('../models/order.model')

class CheckoutService {
  static async checkoutReview({
    cardId, userId, shop_order_ids
  }) {
    // check cardId exist
    const foundCard = await findCardById(cardId)
    if (!foundCard) {
      throw new BadRequestError('Cart not exist')
    }

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0
    }, shop_order_ids_new = []

    // calculate total bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {shopId, shop_discount = [], item_products = []} = shop_order_ids[i]

      // check product available
      const checkProductServer = await checkProductByServer(item_products)
      console.log('checkProductServer::', checkProductServer)
      if (!checkProductServer[0]) {
        throw new BadRequestError('order wrong')
      }

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discount,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      if (shop_discount.length > 0) {
        const {totalPrice = 0, discount = 0} = await DiscountService.getDiscountAmount({
          codeId: shop_discount[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })

        checkout_order.totalDiscount += discount

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }

  static async orderByUser({
    cardId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const {shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({
      cardId,
      userId,
      shop_order_ids: shop_order_ids_new
    })

    const products = shop_order_ids_new.flatMap(order => order.products)
    console.log('product 1 ::', products)
    const acquireProduct = []
    for (let i = 0; i < products.length; i++) {
      const {productId, quantity} = products[i]
      const keyLock = await acquireLock(productId, quantity, cardId)
      acquireProduct.push(keyLock ? true : false)
      if (keyLock) {
        await releaseLock(keyLock)
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError('Some products has been updated, please go to your cart!')
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_products: shop_order_ids_new
    })

    if (newOrder) {

    }

    return newOrder
  }
}

module.exports = CheckoutService
