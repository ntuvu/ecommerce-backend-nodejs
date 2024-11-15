const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service');
const {createTokenPair, verifyJWT} = require("../auth/authUtils");
const {getInfoData} = require("../utils");
const {BadRequestError, ConflictRequestError, AuthError, ForbiddenError} = require("../cores/error.response");
const {findByEmail} = require("./shop.service");
const {del} = require("express/lib/application");
const {verify} = require("jsonwebtoken");

const ROLES_SHOP = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {

  static handleRefreshToken = async ({refreshToken, user, keyStore}) => {
    const {userId, email} = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something went wrong, plese relogin')
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthError('Shop not registered')
    }

    const foundShop = await findByEmail({email: email})
    if (!foundShop) {
      throw new AuthError('Shop not registered')
    }

    const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user,
      tokens
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log(`delKey::`, delKey)

    return delKey
  }

  static login = async ({email, password, refreshToken = null}) => {
    const foundShop = await findByEmail({email})
    if (!foundShop) {
      throw new BadRequestError('Shop not registered')
    }

    const match = bcrypt.compare(password, foundShop.password)
    if (!match) {
      throw new AuthError('Authentication error')
    }

    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey: privateKey,
      publicKey: publicKey,
      userId: foundShop._id,
    })
    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop
      }),
      tokens
    }
  }

  static signUp = async ({name, email, password}) => {
    try {
      // step1: check email exists
      const holderShop = await shopModel.findOne({ email }, null, { lean: true });
      if (holderShop) {
        console.log(`Shop already registered`)
        throw new BadRequestError('Error: Shop already registered')
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create(
        { name, email, password: passwordHash, roles: [ROLES_SHOP.SHOP] }
      );

      if (newShop) {
        // create privateKey, publicKey
        // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   }
        // })
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        console.log({privateKey, publicKey}) // save to collection KeyStore

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey: publicKey,
          privateKey: privateKey
        })

        if (!keyStore) {
          throw new BadRequestError('keyStore error')
        }

        // create token pair
        const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey);
        console.log(`Create token success::`, tokens)

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ['_id', 'name', 'email'],
              object: newShop
            }),
            tokens
          }
        }
      }

      return {
        code: 200,
        metadata: null
      }
    } catch (err) {
      return {
        code: 'xxx',
        message: err.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService;
