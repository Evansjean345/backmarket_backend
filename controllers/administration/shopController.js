const Shop = require("../../models/shopModel");

exports.findShop = async (req, res) => {
    console.log(req.params.shopId);
    try {
        const shop = await Shop.findById(req.params.shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Boutique non trouvée' });
        }
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllShops = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const pageOptions = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10)
        };

        const shops = await Shop.find()
            .populate('articles manager followers')
            .sort({ createdAt: -1 }) // Trier les boutiques par date de création (du plus récent au plus ancien)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .limit(pageOptions.limit);

        const totalShops = await Shop.countDocuments();

        const totalPages = Math.ceil(totalShops / pageOptions.limit);

        res.status(200).json({
            data: shops,
            current_page: pageOptions.page,
            from: (pageOptions.page - 1) * pageOptions.limit + 1,
            last_page: totalPages,
            per_page: pageOptions.limit,
            to: Math.min(pageOptions.page * pageOptions.limit, totalShops),
            total: totalShops
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};