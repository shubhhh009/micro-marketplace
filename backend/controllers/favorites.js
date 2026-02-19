const User = require('../models/User');
const Product = require('../models/Product');

exports.addFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const [user, product] = await Promise.all([
            User.findById(req.user._id),
            Product.findById(productId)
        ]);

        if (!product) return res.status(404).send({ error: 'Product not found' });

        if (!user.favorites.some(id => id.toString() === productId)) {
            user.favorites.push(productId);
            await user.save();
        }

        const updatedUser = await User.findById(req.user._id).populate('favorites');
        res.send(updatedUser.favorites.filter(f => f !== null));
    } catch (error) {
        res.status(400).send({ error: 'Could not add to favorites' });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);

        user.favorites = user.favorites.filter(id => id.toString() !== productId);
        await user.save();

        const updatedUser = await User.findById(req.user._id).populate('favorites');
        res.send(updatedUser.favorites.filter(f => f !== null));
    } catch (error) {
        res.status(400).send({ error: 'Could not remove from favorites' });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.send(user.favorites);
    } catch (error) {
        res.status(500).send({ error: 'Could not fetch favorites' });
    }
};
