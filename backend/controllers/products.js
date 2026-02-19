const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const products = await Product.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Product.countDocuments(query);
        res.send({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).send({ error: 'Could not fetch products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send({ error: 'Product not found' });
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: 'Could not fetch product' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            seller: req.user._id
        });
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(400).send({ error: 'Could not create product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).send({ error: 'Product not found' });
        res.send(product);
    } catch (error) {
        res.status(400).send({ error: 'Could not update product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        // Only allow admins to delete products
        if (req.user.role !== 'admin') {
            return res.status(403).send({ error: 'Access denied. Admin only.' });
        }

        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send({ error: 'Product not found' });
        res.send({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).send({ error: 'Could not delete product' });
    }
};
