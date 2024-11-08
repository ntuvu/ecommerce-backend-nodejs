// lv0
// const config = {
//   app: {
//     port: 3000
//   },
//   db: {
//     host: 'localhost',
//     port: 27017,
//     name: 'shopDEV'
//   }
// }

// lv1
// const dev = {
//   app: {
//     port: 3000
//   },
//   db: {
//     host: 'localhost',
//     port: 27017,
//     name: 'shopDEV'
//   }
// }
//
// const product = {
//   app: {
//     port: 3000
//   },
//   db: {
//     host: 'localhost',
//     port: 27017,
//     name: 'shopDEV'
//   }
// }

// lv2
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3052
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDEV'
  }
}

const product = {
  app: {
    port: process.env.PRODUCT_APP_PORT || 3000
  },
  db: {
    host: process.env.PRODUCT_DB_HOST || 'localhost',
    port: process.env.PRODUCT_DB_PORT || '27017',
    name: process.env.PRODUCT_DB_NAME || 'shopPRODUCT'
  }
}

const config = {dev, product}
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]
