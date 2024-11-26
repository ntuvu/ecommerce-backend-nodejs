const card = require('../cart.model')
const {Types} = require("mongoose");

const findCardById = async (id) => {
  return await cart.findOne({_id: new Types.ObjectId(id), cart_state: 'active'}).lean()
}

module.exports = {
  findCardById
}
