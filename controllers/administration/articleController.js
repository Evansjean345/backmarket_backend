const Article = require('../../models/articleModel');
const mongoose = require('mongoose');
const rgx = require("../../bin/utils");

const createSearchCriteria = (q) => {
    const searchRgx = rgx(q);
    return q ? {
        $or: [
            {name: {$regex: searchRgx, $options: 'i'}},
            {category: {$regex: searchRgx, $options: 'i'}},
            {subCategory: {$regex: searchRgx, $options: 'i'}},
            {price: !isNaN(q) ? parseInt(q) : undefined}
        ].filter(Boolean)  // Pour éliminer les entrées invalides dans l'array
    } : {}
}

// Récupérer tous les articles
exports.getAllArticles = async (req, res) => {
    const { page = 1, limit = 10, q = ""} = req.query;

    try {
        const searchCriteria = createSearchCriteria(q);
        const articles = await Article.find(searchCriteria)
            .populate('shop')
            .sort({createdAt: -1})
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalArticles = await Article.countDocuments(searchCriteria);

        const totalPages = Math.ceil(totalArticles / limit);

        res.status(200).json({
            data: articles,
            current_page: parseInt(page),
            from: (page - 1) * limit + 1,
            last_page: totalPages,
            per_page: parseInt(limit),
            to: Math.min(page * limit, totalArticles),
            total: totalArticles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les articles d'un shop spécifique
exports.getArticlesByShop = async (req, res) => {
    const { shopId } = req.params; // L'identifiant de la boutique passé en paramètre
    const { page = 1, limit = 10, q = "" } = req.query; // page par défaut = 1 et limit par défaut = 10

    try {
        const searchCriteria = {shop: shopId, ...createSearchCriteria(q)}

        // Chercher tous les articles appartenant au shop spécifié avec pagination
        const articles = await Article.find(searchCriteria)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalArticles = await Article.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalArticles / limit);

        res.status(200).json({
            data: articles,
            current_page: parseInt(page),
            from: (page - 1) * limit + 1,
            last_page: totalPages,
            per_page: parseInt(limit),
            to: Math.min(page * limit, totalArticles),
            total: totalArticles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


