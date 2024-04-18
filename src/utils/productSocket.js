const { Server } = require('socket.io');
const { readDataFromFile, writeDataToFile } = require('../views/utils.js');

function initializeProductSocket(httpServer) {
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('Cliente conectado al socket de productos');

        const products = readDataFromFile('productos.json');
        socket.emit('productos_actualizados', products);

        socket.on('agregar_producto', (producto) => {
            console.log('Nuevo producto recibido:', producto);

            let products = readDataFromFile('productos.json');
            const newProductId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            const newProduct = { id: newProductId, ...producto };

            products.push(newProduct);
            writeDataToFile('productos.json', products);
            io.emit('productos_actualizados', products);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado del socket de productos');
        });
    });
}

module.exports = initializeProductSocket;
