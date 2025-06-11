const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  const userRole = role || 'user';

  try {
    // Vérifier si l'email existe déjà
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(422).json({ errors: { email: ['Cet adresse email existe déjà'] } });
    }

    // Vérifier si le téléphone existe déjà
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(422).json({ errors: { phone: ['Ce numéro de téléphone existe déjà'] } });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({ name, email, phone, password, role: userRole });
    await newUser.save();

    // Générer un token JWT
    const token = jwt.sign({ id: newUser._id }, 'jwt_secret', { expiresIn: '1h' });

    // Retourner la réponse JSON
    res.json({ token, id: newUser._id, newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'user not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'jwt_secret', { expiresIn: '1h' });
    res.json({token : token,id:user._id, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Vérifier si l'adresse existe déjà pour un autre utilisateur
    if (email) {
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail && existingUserWithEmail._id.toString() !== req.params.id) {
        return res.status(422).json({ errors: { email: ['Cette adresse email existe déjà'] } });
      }
    }

    // Vérifier si le numéro de téléphone existe déjà pour un autre utilisateur
    if (phone) {
      const existingUserWithPhone = await User.findOne({ phone });
      if (existingUserWithPhone && existingUserWithPhone._id.toString() !== req.params.id) {
        return res.status(422).json({ errors: { phone: ['Ce numéro de téléphone existe déjà'] } });
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer un utilisateur
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('shopsManaged followingShops');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('shopsManaged followingShops');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour le mot de passe d'un utilisateur
exports.updatePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.params.id;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mettre à jour le champ du mot de passe
    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Rechercher un utilisateur par email ou numéro de téléphone en utilisant un paramètre 'q'
exports.searchUser = async (req, res) => {
  const { q } = req.query;

  try {
    // Vérifier si le paramètre 'q' est fourni
    if (!q) {
      return res.status(400).json({ message: 'Veuillez fournir une valeur de recherche pour le paramètre "q"' });
    }

    // Construire dynamiquement le critère de recherche
    const searchCriteria = {
      $or: [{ email: q }, { phone: q }]
    };

    // Rechercher l'utilisateur avec le critère fourni
    const user = await User.findOne(searchCriteria);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};