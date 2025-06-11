const Order = require('../models/orderModel');
const Article = require('../models/articleModel');
const sendOrderConfirmation = require('../services/email');
const req = require("express/lib/request");
// Create order
exports.createOrder = async (req, res) => {
  // const { articles, shop, customer, delivery, deliveryLocation } = req.body;
  // console.log(articles);
  // try {
  //   let totalPrice = 0;
  //   const deliveryFee = delivery ? 2000 : 0; // Example fee

  //   for (const item of articles) {
  //     const article = await Article.findById(item.article);
  //     if (!article) return res.status(404).json({ message: 'Article not found' });
  //     totalPrice += article.price * item.quantity;
  //   }

  //   totalPrice += deliveryFee;

  //   const newOrder = new Order({
  //     articles,
  //     shop,
  //     totalPrice,
  //     delivery,
  //     deliveryFee,
  //     deliveryLocation,
  //     customer,
  //   });

  //   await newOrder.save();
  //   res.status(201).json(newOrder);
  // } catch (error) {
  //   res.status(400).json({ message: error.message });
  // }

  const { customer, delivery, items } = req.body;

  try {
    // Regrouper les articles par boutique
    const shopOrders = [];
    const shopMap = new Map();

    for (const item of items) {
      try {
        // Récupérer l'article avec son magasin associé
        const article = await Article.findById(item.itemId).populate('shop');

        // Si l'article n'existe pas
        if (!article) {
          return res.status(400).json({ message: `Article with ID ${item.itemId} not found` });
        }

        // Assurez-vous que l'article a bien un magasin associé
        const shopId = article.shop?._id;
        if (!shopId) {
          return res.status(400).json({ message: `Shop not found for article ID ${item.itemId}` });
        }

        // Initialiser la commande pour ce magasin s'il n'existe pas encore dans le Map
        if (!shopMap.has(shopId)) {
          shopMap.set(shopId, { shopId, items: [], total: 0 });
        }

        // Ajouter l'article à la commande de ce magasin
        const shopOrder = shopMap.get(shopId);
        shopOrder.items.push({
          itemId: item.itemId,
          quantity: item.quantity,
          price: article.price,
        });

        // Mettre à jour le total pour ce magasin
        shopOrder.total += item.quantity * article.price;

      } catch (error) {
        // Gestion des erreurs lors de la récupération des articles ou autres erreurs imprévues
        return res.status(500).json({ message: `Error processing item ID ${item.itemId}: ${error.message}` });
      }
    }


    shopMap.forEach((value) => {
      shopOrders.push(value);
    });

    const totalAmount = shopOrders.reduce((acc, order) => acc + order.total, 0);

    // Créer la commande
    const order = new Order({
      customer,
      delivery,
      shopOrders,
      totalAmount
    });

    await order.save();

    res.status(201).json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log("status", status);
  console.log("id", id);
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    order.status = status;
    await order.save();
    await sendOrderConfirmation(order.customer.email, order);
    res.status(200).json({ message: 'Statut de la commande mis à jour', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une commande
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('articles.article customer shop');
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les commandes avec les informations des articles, clients, et boutiques
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer') // Récupérer les informations du client
      .populate({
        path: 'shopOrders.items.itemId', // Chemin vers les articles dans shopOrders
        model: 'Article', // Modèle des articles
      })
      // .populate({
      //   path: 'shopOrders.shopId', // Récupérer les informations des boutiques associées
      //   model: 'Shop', // Modèle des boutiques (si vous avez un modèle de boutique)
      // });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Récupérer les commandes par boutique avec les informations des articles et du client
exports.getOrdersByShop = async (req, res) => {
  const { shopId } = req.params; // Assurez-vous que l'ID du shop est passé dans les paramètres de la requête

  try {
    // Chercher toutes les commandes appartenant au shop spécifié
    const orders = await Order.find({ 'shopOrders.shopId': shopId })
      .populate('customer') // Récupérer les informations du client
      .populate({
        path: 'shopOrders.items.itemId', // Chemin vers les articles
        model: 'Article', // Modèle pour les articles
      });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Aucune commande trouvée pour cette boutique' });
    }

    res.status(200).json({...orders});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Supprimer une commande
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByShopForAdmin = async (req, res) => {
  try {
    const {shopId} = req.params
    const {
      sortField = 'createdAt', // Champ par défaut pour le tri
      sortOrder = 'desc', // Ordre de tri par défaut
      startDate,
      endDate,
      status,
      customerId
    } = req.query;
  } catch(error) {
    res.status(500).json({error: error.message})
  }
}