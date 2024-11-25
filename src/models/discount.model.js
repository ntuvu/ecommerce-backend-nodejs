const {model, Schema, Types} = require("mongoose");

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema({
  discount_name: {
    type: String,
    required: true
  },
  discount_description: {
    type: String,
    required: true
  },
  discount_type: {
    type: String,
    default: 'fixed_amount', // percentage
  },
  discount_value: {
    type: Number,
    required: true
  }, // 10000 10
  discount_code: {
    type: String,
    required: true
  },
  discount_start_date: {
    type: Date,
    required: true
  },
  discount_end_date: {
    type: Date,
    required: true
  },
  discount_max_uses: { // so luong discount dc ap dung
    type: Number,
    required: true
  },
  discount_uses_count: { // so discount da su dung
    type: Number,
    required: true
  },
  discount_users_used: { // ai da dung
    type: Array,
    default: []
  },
  discount_max_uses_per_user: { // so luong cho phep toi da dc dung cho moi user
    type: Number,
    required: true
  },
  discount_min_order_value: { // gia tri don hang toi thieu de dc su dung discount
    type: Number,
    required: true
  },
  discount_shopId: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  discount_is_active: {
    type: Boolean,
    default: true
  },
  discount_applies_to: {
    type: String,
    required: true,
    enum: ['all', 'specific']
  },
  discount_product_ids: { // so san pham dc ap dung neu discount_applies_to = specific
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, discountSchema)
