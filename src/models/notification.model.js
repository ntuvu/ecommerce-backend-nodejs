const {model, Schema, Types} = require("mongoose");

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'


const notificationSchema = new Schema({
    noti_type: {
        type: String,
        // ORDER-001: success
        // ORDER-002: fail
        // PROMOTION-001: new promotion
        // SHOP-001: new product by User following
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        required: true
    },
    noti_senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    noti_receivedId: {
        type: Number,
        required: true
    },
    noti_content: {
        type: String,
        required: true
    },
    noti_options: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, notificationSchema)
