const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

function readDataFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filename}: ${err}`);
        return [];
    }
}

function writeDataToFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing ${filename}: ${err}`);
    }
}

class ProductManager {
    #filePath;

    constructor(filePath) {
        this.#filePath = filePath;
    }

    getProducts() {
        try {
            const data = fs.readFileSync(this.#filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer el archivo de productos:", error.message);
            return [];
        }
    }

    addProduct(productData) {
        const products = this.getProducts();
        const existingProduct = products.find(product => product.code === productData.code);
        if (existingProduct) {
            throw new Error("El código de producto ya está en uso.");
        }
        const id = Math.floor(Math.random() * 1000) + 1;
        const product = {
            id,
            ...productData
        };
        products.push(product);
        this.saveProducts(products);
        return id;
    }

    updateProduct(id, newData) {
        const products = this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...newData };
            this.saveProducts(products);
        } else {
            console.error("Producto no encontrado.");
        }
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(product => product.id !== id);
        this.saveProducts(products);
    }

    saveProducts(products) {
        try {
            fs.writeFileSync(this.#filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error("Error al guardar los productos:", error.message);
        }
    }

    getProductByCode(code) {
        const products = this.getProducts();
        return products.find(product => product.code === code) || null;
    }
}

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

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.send('Bienvenido a la página principal');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
