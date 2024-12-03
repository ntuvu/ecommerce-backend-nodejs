const LOGGER = require('../loggers/discord.log')

const pushLogToDiscord = async (req, res, next) => {
  try {
    LOGGER.sendToFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === 'GET' ? req.query : req.body,
      message: `${req.get('host')}${req.originalUrl}`,
    })

    return next()
  } catch(err) {
    next(err)
  }
}

module.exports = {
  pushLogToDiscord
}
