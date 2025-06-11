const Shop = require('../models/shopModel');
const cloudinary = require('../services/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration de Multer pour stocker les images directement sur Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'boutique-back-market', // Le nom du dossier dans Cloudinary
    format: async (req, file) => 'jpg', // Format des images (par défaut 'jpg')
    public_id: (req, file) => Date.now(), // Renomme les fichiers avec un timestamp
  },
});


// Ajouter une boutique
exports.addShop = async (req, res) => {
  try {
    const shop = new Shop(req.body);
    await shop.save();
    res.status(201).json(shop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Supprimer une boutique
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Boutique non trouvée' });
    }
    res.status(200).json({ message: 'Boutique supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier une boutique
exports.updateShop = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    openingHours,
    isPhysicalStore,
    closingHours,
    address,
    phoneNumber,
    email,
  } = req.body;

  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: 'Boutique non trouvée' });
    }

    // Log incoming data
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    // Update text fields
    shop.name = name || shop.name;
    shop.description = description || shop.description;
    shop.openingHours = openingHours || shop.openingHours;
    shop.closingHours = closingHours || shop.closingHours;
    shop.isPhysicalStore = isPhysicalStore || shop.isPhysicalStore;
    shop.address = address || shop.address;
    shop.phoneNumber = phoneNumber || shop.phoneNumber;
    shop.email = email || shop.email;

    // Update image fields if they exist
    if (req.files && req.files['bannerPic']) {
      shop.bannerPic = req.files['bannerPic'][0].path;
    }
    if (req.files && req.files['profilePic']) {
      shop.profilePic = req.files['profilePic'][0].path;
    }

    await shop.save();
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Récupérer une boutique
exports.getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('articles manager followers');
    if (!shop) {
      return res.status(404).json({ message: 'Boutique non trouvée' });
    }
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les boutiques
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('articles manager followers');
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
