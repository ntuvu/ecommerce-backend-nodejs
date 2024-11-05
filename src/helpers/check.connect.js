const mongoose = require("mongoose");
const os = require("os");
const process = require('node:process')

const SECOND = 5 * 1000

// count connect
const countConnect = () => {
  const numConnections = mongoose.connections.length
  console.log(`Number of connections:: ${numConnections}`);
}

// check overload connect
const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Example maximum number of connections based on number osf core
    const maxConnections = numCores * 5

    console.log(`Active connections:: ${numConnections}`)
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024}MB`)

    if (numConnections > maxConnections) {
      console.log(`Connection overload detected!`)
    }

  }, SECOND) // monitor every 5 seconds
}

module.exports = {
  countConnect,
  checkOverload
}
