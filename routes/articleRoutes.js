const express = require('express');
const { createArticle, updateArticle,getArticle, getAllArticles,deleteArticle,deleteArticlesByShopId,getArticlesByShop} = require('../controllers/articleController');
const router = express.Router();

router.post('/createArticle', createArticle);
router.put('/updateArticle/:id', updateArticle);
router.get('/getAllArticles', getAllArticles);
router.get('/getAllArticlesByShopId/:shopId', getArticlesByShop);
router.get('/getArticle', getArticle);
router.delete('/deleteArticle/:id',deleteArticle);
router.delete('/deleteArticleByShop/:shopId',deleteArticlesByShopId);

module.exports = router;
