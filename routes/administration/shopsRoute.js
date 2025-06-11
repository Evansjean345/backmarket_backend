const express = require("express");
const {findShop, getAllShops} = require("../../controllers/administration/shopController");

const router = express.Router();

router.get('/getShop/:shopId', findShop);
router.get('/getAllShops', getAllShops)

module.exports = router;