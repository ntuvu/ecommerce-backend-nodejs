const keyTokenModel = require('../models/keytoken.model')
const {Types} = require("mongoose");

class KeyTokenService {

  static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
    try {
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKey,
      //   privateKey: privateKey
      // })
      // return tokens ? tokens.publicKey : null
      const filter = {user: userId},
        update = {publicKey, privateKey, refreshTokensUsed: [], refreshToken},
        options = {upsert: true, new: true};
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (err) {
      return err
    }
  }

  static findByUserId = async (userId) => {
    const keyToken = await keyTokenModel.findOne({user: new Types.ObjectId(userId)});
    return keyToken
  }

  static removeKeyById = async (id) => {
    const removed = await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(id)
    })

    return removed
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshTokensUsed: refreshToken})
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshToken: refreshToken})
  }

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId }).lean();
  };
}

module.exports = KeyTokenService;
