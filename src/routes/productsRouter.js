const express = require('express');
const { ProductManager } = require('../utils/productManager');

const productsRouter = express.Router();
const productManager = new ProductManager("productos.json");

productsRouter.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProducts().find(product => product.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

productsRouter.post('/', (req, res) => {
    try {
        const productId = productManager.addProduct(req.body);
        res.status(201).json({ id: productId });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

productsRouter.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    productManager.updateProduct(productId, req.body);
    res.status(204).end();
});

productsRouter.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    productManager.deleteProduct(productId);
    res.status(204).end();
});

module.exports = productsRouter;
