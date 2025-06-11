const Categorie = require('../models/categorieModel'); // Assurez-vous que le chemin est correct

// Récupérer toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.status(200).json(categories);
  } catch (error) { 
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une catégorie
exports.addCategory = async (req, res) => {
  try {
    const { category, subCategories } = req.body;
    const newCategory = new Categorie({
      category: category,
      subCategories,
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ajouter une sous-catégorie
exports.addSubCategory = async (req, res) => {
  try {
    const { category, subCategory } = req.body;
    const findCategory = await Categorie.findOne({ category: category });

    if (!findCategory) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    
    findCategory.subCategories.push(subCategory);
    await findCategory.save(); 
    res.status(200).json(findCategory); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ajouter plusieurs catégories et plusieurs sous-catégories
exports.addCategoriesAndSubCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    const newCategories = await Categorie.insertMany(categories);
    res.status(200).json(newCategories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
