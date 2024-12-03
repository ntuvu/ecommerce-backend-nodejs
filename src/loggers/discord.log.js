const {Client, GatewayIntentBits} = require('discord.js')
const {app: {discord_channel_id, discord_token}} = require('../configs/config.mongodb')

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })

    this.channelId = discord_channel_id

    this.client.on('ready', () => {
      console.log(`Logged is as ${this.client.user.tag}!`)
    })

    this.client.login(discord_token)
  }

  sendMessage(message = 'message') {
    const channel = this.client.channels.cache.get(this.channelId)
    if (!channel) {
      console.error(`Couldn't find the channel...`, this.channelId)
      return
    }

    channel.send(message).catch(e => console.error(e))
  }

  sendToFormatCode(logData) {
    const {
      title = 'Code Example',
      message = 'This is some additional information about the code',
      code
    } = logData

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
        }
      ]
    }

    this.sendMessage(codeMessage)
  }
}

const loggerService = new LoggerService()

module.exports = loggerService
