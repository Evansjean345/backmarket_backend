const express = require('express');
const { createOrder, updateOrderStatus,getOrder,getAllOrders,deleteOrder,getOrdersByShop} = require('../controllers/orderController');
const router = express.Router();

router.post('/createOrder', createOrder);
router.put('/updateOrder/status/:id', updateOrderStatus);
router.get('/getOrder', getOrder);
router.get('/getAllOrders', getAllOrders);
router.get('/getOrdersByShop/:shopId', getOrdersByShop);
router.delete('/deleteOrder/:id', deleteOrder);

module.exports = router;
