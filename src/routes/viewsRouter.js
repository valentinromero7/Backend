const express = require('express');
const router = express.Router();
const fs = require('fs');

const productsFilePath = 'ruta/al/json/de/productos.json';

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/products', (req, res) => {
    try {
        const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
        res.render('products', { products: productsData });
    } catch (error) {
        console.error("Error al leer el archivo de productos:", error.message);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/realtimeproducts', (req, res) => {
    try {
        const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
        res.render('realTimeProducts', { products: productsData });
    } catch (error) {
        console.error("Error al leer el archivo de productos:", error.message);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
