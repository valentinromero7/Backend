const express = require('express');
const { readDataFromFile, writeDataToFile } = require('../views/utils.js');

const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
    const newCart = { id: Math.floor(Math.random() * 1000) + 1, products: [] };
    const carts = readDataFromFile('carrito.json');
    carts.push(newCart);
    writeDataToFile('carrito.json', carts);
    res.status(201).json({ id: newCart.id });
});

cartsRouter.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const carts = readDataFromFile('carrito.json');
    const cart = carts.find(cart => cart.id === parseInt(cartId));
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        const carts = readDataFromFile('carrito.json');
        const cartIndex = carts.findIndex(cart => cart.id === parseInt(cartId));
        if (cartIndex !== -1) {
            let cart = carts[cartIndex];
            const productIndex = cart.products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ id: productId, quantity: quantity });
            }
            writeDataToFile('carrito.json', carts);
            res.status(201).send('Producto agregado al carrito');
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

module.exports = cartsRouter;
