const redisPubsubService = require('../services/redisPubsub.service')

class InventoryTestService {
    constructor() {
        redisPubsubService.subscribe('purchase_events', (channel, message) => {
            InventoryTestService.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`Updated inventory ${productId} with quantity ${quantity}`)
    }
}

module.exports = new InventoryTestService()
