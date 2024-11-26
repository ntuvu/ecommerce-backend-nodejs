const CartService = require('../services/cart.service');
const {CREATED, SuccessResponse} = require("../cores/success.response");

class CartController {

  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add to cart success',
      metadata: await CartService.addToCart(req.body)
    }).send(res)
  }

  update = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add to cart success',
      metadata: await CartService.addToCartV2(req.body)
    }).send(res)
  }

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete product in card success',
      metadata: await CartService.deleteUserCart(req.body)
    }).send(res)
  }

  list = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add to cart success',
      metadata: await CartService.getListUserCart(req.query)
    }).send(res)
  }
}

module.exports = new CartController()
