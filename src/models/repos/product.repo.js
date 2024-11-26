const {product, electronic, furniture, clothing} = require('../../models/product.model')
const {Types} = require('mongoose')
const {getSelectData, unGetSelectData} = require("../../utils");

const findAllDraftsForShop = async ({query, limit, skip}) => {
  return await queryProduct({query, limit, skip})
}

const findAllPublishForShop = async ({query, limit, skip}) => {
  return await queryProduct({query, limit, skip})
}

const publishProductByShop = async ({product_shop, product_id}) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })

  if (!foundShop) {
    return null
  }

  foundShop.isDraft = false
  foundShop.isPublish = true

  const {modifiedCount} = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const unPublishProductByShop = async ({product_shop, product_id}) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })

  if (!foundShop) {
    return null
  }

  foundShop.isDraft = true
  foundShop.isPublish = false

  const {modifiedCount} = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const queryProduct = async ({query, limit, skip}) => {
  return await product.find(query)
    .populate('product_shop', 'name email _id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}

const searchProducts = async ({keySearch}) => {
  const regexSearch = new RegExp(keySearch)
  const results = await product.find({isPublish: true, $text: {$search: regexSearch}},{score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .lean()
  return results
}

const findAllProducts = async ({limit, sort, page, filter, select}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
  const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return products
}

const findProduct = async ({product_id, unSelect}) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const updateProductById = async ({productId, payload, model, isNew = true}) => {
  console.log(`payload::`, payload)
  return await model.findByIdAndUpdate(productId, payload, {new: isNew})
}

const getProductById = async (productId) => {
  return await product.findOne({_id: new Types.ObjectId(productId)}).lean()
}

const checkProductByServer = async (products) => {
  return await Promise.all(products.map(async product => {
    const foundProduct = await getProductById(product.productId)
    if (foundProduct) {
      return {
        price: foundProduct.product.price,
        quantity: product.quantity,
        productId: product.productId
      }
    }
  }))
}

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProducts,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer
}
