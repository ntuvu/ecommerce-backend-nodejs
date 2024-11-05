const AccessService = require('../services/access.service');

class AccessController {

  signUp = async (req, res, next) => {
    try {
      console.log(`signUp::`, req.body)
      return res.status(200).json(await AccessService.signUp(req.body))
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new AccessController()
