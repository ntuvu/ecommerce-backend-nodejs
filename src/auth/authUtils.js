const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const HEADER = require('../constants/headers')
const {AuthError, NotFoundError} = require("../cores/error.response");
const {findByUserId} = require('../services/keyToken.service')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    })
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    //
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err)
      } else {
        console.log(`decode verify::`, decode)
      }
    })
    return {accessToken, refreshToken}
  } catch (err) {

  }
}

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]

  if (!userId) throw new AuthError('Invalid Request')

  const keyStore = await findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not found keyStore')

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
      const decodedUser = JWT.verify(refreshToken, keyStore.privateKey)
      if (userId !== decodedUser.userId) {
        throw new AuthError('Invalid UserId')
      }

      req.keyStore = keyStore
      req.user = decodedUser
      req.refreshToken = refreshToken
      return next()
    } catch (err) {
      throw err
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthError('Not found accessToken')

  try {
    console.log(`accessToken::`, accessToken)
    console.log(`keyStore::`, keyStore.publicKey)
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodedUser.userId) {
      throw new AuthError('Invalid UserId')
    }

    req.keyStore = keyStore
    req.user = decodedUser
    return next()
  } catch (err) {
    throw err
  }
})

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
}
