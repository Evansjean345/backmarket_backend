const mongoose = require('mongoose');

//modèle des articles appartenant à lacommande 
const orderItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

// modèle de la commande générale
const orderSchema = new mongoose.Schema({
  articles: [
    {
      article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  delivery: {
    type: Boolean,
    required: true,
  },
  deliveryFee: { type: Number, default: 0 },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
  },
  // deliveryLocation: {
  //   description: { type: String, required: function() { return !this.selectedLocation; } },
  //   coordinates: {
  //     lat: { type: Number },
  //     lng: { type: Number }
  //   }
  // },
  shopOrders: [
    {
      shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
      items: [orderItemSchema],
      total: { type: Number, required: true }
    }
  ],
  status: {
    type: String,
    enum: ['new', 'pending', 'processing', 'completed', 'canceled'],
    default: 'new',
  },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
