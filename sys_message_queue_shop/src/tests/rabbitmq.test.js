import {connectToRabbitMQ, connectToRabbitMQForTest} from "../dbs/init.rabbitmq";

describe('RabbitMQ connection', () => {
    it('Should be able to connect to RabbitMQ server', async () => {
        const result = await connectToRabbitMQForTest()
        expect(result).toBeUndefined()
    })
})
