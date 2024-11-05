const mongoose = require('mongoose')
const {countConnect} = require('../helpers/check.connect')
const {db: {host, name, port}} = require('../configs/config.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`
console.log(`connectString:: ${connectString}`)

class Database {

  constructor() {
    this.connect()
  }

  connect(type = 'mongodb') {
    mongoose.set(`debug`, true)
    mongoose.set(`debug`, {color: true})

    mongoose.connect(connectString, {
      maxPoolSize: 50
    })
      .then(_ => {
        console.log(`MongoDB Connected!`)
        countConnect()
      })
      .catch(err => console.log(`Error Connected!`))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb
