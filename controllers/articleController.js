const Article = require('../models/articleModel');
const mongoose = require('mongoose');
const cloudinary = require('../services/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration de Multer pour stocker les images directement sur Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'articles-back-market', // Le nom du dossier dans Cloudinary
    format: async (req, file) => 'jpg', // Format des images (par défaut 'jpg')
    public_id: (req, file) => Date.now(), // Renomme les fichiers avec un timestamp
  },
});

// Middleware Multer pour gérer plusieurs images (2 maximum)
const upload = multer({ storage: storage }).array('imageUrls'); 

// Créer un article avec upload des images sur Cloudinary
exports.createArticle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors du téléchargement des images' });
    }

    // Extraire et parser les données du body
    const { name, category, description, subCategory, price, shop, stock } = req.body;
    let discount;

    // Assurez-vous que discount est un objet parsé correctement
    try {
      discount = req.body.discount ? JSON.parse(req.body.discount) : {};
    } catch (parseError) {
      return res.status(400).json({ message: 'Erreur de parsing du discount' });
    }

    // Validation des champs de discount
    if (
      discount &&
      (typeof discount.percentDiscount === 'undefined' ||
        typeof discount.newPrice === 'undefined' ||
        typeof discount.applyDiscount === 'undefined')
    ) {
      return res.status(400).json({
        message: 'Les champs percentDiscount, newPrice, et applyDiscount sont requis dans discount',
      });
    }

    // URLs Cloudinary des images
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    try {
      const newArticle = new Article({
        name,
        category,
        subCategory,
        description,
        price,
        shop,
        stock,
        discount,
        imageUrls, // URLs des images sur Cloudinary
      });
      await newArticle.save();
      res.status(201).json(newArticle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// Mise à jour d'un article avec upload des images sur Cloudinary
exports.updateArticle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors du téléchargement des images' });
    }

    const { id } = req.params;
    const { name, category, subCategory, description, price, stock } = req.body;
    let discount;

    // Parsing et validation de l'objet discount
    try {
      discount = req.body.discount ? JSON.parse(req.body.discount) : {};
    } catch (parseError) {
      return res.status(400).json({ message: 'Erreur de parsing du discount' });
    }

    if (
      discount &&
      (typeof discount.percentDiscount === 'undefined' ||
        typeof discount.newPrice === 'undefined' ||
        typeof discount.applyDiscount === 'undefined')
    ) {
      return res.status(400).json({
        message: 'Les champs percentDiscount, newPrice, et applyDiscount sont requis dans discount',
      });
    }

    const imageUrls = req.files ? req.files.map((file) => file.path) : []; // URLs des nouvelles images

    try {
      const updatedArticle = await Article.findByIdAndUpdate(
        id,
        {
          name,
          description,
          category,
          subCategory,
          price,
          stock,
          discount,
          $push: { imageUrls: { $each: imageUrls } }, // Ajouter les nouvelles images
        },
        { new: true }
      );
      if (!updatedArticle) return res.status(404).json({ message: 'Article non trouvé' });
      res.json(updatedArticle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};


// Récupérer un article
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('shop');
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('shop');
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les articles d'un shop spécifique
exports.getArticlesByShop = async (req, res) => {
  const { shopId } = req.params; // Assurez-vous que l'ID du shop est passé dans les paramètres de la requête

  try {
    // Chercher tous les articles appartenant au shop spécifié
    const articles = await Article.find({ shop: shopId }).populate('shop');
    if (articles.length === 0) {
      return res.status(404).json({ message: 'Aucun article trouvé pour ce shop' });
    }
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un article
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.status(200).json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer tous les articles d'un shop
exports.deleteArticlesByShopId = async (req, res) => {
  const { shopId } = req.params;
  try {
    // Utilisation correcte de l'opérateur new pour créer un ObjectId
    const objectId = new mongoose.Types.ObjectId(shopId);

    // Supprimer tous les articles avec le shopId correspondant
    const deletedArticles = await Article.deleteMany({ shop: objectId });

    // Vérifier si des articles ont été supprimés
    if (deletedArticles.deletedCount === 0) {
      return res.status(404).json({ message: 'Aucun article trouvé pour ce shopId' });
    }

    res.status(200).json({ message: `${deletedArticles.deletedCount} articles supprimés avec succès` });
  } catch (error) {
    console.error("Erreur lors de la suppression des articles:", error);
    res.status(500).json({ message: 'Erreur lors de la suppression des articles', error: error.message });
  }
};


