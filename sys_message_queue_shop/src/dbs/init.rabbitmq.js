const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:123456@localhost')
        if (!connection) {
            throw new Error('Connection fail');
        }

        const channel = await connection.createChannel()

        return {channel, connection}
    } catch (err) {
        console.error('Error connecting to RabbitMQ', error)
        throw err
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const {channel, connection} = await connectToRabbitMQ()

        const queue = 'test-queue'
        const message = 'Hello, this is message'

        await channel.assertQueue(queue, message)
        await channel.sendToQueue(queue, Buffer.from(message))

        await connection.close()
    } catch (err) {
        console.error(err)
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, {durable: true})
        console.log(`Waiting for message...`)
        channel.consumer(queueName, msg => {
            console.log(`Receive message: ${queueName}::`, msg.content.toString())
        }, {
            noAck: true
        })
    } catch (error) {
        console.error('error publish message to rabbitMQ::', error)
        throw error
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest
}
