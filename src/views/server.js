const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const http = require('http');
const io = require('socket.io');
const productsRouter = require('../routes/productsRouter.js');
const cartsRouter = require('../routes/cartsRouter.js');

const app = express();
const PORT = 8080;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.send('Bienvenido a la página principal');
});

const server = http.createServer(app);
const socketServer = io(server);

socketServer.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
