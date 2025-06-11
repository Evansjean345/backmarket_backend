const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrls: [{ type: String }], 
  discount:{
    applyDiscount : {type: Boolean, required: true},
    newPrice : {type : Number, required: true},
    percentDiscount : {type:Number, required: true}
  },
  stock: { type: Number, required: true, default: 0 },
  shop: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true 
  }, // Article lié à une boutique
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', articleSchema);
