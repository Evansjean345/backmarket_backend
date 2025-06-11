const mongoose = require('mongoose');

// Shop Schema
const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  profilePic:{type: String},
  bannerPic:{type: String},
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User manager de la boutique
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],  // Référence aux articles
  openingHours: { type: String, },  // Heures d'ouverture
  closingHours: { type: String,  },  // Heures de fermeture
  isPhysicalStore:{type: Boolean, required: true}, // Boutique physique ou boutique virtuelle
  address: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Followers de la boutique
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String }
    }
  ],  // Évaluations de la boutique
  phoneNumber: { type: String, required: true },   // Numéro de téléphone
  email: { type: String},   // Numéro de téléphone
  accountType:{type:String,default:"standard",enum:["standard","vip","corporate"]},
  socialMediaLinks: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String }
  },  // Liens vers les réseaux sociaux
  createdAt: { type: Date, default: Date.now }  // Date de création de la boutique
});

module.exports = mongoose.model('Shop', shopSchema);
