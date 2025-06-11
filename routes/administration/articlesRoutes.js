const {getAllArticles} = require("../../controllers/administration/articleController");
const express = require("express");
const {getArticlesByShop} = require("../../controllers/administration/articleController");

const router = express.Router();

// Recupère la liste des articles //
router.get('/getAllArticles', getAllArticles);
router.get('/getAllArticlesByShopId/:shopId', getArticlesByShop);

module.exports = router;