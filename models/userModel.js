const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default:'user' }, // Peut être 'user', 'admin', ou 'manager'
  shopsManaged: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }], // Boutiques gérées par l'utilisateur
  followingShops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }], // Boutiques suivies par l'utilisateur
});


// Hasher le mot de passe avant la sauvegarde
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
