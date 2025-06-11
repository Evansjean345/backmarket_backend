const  mongoose = require("mongoose");
const categorieSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  subCategories: [{ type: String }],
});

module.exports = mongoose.model("Categorie", categorieSchema);
