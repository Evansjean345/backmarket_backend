const express = require('express');
const { addShop, updateShop,getShop, getAllShops,deleteShop} = require('../controllers/shopController');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../services/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'boutique-back-market', // Le nom du dossier dans Cloudinary
    format: async (req, file) => 'jpg', // Format des images (par défaut 'jpg')
    public_id: (req, file) => Date.now(), // Renomme les fichiers avec un timestamp
  },
});

const upload = multer({ storage: storage }).fields([
  { name: 'bannerPic', maxCount: 1 },
  { name: 'profilePic', maxCount: 1 },
]);

const debugMiddleware = (req, res, next) => {
  console.log('Multer Files:', req.files);
  console.log('Multer Body:', req.body);
  next();
};

router.get('/getAllShops', getAllShops);
router.get('/getShop', getShop);
router.post('/createShop', addShop);
router.put('/updateShop/:id', upload, debugMiddleware, updateShop);
router.delete('/deleteShop/:id',deleteShop);

module.exports = router;
