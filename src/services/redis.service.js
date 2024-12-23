const redis = require('redis')

const redisClient = redis.createClient()

const acquireLock = async (productId, quantity, cardId) => {
  const key = `lock_v2023_${productId}`
  const retryTimes = 10
  const expireTime = 3000 // 3s

  try {
    // Ensure the client is connected
    if (!redisClient.isOpen) {
      await redisClient.connect()
    }

    for (let i = 0; i < retryTimes; i++) {
      const result = await redisClient.set(key, 'lock', {
        NX: true,  // Only set if key doesn't exist
        PX: expireTime  // Expire in milliseconds
      })

      console.log(`result::`, result)

      if (result === true) {
        const isReservation = await reservationInventory({
          productId, quantity, cardId
        })

        if (isReservation.modifiedCount) {
          return key
        }

        return key
      } else {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }
  } catch (error) {
    console.error('Redis lock error:', error)
    throw error
  }
}

const releaseLock = async (keyLock) => {
  try {
    // Ensure the client is connected
    if (!redisClient.isOpen) {
      await redisClient.connect()
    }

    return await redisClient.del(keyLock)
  } catch (error) {
    console.error('Redis unlock error:', error)
    throw error
  }
}

// Ensure connection is established and closed properly
const initializeRedis = async () => {
  try {
    await redisClient.connect()
  } catch (error) {
    console.error('Redis connection error:', error)
  }
}

const closeRedis = async () => {
  try {
    await redisClient.quit()
  } catch (error) {
    console.error('Redis disconnection error:', error)
  }
}

module.exports = {
  acquireLock,
  releaseLock,
  initializeRedis,
  closeRedis
}
