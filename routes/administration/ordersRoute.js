const express = require("express");
const {getOrdersByShop, getAllOrders} = require("../../controllers/administration/orderController");

const router = express.Router();

// Recupère la liste des commandes d'un shop //
router.get('/getOrdersByShop/:shopId', getOrdersByShop);
// Recupère la liste des commandes de tous les shops //
router.get('/getAllOrders', getAllOrders);

module.exports = router;