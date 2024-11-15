const {product, clothing, electronic, furniture} = require('../models/product.model')
const {BadRequestError} = require("../cores/error.response");
const {findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProducts} = require("../models/repos/product.repo");

class ProductFactory {

  static productRegistry = {}

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) {
      throw new BadRequestError(`Invalid type:: `, type)
    }

    return new productClass(payload).createProduct()
  }

  static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}) {
    const query = {product_shop, isDraft: true}
    return await findAllDraftsForShop({query, limit, skip})
  }

  static async findAllPublishForShop({product_shop, limit = 50, skip = 0}) {
    const query = {product_shop, isPublish: true}
    return await findAllPublishForShop({query, limit, skip})
  }

  static async publishProductByShop({product_shop, product_id}) {
    return await publishProductByShop({product_shop, product_id})
  }

  static async unPublishProductByShop({product_shop, product_id}) {
    return await unPublishProductByShop({product_shop, product_id})
  }

  static async searchProducts({keySearch}) {
    return await searchProducts({keySearch})
  }
}

class Product {
  constructor({product_name, product_thumb, product_description, product_price, product_type, product_shop, product_attributes, product_quantity}) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_quantity = product_quantity
  }

  async createProduct(product_id) {
    return await product.create({...this, _id: product_id})
  }
}

class Clothing extends Product {

  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes)
    if (!newClothing) {
      throw new BadRequestError('create new Clothing error')
    }

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) {
      throw new BadRequestError('create new Product error')
    }

    return newProduct
  }
}

class Electronic extends Product {

  async createProduct() {
    const newElectronic = await electronic.create({...this.product_attributes, product_shop: this.product_shop})
    if (!newElectronic) {
      throw new BadRequestError('create new Electronic error')
    }

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) {
      throw new BadRequestError('create new Product error')
    }

    return newProduct
  }
}

class Furniture extends Product {

  async createProduct() {
    const newFurniture = await furniture.create({...this.product_attributes, product_shop: this.product_shop})
    if (!newFurniture) {
      throw new BadRequestError('create new Electronic error')
    }

    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) {
      throw new BadRequestError('create new Product error')
    }

    return newProduct
  }
}

ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)
module.exports = ProductFactory