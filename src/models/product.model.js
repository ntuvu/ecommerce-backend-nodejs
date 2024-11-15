const {model, Schema} = require("mongoose");
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_thumb: {
    type: String,
    required: true,
  },
  product_description: {
    type: String
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
  },
  product_type: {
    type: String,
    required: true,
    enum: ['Electronic', 'Clothing', 'Furniture']
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true,
  },
  product_slug: {
    type: String
  },
  product_ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10
  },
  product_variations: {
    type: Array,
    default: []
  },
  isDraft: {
    type: Boolean,
    default: true,
    index: true,
    select: false
  },
  isPublish: {
    type: Boolean,
    default: false,
    index: true,
    select: false
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

productSchema.index({product_name: 'text', product_description: 'text'})

productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const electronicSchema = new Schema({
  manufacturer: {
    type: String,
    required: true,
  },
  model: {
    type: String,
  },
  color: {
    type: String,
  },
}, {
  collection: 'electronics',
  timestamps: true
})

const clothingSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  size: {
    type: String,
  },
  material: {
    type: String,
  },
}, {
  collection: 'clothes',
  timestamps: true
})

const furnitureSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  size: {
    type: String,
  },
  material: {
    type: String,
  }
}, {
  collection: 'furnitures',
  timestamps: true
})

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronic', electronicSchema),
  clothing: model('Clothing', clothingSchema),
  furniture: model('Furniture', furnitureSchema),
}
