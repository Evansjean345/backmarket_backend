const Order = require('../../models/orderModel');
const Article = require('../../models/articleModel');
const rgx = require("../../bin/utils");


/**
 * Constructs a criteria object for querying a database based on provided parameters.
 *
 * @param {string} q - The search query string used for matching specific fields.
 * @param {string} start_date - The start date for filtering the creation date range.
 * @param {string} end_date - The end date for filtering the creation date range.
 * @param {string} filter - A specific filter for the status field.
 * @return {Object} A criteria object with the necessary query conditions for database searching.
 */
const createCriteria = (q, start_date, end_date, filter) => {
    const searchRgx = rgx(q);
    let dateCriteria = {};

    if (start_date && end_date) {
        dateCriteria = {
            createdAt: {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            }
        };
    } else if (start_date) {
        dateCriteria = {
            createdAt: {
                $eq: new Date(start_date)
            }
        };
    }

    return {
        ...dateCriteria,
        ...(q ? {
            $or: [
                {'customer.name': {$regex: searchRgx, $options: 'i'}},
                {'customer.phone': {$regex: searchRgx, $options: 'i'}},
                {status: {$regex: searchRgx, $options: 'i'}},
                {totalAmount: !isNaN(q) ? parseInt(q) : undefined}
            ].filter(Boolean) // Pour éliminer les entrées invalides dans l'array
        } : {}),
        ...(filter ? {status: filter} : {})
    };

}

/**
 * Retrieves orders for a specific shop.
 *
 * This function takes a `shopId` as an argument and returns a list of orders associated with that shop.
 * It interacts with a database or data source to fetch the relevant order information.
 *
 * @param {string} shopId - The unique identifier of the shop whose orders are to be retrieved.
 * @returns {Promise<Array>} - A promise that resolves to an array of order objects associated with the specified shop.
 * @throws {Error} Throws an error if the shopId is not provided or if an error occurs during the database query.
 */
exports.getOrdersByShop = async (req, res) => {
    const {shopId} = req.params; // Assurez-vous que l'ID du shop est passé dans les paramètres de la requête
    const {
        q = "",
        filter = "",
        start_date = "",
        end_date = ""
    } = req.query

    try {
        const searchCriteria = createCriteria(q, start_date, end_date, filter)
        const criteria = {'shopOrders.shopId': shopId, ...searchCriteria}

        const orders = await Order.find(criteria)
            .populate('customer') // Récupérer les informations du client
            .populate({
                path: 'shopOrders.items.itemId', // Chemin vers les articles
                model: 'Article', // Modèle pour les articles
            })
            .sort({createdAt: -1});

        res.status(200).json({...orders});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAllOrders = async (req, res) => {
    const {
        q = "",
        filter = "",
        start_date = "",
        end_date = "",
        page = 1,
        limit = 10
    } = req.query

    const searchCriteria = createCriteria(q, start_date, end_date, filter)

    try {
        const orders = await Order.find(searchCriteria)
            .populate('customer') // Récupérer les informations du client
            .populate({
                path: 'shopOrders.items.itemId', // Chemin vers les articles dans shopOrders
                model: 'Article', // Modèle des articles
            })
            .populate({
                path: 'shopOrders.shopId', // Récupérer les informations des boutiques associées
                model: 'Shop', // Modèle des boutiques (si vous avez un modèle de boutique)
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalOrders / limit);

        res.status(200).json({
            data: orders,
            current_page: parseInt(page),
            from: (page - 1) * limit + 1,
            last_page: totalPages,
            per_page: parseInt(limit),
            to: Math.min(page * limit, totalOrders),
            total: totalOrders
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};