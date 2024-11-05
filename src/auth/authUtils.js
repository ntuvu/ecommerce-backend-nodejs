const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKeyObject, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      expiresIn: '2 days'
    })
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    //
    JWT.verify(accessToken, publicKeyObject, (err, decode) => {
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

module.exports = {
  createTokenPair
}
