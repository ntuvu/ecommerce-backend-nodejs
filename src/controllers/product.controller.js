const ProductService = require('../services/product.service');
const ProductServiceXXX = require('../services/product.service.xxx');
const {CREATED, SuccessResponse} = require("../cores/success.response");

class ProductController {

  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Product success!',
      metadata: await ProductServiceXXX.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish product success!',
      metadata: await ProductServiceXXX.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Unpublish product success!',
      metadata: await ProductServiceXXX.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res)
  }

  findAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Draft success',
      metadata: await ProductServiceXXX.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  findAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Publish success',
      metadata: await ProductServiceXXX.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list search success',
      metadata: await ProductServiceXXX.searchProducts(req.params)
    }).send(res)
  }
}

module.exports = new ProductController()
